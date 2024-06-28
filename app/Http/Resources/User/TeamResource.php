<?php

namespace App\Http\Resources\User;

use Illuminate\Http\Resources\Json\JsonResource;

class TeamResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'fullname' => $this->fullname,
            'name' => $this->name,
            'shortname' => $this->shortname,
            'url' => $this->url,
            'city' => $this->city,
            'country' => $this->country,

            'role' => $this->pivot->role,

        ];
    }
}
