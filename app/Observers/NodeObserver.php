<?php

namespace App\Observers;

use App\Model\Node;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class NodeObserver
{

    /**
     * Handle the Node "creating" event.
     *
     * @param  \App\Node  $node
     * @return void
     */
    public function creating(Node $node)
    {

    }

    /**
     * Handle the Node "created" event.
     *
     * @param  \App\Node  $node
     * @return void
     */
    public function created(Node $node)
    {
        //
    }

    /**
     * Handle the Node "updated" event.
     *
     * @param  \App\Node  $node
     * @return void
     */
    public function updated(Node $node)
    {
        // Node Status
        if ($node->isDirty('status')) {
            Log::info($node->hostname . " changed status to " . $node->status);
        }
    }

    /**
     * Handle the Node "deleted" event.
     *
     * @param  \App\Node  $node
     * @return void
     */
    public function deleted(Node $node)
    {
        //
    }

    /**
     * Handle the Node "restored" event.
     *
     * @param  \App\Node  $node
     * @return void
     */
    public function restored(Node $node)
    {
        //
    }

    /**
     * Handle the Node "force deleted" event.
     *
     * @param  \App\Node  $node
     * @return void
     */
    public function forceDeleted(Node $node)
    {
        //
    }
}
