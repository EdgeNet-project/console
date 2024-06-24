<?php

namespace App\Observers;

use Illuminate\Support\Facades\Log;
use App\Model\SubNamespace;
use App\Jobs\EdgeNet\CreateWorkspace;

class SubNamespaceObserver
{
    /**
     * Handle the SubNamespace "created" event.
     *
     * @param  \App\Model\SubNamespace  $subNamespace
     * @return void
     */
    public function created(SubNamespace $workspace)
    {
        //
        Log::info('[Console] workspace '. $workspace->name . ' created');

        // dispatch edgenet API job to create the remote workspace
        CreateWorkspace::dispatch($workspace);

    }

    public function creating(SubNamespace $workspace)
    {
        //
    }

    /**
     * Handle the SubNamespace "updated" event.
     *
     * @param  \App\SubNamespace  $workspace
     * @return void
     */
    public function updated(SubNamespace $workspace)
    {
        //
    }

    /**
     * Handle the SubNamespace "deleted" event.
     *
     * @param  \App\SubNamespace  $workspace
     * @return void
     */
    public function deleted(SubNamespace $workspace)
    {
        //
    }

    /**
     * Handle the SubNamespace "restored" event.
     *
     * @param  \App\SubNamespace  $workspace
     * @return void
     */
    public function restored(SubNamespace $workspace)
    {
        //
    }

    /**
     * Handle the SubNamespace "force deleted" event.
     *
     * @param  \App\SubNamespace  $workspace
     * @return void
     */
    public function forceDeleted(SubNamespace $workspace)
    {
        //
    }
}
