<?php

namespace App\Console\Commands\OLD;

use App\Model\Node;
use App\Model\NodeStatus;
use App\Services\EdgenetAdmin;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class EdgenetWatchNodes extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'edgenet:watch:nodes';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Watch nodes changes and update the status';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle(EdgenetAdmin $edgenetAdmin)
    {

        $domain = '.' . config('edgenet.cluster.domain');

        $edgenetAdmin->getCluster()->node()->watchAll(function ($type, $node) use ($domain) {
            foreach($node->getStatus('conditions') as $c) {
                Log::info($node->getName() . " " . $c['type'] . " => " . $c['status'] );

                $l_node = Node::where('name', str_replace($domain, '', $node->getName()))->first();
                if (!$l_node) {
                    Log::info($node->getName() . " not found");
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

                if ($l_node->isDirty('status')) {
                    activity('nodes')
                        ->performedOn($l_node)
                        //->causedBy($user)
                        ->withProperties(['severity' => 'info'])
                        ->log('node changed status to ' . $l_node->status);
                }

                $l_node->save();
            }

        });

        return Command::SUCCESS;
    }
}
