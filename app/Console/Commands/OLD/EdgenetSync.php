<?php

namespace App\Console\Commands\OLD;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;

class EdgenetSync extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'edgenet:sync';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sync with EdgeNet';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        Artisan::call('edgenet:tenant:sync');

        return Command::SUCCESS;
    }
}
