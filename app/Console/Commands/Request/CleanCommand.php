<?php

namespace App\Console\Commands\Request;

use App\Model\UserRequest;
use App\Model\UserRequestStatus;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

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

        $userRequestsCount = UserRequest::whereIn('status', [
            UserRequestStatus::Approved,
            UserRequestStatus::Denied,
        ])->count();

        $this->info('Found ' . $userRequestsCount . ' requests in pending or denied state');

        if ($this->option('delete') && $userRequestsCount > 0) {
            $this->info('-> deleting approved or denied requests');

            Log::info('deleting ' . $userRequestsCount . ' requests in pending or denied state');

            UserRequest::whereIn('status', [
                UserRequestStatus::Approved,
                UserRequestStatus::Denied,
            ])->delete();

        }

        return Command::SUCCESS;
    }

}
