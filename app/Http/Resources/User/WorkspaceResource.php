<?php

namespace App\Http\Resources\User;

use Illuminate\Http\Resources\Json\JsonResource;

class WorkspaceResource extends JsonResource
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
            'id' => $this->id,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'label' => $this->label,
            'name' => $this->name,
            'namespace' => $this->namespace,
            'role' => $this->pivot->role,

            'team' => [
                'fullname' => $this->tenant->fullname,
                'name' => $this->tenant->name,
                'shortname' => $this->tenant->shortname,
            ],
            'parent' => null,
        ];
    }
}
