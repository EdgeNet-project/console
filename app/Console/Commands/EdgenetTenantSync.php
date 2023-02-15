<?php

namespace App\Console\Commands;

use App\Model\Tenant;
use App\Model\TenantUser;
use App\Model\User;
use Illuminate\Console\Command;
use Illuminate\Support\Str;
use RenokiCo\LaravelK8s\LaravelK8sFacade as K8s;
use RenokiCo\PhpK8s\Exceptions\KubernetesAPIException;

class EdgenetTenantSync extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'edgenet:tenant:sync';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $this->cluster = K8s::getCluster();

        $tenants = $this->cluster->tenant()->all();

        foreach ($tenants as $tenant) {
            $this->line('Importing: ' . $tenant->getFullname());

            $localTenant = Tenant::firstOrCreate(['name' => $tenant->getName()]);

            $contact = $tenant->getContact();
            $address = $tenant->getAddress();

            $localTenant->update([
                'fullname' => $tenant->getFullname(),
                'shortname' => $tenant->getShortname(),
                'url' => $tenant->getUrl(),
                'street' => $address['street'],
                'zipcode' => $address['zip'],
                'city' => $address['city'],
                'region' => $address['region'],
                'country' => $address['country'],
                'contact_name' => $contact['firstname'] . ' ' . $contact['lastname'],
                'contact_email' => $contact['email'],
                'contact_phone' => $contact['phone'],
            ]);

            $users = [];
            try {
                $roleBindings = $this->cluster->rolebinding()
                    ->setNamespace($tenant->getName())
                    ->getByName('edgenet:tenant-owner');

                foreach($roleBindings->getSubjects() as $subject) {
                    $this->line('  -> owner ' . $subject->getName());

                    $users[$subject->getName()][] = 'owner';
                }
            } catch (KubernetesAPIException $e) {
                $this->line(  '  #> no owners');
            }

            try {
                $roleBindings = $this->cluster->rolebinding()
                    ->setNamespace($tenant->getName())
                    ->getByName('edgenet:tenant-collaborator');

                foreach ($roleBindings->getSubjects() as $subject) {
                    $this->line('  -> owner ' . $subject->getName());

                    $users[$subject->getName()][] = 'collaborator';

                }
            } catch (KubernetesAPIException $e) {
                $this->line(  '  #> no collaborators');
            }


            foreach ($users as $email => $roles) {
                $localUser = User::firstOrCreate(['email' => $email]);

                TenantUser::updateOrCreate(
                    ['user_id' => $localUser->id, 'tenant_id' => $localTenant->id],
                    ['roles' => $roles]
                );
//                $localTenant->users()->syncWithPivotValues($localUser->id, ['roles' => $roles]);
            }

        }

        return Command::SUCCESS;
    }
}
