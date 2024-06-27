<?php

namespace App\Console\Commands\OLD;

use App\Console\Commands\GuzzleHttp;
use Illuminate\Console\Command;
use Ovh\Api;

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
    protected $description = '';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {

        try {
            $ovh = new Api(
                env('OVH_APP_KEY'),
                env('OVH_APP_SECRET'),
                'ovh-eu',
                env('OVH_CONSUMER_KEY'));

            $this->info('OVH Request to /domain/zone/'.env('OVH_DOMAIN').'/record');

            $r = $ovh->get('/domain/zone/'.env('OVH_DOMAIN').'/record', [
//                'target' => '213.186.33.5'
                'fieldType' => 'A',
                'subDomain' => 'ingress',
            ]);

            dd($r);
//            $ovh->post('/domain/zone/'.env('OVH_DOMAIN').'/record', [
//                'fieldType' => 'A', //  (type: )
//                'subDomain' => 'test-node-name', // Record subDomain (type: string, nullable)
//                'target' => "132.227.123.70", // Target of the record (type: string)
//                'ttl' => 3600,
//            ]);
        } catch (GuzzleHttp\Exception\ClientException $e) {
            $response = $e->getResponse();
            $responseBodyAsString = $response->getBody()->getContents();
            $this->error($responseBodyAsString);
        } catch (\Exception $e) {
            dd($e);
            //$this->error("OVH API ERROR", ['message' => $e->getMessage()]);
        }


//        foreach (K8s::getAllConfigMaps() as $cm) {
//            $cm->getName();
//        }
//
//        $cluster = K8s::getCluster();
//
//        $nodes = $cluster->node()->all();
//
//        foreach ($nodes as $node) {
//            dd([
//                $node->getInfo(),
//                $node->getImages(),
//            $node->getCapacity(),
//            $node->getAllocatableInfo(),
//            ]);
//
//        }

        // Create a new instance of KubernetesCluster.
//        $cluster = KubernetesCluster::fromUrl(
//            config('edgenet.cluster.api.url')
//        );

        return Command::SUCCESS;
    }
}
