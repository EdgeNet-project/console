<?php

namespace App\Console\Commands\OLD;

use App\Services\EdgenetAdmin;
use Illuminate\Console\Command;

class EdgenetSubNamespace extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'edgenet:subnamespace';

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
    public function handle(EdgenetAdmin $edgenetAdmin)
    {

        $subnamespaces = $edgenetAdmin->getCluster()->subNamespace()->allNamespaces();

        $output = [];

        foreach ($subnamespaces as $subnamespace) {
            $output[] = [
                $subnamespace->getName(),
                $subnamespace->getNamespace(),
                $subnamespace->getTenant(),
                $subnamespace->isEnabled(),
            ];
        }

        $this->table(
            ['Name', 'Namespace', 'Tenant', 'Status'],
            $output
        );

        return Command::SUCCESS;
    }
}
