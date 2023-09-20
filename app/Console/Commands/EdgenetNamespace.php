<?php

namespace App\Console\Commands;

use App\Services\EdgenetAdmin;
use Illuminate\Console\Command;

class EdgenetNamespace extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'edgenet:namespace';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Edgenet Namespaces';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle(EdgenetAdmin $edgenetAdmin)
    {

        $namespaces = $edgenetAdmin->getCluster()->getAllNamespaces();

        dd($namespaces[13]);

        return Command::SUCCESS;
    }
}
