<?php

namespace App\Console\Commands;

use App\Services\EdgenetAdmin;
use Illuminate\Console\Command;
use Illuminate\Support\Str;
use RenokiCo\LaravelK8s\LaravelK8sFacade as K8s;

class EdgenetTenant extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'edgenet:tenant {name?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'List EdgeNet Tenants';

    protected $cluster;

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle(EdgenetAdmin $edgenetAdmin)
    {

        $cluster = $edgenetAdmin->getCluster();

        $name = $this->argument('name');
        if ($name) {
            $tenant = $cluster->tenant()->getByName($name);
//            dd($tenant);

            $contact = $tenant->getContact();

            $this->newLine();
            $this->line("Name:");
            $this->line($tenant->getName() . ' (' . $tenant->getFullname() . ')');
            $this->newLine();
            $this->line('Address:');
            $this->line($tenant->getFulladdress());
            $this->newLine();
            $this->line('Contact:');
            $this->line($contact['firstname'] . ' ' . $contact['lastname'] . "\n" . $contact['email'] . "\n" . $contact['phone']);
            $this->newLine();
            $this->line('Status:');
            $this->line('Enabled: ' . ($tenant->isApproved() ? 'Yes' : 'No') . "\n" .
                'State: ' . $tenant->getState() . "\n" .
                'Message: ' . $tenant->getMessage() . "\n");

            $role_bindings = $this->cluster->rolebinding()->setNamespace('cslash')->getByName('edgenet:tenant-owner');

            dd($role_bindings);

            $this->getClusterRoles('edgenet:tenant-owner', $this->getName() );

            return Command::SUCCESS;
        }

        $tenants = $cluster->tenant()->all();

        if ($tenants->count() == 0) {
            $this->newLine();
            $this->info('No tenants registered');
            $this->newLine();
            return Command::SUCCESS;
        }

        $output = [];
        foreach ($tenants as $t) {
            $contact = $t->getContact();

            $output[] = [
                $t->getName(),
                Str::substr($t->getFullname(), 0, 50),
                $contact['firstname'] . ' ' . $contact['lastname'] . "\n" . $contact['email'] . "\n" . $contact['phone'],
                'Enabled: ' . ($t->isApproved() ? 'Yes' : 'No') . "\n" .
                'State: ' . $t->getState() . "\n" .
                'Message: ' . $t->getMessage() . "\n"

            ];



        }

        $this->table(
            ['Name', 'Info', 'Contact', 'Status'],
            $output
        );

        return Command::SUCCESS;
    }

    protected function getClusterRoles($name, $namespace)
    {

    }
}
