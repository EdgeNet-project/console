<?php

namespace App\Console\Commands;

use App\Services\EdgenetAdmin;
use Illuminate\Console\Command;

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
    public function handle(EdgenetAdmin $edgenetAdmin)
    {

        $tenantRequests = $edgenetAdmin->getCluster()->tenantRequest()->all();

        if ($tenantRequests->count() == 0) {
            $this->newLine();
            $this->info('No pending tenant requests');
            $this->newLine();
            return Command::SUCCESS;
        }

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
