<?php

namespace App\Console\Commands;

use App\Jobs\EdgeNet\CreateTeamJob;
use App\Services\EdgenetAdmin;
use Illuminate\Console\Command;
use Illuminate\Support\Str;
use RenokiCo\PhpK8s\Exceptions\KubernetesAPIException;
use App\Model\Tenant as TenantModel;

class EdgenetTeams extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'edgenet:teams 
                            {--check : Check sync status}
                            {--sync : sync}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'EdgeNet Teams';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle(EdgenetAdmin $edgenetAdmin)
    {

        $cluster = $edgenetAdmin->getCluster();

        try {
            $tenants = $cluster->tenant()->all();
        } catch (KubernetesAPIException $e) {
            dd([
                $e->getMessage(),
                $e->getPayload()
            ]);
        }

        $localTeams = TenantModel::all();

        $checkSync = $this->option('check');

        if ($checkSync) {
            foreach ($localTeams as $lteam) {
                $output[] = [
                    $lteam->name,
                    $tenants->where('name', $lteam->name)->first() ?? '<absent>'
                ];
            }

            $this->table(
                ['Local', 'Remote'],
                $output
            );

            return Command::SUCCESS;
        }

        $edgenetSync = $this->option('sync');
        if ($edgenetSync) {
            foreach ($localTeams as $lteam) {
                $this->info('creating  ' . $lteam->name);
                CreateTeamJob::dispatch($lteam);
            }

            return Command::SUCCESS;
        }

        if ($tenants->count() == 0) {
            $this->newLine();
            $this->info('No teams found');
            $this->newLine();
            return Command::SUCCESS;
        }

        $output = [];
        foreach ($tenants as $t) {

            $output[] = [
                $t->getName(),
                Str::substr($t->getFullname(), 0, 50),
                $t->getUrl(),
                $t->getAdmin(),
//                'Enabled: ' . ($t->isApproved() ? 'Yes' : 'No') . "\n" .
//                'State: ' . $t->getState() . "\n" .
//                'Message: ' . $t->getMessage() . "\n"

            ];



        }

        $this->table(
            ['Name', 'Fullname', 'URL', 'Admin'],
            $output
        );

        return Command::SUCCESS;
    }
}
