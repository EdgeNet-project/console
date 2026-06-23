<?php

namespace App\Http\Resources\Status;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NodeResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $location = null;
        if ($this->location) {
            $location = [
                'countryCode' => $this->location['countryCode'],
                'countryName' => $this->location['countryName'],
                'cityName' => $this->location['cityName'],
                'regionCode' => $this->location['regionCode'],
                'regionName' => $this->location['regionName'],
                'latitude' => $this->location['latitude'],
                'longitude' => $this->location['longitude'],
            ];
        }
        return [
            'name' => $this->name,
            'status' => $this->status,
            'location' => $location,
            'created_at' => $this->created_at,
            'last_seen_at' => $this->last_seen_at,
            'uptime' => $this->uptime,
        ];

        //return parent::toArray($request);
    }
}
