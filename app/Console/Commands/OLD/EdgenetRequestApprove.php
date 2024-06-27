<?php

namespace App\Console\Commands\OLD;

use Illuminate\Console\Command;
use RenokiCo\LaravelK8s\LaravelK8sFacade as K8s;
use RenokiCo\PhpK8s\Exceptions\KubernetesAPIException;

class EdgenetRequestApprove extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'edgenet:request:approve {name : Name of the Tenant request}';

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

        $name = $this->argument('name');


        $cluster = K8s::getCluster();

        try {
            $tenantRequest = $cluster->tenantRequest()->getByName($name);
        } catch (KubernetesAPIException $e) {

            $payload = $e->getPayload();
            $this->error($payload['message']);

            return Command::FAILURE;

        }


        if ($this->confirm('Approve ' . $tenantRequest->getFullname() . ' (' . $tenantRequest->getName() . ')?')) {
            //
        }

        return Command::SUCCESS;
    }
}
