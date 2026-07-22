<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * The Artisan commands provided by your application.
     *
     * @var array
     */
    protected $commands = [
        //
    ];

    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
//        $schedule->command('edgenet:requests:clean --delete')
//            ->everyMinute();

        $schedule->job(new \App\Jobs\AggregateNodeMetricsHourly)->hourly();
        $schedule->job(new \App\Jobs\AggregateNodeMetricsDaily)->daily();
        $schedule->job(new \App\Jobs\AggregateNodeMetricsWeekly)->weekly();
        $schedule->job(new \App\Jobs\AggregateNodeMetricsMonthly)->monthly();
        $schedule->job(new \App\Jobs\CleanupNodeMetrics)->daily();
    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
