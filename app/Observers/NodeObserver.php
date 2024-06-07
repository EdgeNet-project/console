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

        $node->auth = Str::random(6);

        $node->token_id = $this->generateRandomString(6);
        $node->token_secret = $this->generateRandomString(16);
    }

    // [a-z0-9]{6}\.[a-z0-9]{16}
    function generateRandomString($length = 6) {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyz';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[random_int(0, $charactersLength - 1)];
        }
        return $randomString;
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
