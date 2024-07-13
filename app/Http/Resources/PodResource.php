<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class PodResource extends JsonResource
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
            'name' => $this->getName(),
            'status' => $this->getAttribute('status')
//            'podIP' => $this->getStatus('podIP'),
//            'podIPs' => $this->getStatus('podIPs'),
//            'hostIP' => $this->getStatus('hostIP'),
//            'hostIPs' => $this->getStatus('hostIPs'),
//            'startTime' => $this->getStatus('startTime'),
//            'phase' => $this->getStatus('phase'),

        ];
    }
}
