<?php

namespace App\Console\Commands;

use App\Services\EdgenetAdmin;
use Illuminate\Console\Command;

class EdgenetRoleBinding extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'edgenet:rolebinding';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Edgenet RoleBindings';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle(EdgenetAdmin $edgenetAdmin)
    {

        $rb = $edgenetAdmin->getCluster()
            ->roleBinding()
            ->setNamespace('cslashwp')
            ->setName('edgenet:tenant-collaborator')->get();
//        dd($rb);

        $output = [];
        foreach ($rb->getSubjects() as $subject) {
            $output[] = [$subject->getAttribute('kind'), $subject->getAttribute('name')];
        }

        $this->table(
            ['Kind', 'Name'],
            $output
        );

        return Command::SUCCESS;
    }
}
