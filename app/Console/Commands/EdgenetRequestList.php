<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use RenokiCo\LaravelK8s\LaravelK8sFacade as K8s;

class EdgenetRequestList extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'edgenet:request:list';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'List and manage Tenant and RoleRequests';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {

        $cluster = K8s::getCluster();

        $tenantRequests = $cluster->tenantRequest()->all();

        $output = [];
        foreach ($tenantRequests as $t) {
            $contact = $t->getContact();

            $output[] = [
                $t->getName(),
                $t->getFullname() . "\n" . $t->getFulladdress() . "\n" . $t->getUrl(),
                $contact['firstname'] . ' ' . $contact['lastname'] . "\n" . $contact['email'] . "\n" . $contact['phone'],
                'Approved: ' . ($t->isApproved() ? 'Yes' : 'No') . "\n" .
                'State: ' . $t->getState() . "\n" .
                'Message: ' . $t->getMessage() . "\n" .
                'Expiry: ' . $t->getExpiry()->toRfc7231String() . "\n" .
                'Notified: ' . ($t->isNotified() ? 'Yes' : 'No') . "\n"

            ];



        }

        $this->table(
            ['Name', 'Info', 'Contact', 'Status'],
            $output
        );

        return Command::SUCCESS;
    }
}