<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\User\TeamResource;
use App\Http\Resources\User\WorkspaceResource;

class UserResource extends JsonResource
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
            ...parent::toArray($request),
            'workspaces' => WorkspaceResource::collection($this->subnamespaces),
            'teams' => TeamResource::collection($this->tenants),
            'requests' => $this->requests,
        ];
    }
}
