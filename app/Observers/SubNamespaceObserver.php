<?php

namespace App\Observers;

use App\Model\SubNamespace;
use Illuminate\Support\Facades\Log;

class SubNamespaceObserver
{
    /**
     * Handle the SubNamespace "created" event.
     *
     * @param  \App\SubNamespace  $subNamespace
     * @return void
     */
    public function created(SubNamespace $subNamespace)
    {
        //
        Log::info('Created subnamespace '. $subNamespace->name);
    }

    public function creating(SubNamespace $subNamespace)
    {
        Log::info('Creating subnamespace '. $subNamespace->name);
    }

    /**
     * Handle the SubNamespace "updated" event.
     *
     * @param  \App\SubNamespace  $subNamespace
     * @return void
     */
    public function updated(SubNamespace $subNamespace)
    {
        //
    }

    /**
     * Handle the SubNamespace "deleted" event.
     *
     * @param  \App\SubNamespace  $subNamespace
     * @return void
     */
    public function deleted(SubNamespace $subNamespace)
    {
        //
    }

    /**
     * Handle the SubNamespace "restored" event.
     *
     * @param  \App\SubNamespace  $subNamespace
     * @return void
     */
    public function restored(SubNamespace $subNamespace)
    {
        //
    }

    /**
     * Handle the SubNamespace "force deleted" event.
     *
     * @param  \App\SubNamespace  $subNamespace
     * @return void
     */
    public function forceDeleted(SubNamespace $subNamespace)
    {
        //
    }
}
