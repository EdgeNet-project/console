<?php

namespace App\Observers;

use App\Model\Node;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use App\Notifications\Nodemanager\NewNodeCreated;
use App\Model\User;

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
        Log::info('[Console] New node created - notifying cluster admins');
        $admins = User::where('admin', true)->get();
        foreach ($admins as $admin) {
            $admin->notify(new NewNodeCreated($node));
        }
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
            Log::info('[' . $node->name . '] changed status to ' . $node->status->name);
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
