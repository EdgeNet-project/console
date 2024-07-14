<?php

namespace App\Console\Commands\Request;

use App\Model\UserRequest;
use App\Model\UserRequestStatus;
use Illuminate\Console\Command;

class CleanCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'edgenet:requests:clean
                                {--delete : Delete requests}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clean approved/denied user requests';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {

        $deleteOption = $this->option('delete');

        if ($deleteOption) {
            $this->info('Deleting approved or denied requests');

            UserRequest::whereIn('status', [
                UserRequestStatus::Approved,
                UserRequestStatus::Denied,
            ])->delete();

            return Command::SUCCESS;
        }

        $userRequestsCount = UserRequest::whereIn('status', [
            UserRequestStatus::Approved,
            UserRequestStatus::Denied,
        ])->count();

        $this->info('Found ' . $userRequestsCount . ' requests in pending or denied state');


        return Command::SUCCESS;
    }

}
