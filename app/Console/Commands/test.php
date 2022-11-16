<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use RenokiCo\LaravelK8s\LaravelK8sFacade as K8s;

class test extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'edgenet:test';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {


        foreach (K8s::getAllConfigMaps() as $cm) {
            $cm->getName();
        }

        $cluster = K8s::getCluster();

        $nodes = $cluster->node()->all();

        foreach ($nodes as $node) {
            dd([
                $node->getInfo(),
                $node->getImages(),
            $node->getCapacity(),
            $node->getAllocatableInfo(),
            ]);

        }

        // Create a new instance of KubernetesCluster.
//        $cluster = KubernetesCluster::fromUrl(
//            config('edgenet.cluster.api.url')
//        );

        return Command::SUCCESS;
    }
}
