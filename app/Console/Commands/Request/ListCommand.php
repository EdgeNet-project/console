<?php

namespace App\Console\Commands\Request;

use App\Model\UserRequest;
use Illuminate\Console\Command;

class ListCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'edgenet:requests:list
                                {--check : Check sync status}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'List and manage user requests';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {

        $this->listRequests();

        return Command::SUCCESS;
    }

    private function listRequests()
    {
        $userRequests = UserRequest::all();

        if ($userRequests->count() == 0) {
            $this->newLine();
            $this->info('No requests');
            $this->newLine();
            return Command::SUCCESS;
        }

        $output = [];
        foreach ($userRequests as $r) {

            $output[] = [
                $r->type->name ?? '',
                $r->status->name ?? '',
                $r->user->name . "\n" . $r->user->email,
                json_encode($r->data, JSON_PRETTY_PRINT)

            ];



        }

        $this->table(
            ['Type', 'Status', 'User', 'Data'],
            $output
        );
    }

}
