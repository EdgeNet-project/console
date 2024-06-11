<?php

namespace App\Console\Commands;

use App\Model\Node;
use App\Model\NodeStatus;
use App\Services\EdgenetAdmin;
use Illuminate\Console\Command;
use RenokiCo\PhpK8s\K8s;
use Illuminate\Support\Facades\Log;

class EdgenetNodesWatch extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'edgenet:nodes:watch';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Edgenet Nodes Watch';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle(EdgenetAdmin $edgenetAdmin)
    {

        $edgenetAdmin->getCluster()->node()->watchAll(function ($type, $node) {
            foreach($node->getStatus('conditions') as $c) {
                Log::info($node->getName() . " " . $c['type'] . " => " . $c['status'] );

                $l_node = Node::where('hostname', $node->getName())->first();
                if (!$l_node) {
                    continue;
                }

                switch($c['type']) {
                    case 'Ready':

                        if ($c['status'] == 'True') {
                            $l_node->status = NodeStatus::OK;
                        } else if ($c['status'] == 'Unknown') {
                            $l_node->status = NodeStatus::UNKNOWN;
                        } else {
                            $l_node->status = NodeStatus::ERROR;
                        }

                        break;
                    default:
                        if ($c['status'] == 'True') {
                            $l_node->status = NodeStatus::WARNING;
                        }
                }

                $l_node->save();
            }

        });

        return Command::SUCCESS;
    }
}
