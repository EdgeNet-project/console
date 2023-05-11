<?php

namespace App\Console\Commands;

use App\Model\SubNamespace;
use App\Model\Tenant;
use App\Model\TenantUser;
use App\Model\User;
use App\Services\EdgenetAdmin;
use Illuminate\Console\Command;
use Illuminate\Support\Str;
use RenokiCo\LaravelK8s\LaravelK8sFacade as K8s;
use RenokiCo\PhpK8s\Exceptions\KubernetesAPIException;

class EdgenetSubnamespaceSync extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'edgenet:subnamespace:sync';

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
    public function handle(EdgenetAdmin $edgenetAdmin)
    {

        $cluster = $edgenetAdmin->getCluster();

        $subnamespaces = $cluster->subNamespace()->allNamespaces();

        foreach ($subnamespaces as $subnamespace) {
            $this->line('Importing: ' . $subnamespace->getName());

            $tenant = Tenant::where('name', $subnamespace->getNamespace())->first();
            if (!$tenant->exists()) {
                $this->line(  '  #> no corresponding tenant found');
                continue;
            }

            $localSubnamespace = SubNamespace::firstOrCreate([
                'name' => $subnamespace->getName(),
                'namespace' => $subnamespace->getNamespace(),
                'tenant_id' => $tenant->id
            ]);

//            $roleBindings = $this->cluster->rolebinding()
//                ->setNamespace($tenant->getName());

            $this->syncUsers($cluster, $subnamespace->getName(), $localSubnamespace);
        }

        return Command::SUCCESS;
    }


    protected function syncUsers($cluster, $namespace, $localTenant)
    {
        $users = [];
        try {
            $roleBindings = $cluster->rolebinding()
                ->setNamespace($namespace)
                ->getByName('edgenet:tenant-owner');

            foreach($roleBindings->getSubjects() as $subject) {
                $this->line('  -> owner ' . $subject->getName());

                $users[$subject->getName()] = 'owner';
            }
        } catch (KubernetesAPIException $e) {
            $this->line(  '  #> no owners');
        }

        try {
            $roleBindings = $cluster->rolebinding()
                ->setNamespace($namespace)
                ->getByName('edgenet:tenant-admin');

            foreach($roleBindings->getSubjects() as $subject) {
                $this->line('  -> admin ' . $subject->getName());

                $users[$subject->getName()] = 'admin';
            }
        } catch (KubernetesAPIException $e) {
            $this->line(  '  #> no admins');
        }

        try {
            $roleBindings = $cluster->rolebinding()
                ->setNamespace($namespace)
                ->getByName('edgenet:tenant-collaborator');

            foreach ($roleBindings->getSubjects() as $subject) {
                $this->line('  -> collaborator ' . $subject->getName());

                $users[$subject->getName()] = 'collaborator';

            }
        } catch (KubernetesAPIException $e) {
            $this->line(  '  #> no collaborators');
        }


//        foreach ($users as $email => $role) {
//            $localUser = User::firstOrCreate(['email' => $email]);
//
//            TenantUser::updateOrCreate(
//                ['user_id' => $localUser->id, 'tenant_id' => $localTenant->id],
//                ['role' => $role]
//            );
//        }
    }
}
