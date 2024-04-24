<?php

namespace App\Observers;

use App\Model\Node;
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
        $node->auth = Str::random(32);
        $node->code = Str::random(6);
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
        //
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
