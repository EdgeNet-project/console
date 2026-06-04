<?php

namespace App\Console\Commands;


use Illuminate\Console\Command;
use Illuminate\Support\Str;
use RenokiCo\PhpK8s\Exceptions\KubernetesAPIException;
use App\Jobs\EdgeNet\CreateWorkspaceJob;
use App\Model\SubNamespace;
use App\Services\EdgenetAdmin;

class EdgenetWorkspaces extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'edgenet:workspaces 
                            {--check : Check sync status}
                            {--sync : sync}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'EdgeNet Workspaces';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle(EdgenetAdmin $edgenetAdmin)
    {
        $cluster = $edgenetAdmin->getCluster();

        try {
            $clusterWorkspaces = $cluster->subNamespace()->allNamespaces();
        } catch (KubernetesAPIException $e) {
            dd([
                $e->getMessage(),
                $e->getPayload()
            ]);
        }

        $consoleWorkspaces = SubNamespace::all();

        $checkOption = $this->option('check');
        if ($checkOption) {
            $clusterWorkspacesNames = collect(
                $clusterWorkspaces->map(function($item, $key) {
                    return $item->getName();
                })
            );

            foreach ($consoleWorkspaces as $cworkspace) {
                $output[] = [
                    $cworkspace->name,
                    $clusterWorkspacesNames->contains($cworkspace->name) ? 'PRESENT' : ''
                ];
            }

            $this->table(
                ['Console', 'Cluster'],
                $output
            );

            return Command::SUCCESS;
        }

        $syncOption = $this->option('sync');
        if ($syncOption) {
            $clusterWorkspacesNames = collect(
                $clusterWorkspaces->map(function($item, $key) {
                    return $item->getName();
                })
            );

            $this->info('Synchronizing workspaces on ' . config('edgenet.cluster.host'));


            foreach ($consoleWorkspaces as $cworkspace) {
                $this->output->write('-> ' . $cworkspace->name);
                if (!$clusterWorkspacesNames->contains($cworkspace->name)) {
                    $this->output->writeln(' => not found - creating');
                    CreateWorkspaceJob::dispatch($cworkspace);
                } else {
                    $this->output->writeln(' => found - skipping');
                }
            }


            return Command::SUCCESS;
        }

        if ($clusterWorkspaces->count() == 0) {
            $this->newLine();
            $this->info('No workspaces found');
            $this->newLine();
            return Command::SUCCESS;
        }

        $output = [];
        foreach ($clusterWorkspaces as $t) {
            $contact = $t->getContact();

            $output[] = [
                $t->getName(),
                Str::substr($t->getFullname(), 0, 50),
                $contact ? $contact['firstname'] . ' ' . $contact['lastname'] . "\n" . $contact['email'] . "\n" . $contact['phone'] : '',
                'Enabled: ' . ($t->isApproved() ? 'Yes' : 'No') . "\n" .
                'State: ' . $t->getState() . "\n" .
                'Message: ' . $t->getMessage() . "\n"

            ];



        }

        $this->table(
            ['Name', 'Info', 'Contact', 'Status'],
            $output
        );
        return Command::SUCCESS;
    }
}
