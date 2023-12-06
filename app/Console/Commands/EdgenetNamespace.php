<?php

namespace App\Console\Commands;

use App\Services\EdgenetAdmin;
use Illuminate\Console\Command;
use RenokiCo\PhpK8s\K8s;

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

        foreach (K8s::getAllConfigMaps() as $cm) {
            echo $cm->getName();
        }

        return Command::SUCCESS;
        $namespaces = $edgenetAdmin->getCluster()->getAllNamespaces();

        dd($namespaces[13]);

        return Command::SUCCESS;
    }
}
