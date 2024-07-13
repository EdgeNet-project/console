<?php

namespace App\Console\Commands\Node;

use App\Services\EdgenetAdmin;
use Illuminate\Console\Command;
use Illuminate\Support\Str;
use RenokiCo\PhpK8s\Exceptions\KubernetesAPIException;
use App\Model\Tenant as TenantModel;

class ListCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'edgenet:nodes:list';
//                            {--check : Check sync status}
//                            {--sync : sync}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'EdgeNet Nodes';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle(EdgenetAdmin $edgenetAdmin)
    {

        $cluster = $edgenetAdmin->getCluster();

        try {
            $remoteNodes = $cluster->node()->all();
        } catch (KubernetesAPIException $e) {
            dd([
                $e->getMessage(),
                $e->getPayload()
            ]);
        }

        $localNodes = TenantModel::all();

//        $checkSync = $this->option('check');
//
//        if ($checkSync) {
//
//            $remoteTeamsNames = collect(
//                $remoteTeams->map(function($item, $key) {
//                    return $item->getName();
//                })
//            );
//
//            foreach ($localTeams as $lteam) {
//                $output[] = [
//                    $lteam->name,
//                    $remoteTeamsNames->contains($lteam->name) ? 'PRESENT' : ''
//                ];
//            }
//
//            $this->table(
//                ['Local', 'Remote'],
//                $output
//            );
//
//            return Command::SUCCESS;
//        }
//
//        $edgenetSync = $this->option('sync');
//        if ($edgenetSync) {
//            $bar = $this->output->createProgressBar(count($localTeams));
//
//            $this->newLine();
//            $this->info('Synchronizing teams on ' . config('edgenet.cluster.host'));
//
//            $bar->start();
//
//            foreach ($localTeams as $lteam) {
//                CreateTeamJob::dispatch($lteam);
//                $bar->advance();
//            }
//
//            $this->newLine(2);
//            $bar->finish();
//
//            return Command::SUCCESS;
//        }

        if ($remoteNodes->count() == 0) {
            $this->newLine();
            $this->info('No nodes found');
            $this->newLine();
            return Command::SUCCESS;
        }

        $output = [];
        foreach ($remoteNodes as $n) {

            $output[] = [
                $n->getName(),
                join("\n", array_map(function($address) {
                    return $address['address'];
                }, $n->getStatus('addresses'))),
                $n->getStatus('nodeInfo.osImage') . ' - ' . $n->getStatus('nodeInfo.architecture') . "\n" .
                'Kernel ' . $n->getStatus('nodeInfo.kernelVersion') . "\n" .
                'Kubelet ' . $n->getStatus('nodeInfo.kubeletVersion') . "\n",

                join("\n", array_map(function($address) {
                    return $address['message'];
                }, $n->getStatus('conditions'))),

            ];



        }

        $this->table(
            ['Name', 'Addresses', 'Info', 'Status'],
            $output
        );

        return Command::SUCCESS;
    }
}
