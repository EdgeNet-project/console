<?php

namespace App\Console\Commands;

use App\Services\EdgenetAdmin;
use Illuminate\Console\Command;
use Ovh\Api;
use RenokiCo\PhpK8s\K8s;
use RenokiCo\PhpK8s\Kinds\K8sPod;

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
    public function handle(EdgenetAdmin $edgenetAdmin)
    {

        $cluster = $edgenetAdmin->getCluster();

        $s = $cluster->subNamespace()
            ->setName('this-is-a-wp')
            ->setNamespace('ttn')
            ->get();


        dd($s->getResourceUid());
        /*
         *
         * OVH TEST


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

        */

        return Command::SUCCESS;
    }
}
