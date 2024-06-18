<?php

namespace App\Policies;

use App\Model\User;
use App\Model\UserRequest;
use App\Model\UserRequestType;
use Illuminate\Auth\Access\HandlesAuthorization;

class UserRequestPolicy
{
    use HandlesAuthorization;

    /**
     * Perform pre-authorization checks.
     */
    public function before(User $user, string $ability): bool|null
    {
        if ($user->admin) {
            return true;
        }

        return null;
    }

    /**
     * Determine whether the user can view any models.
     *
     * @param  \App\Model\User  $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function viewAny(User $user)
    {
        //
    }

    /**
     * Determine whether the user can view the model.
     *
     * @param  \App\Model\User  $user
     * @param  \App\Model\UserRequest  $userRequest
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function view(User $user, UserRequest $userRequest)
    {
        //
    }

    /**
     * Determine whether the user can create models.
     *
     * @param  \App\Model\User  $user
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function create(User $user)
    {
        //
    }

    /**
     * Determine whether the user can update the model.
     *
     * @param  \App\Model\User  $user
     * @param  \App\Model\UserRequest  $userRequest
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function update(User $user, UserRequest $userRequest)
    {
        //
//        switch($userRequest->type) {
//            case UserRequestType::CreateTeam:
//        }
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\Model\User  $user
     * @param  \App\Model\UserRequest  $userRequest
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function delete(User $user, UserRequest $userRequest)
    {
        return false;
    }

    /**
     * Determine whether the user can restore the model.
     *
     * @param  \App\Model\User  $user
     * @param  \App\UserRequest  $userRequest
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function restore(User $user, UserRequest $userRequest)
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     *
     * @param  \App\Model\User  $user
     * @param  \App\UserRequest  $userRequest
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function forceDelete(User $user, UserRequest $userRequest)
    {
        //
    }
}
