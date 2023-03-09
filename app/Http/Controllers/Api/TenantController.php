<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Model\Tenant;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use RenokiCo\LaravelK8s\LaravelK8sFacade as K8s;

class TenantController extends Controller
{

    public function list()
    {

        $cluster = K8s::getCluster();

        $tenants = $cluster->tenant()->all();

        $output = [];
        foreach ($tenants as $t) {
            $contact = $t->getContact();
            $address = $t->getAddress();

            $output[] = [
                'name' => $t->getName(),
                'fullname' => $t->getFullname(),
                'shortname' => $t->getShortname(),
                'url' => $t->getUrl(),
                'address' => $address,
                'contact' => $contact,

                'enabled' => $t->isEnabled(),
                'state' => $t->getStatus('state'),
                'message' => $t->getStatus('message'),

            ];



        }
        return response()->json($output);
    }

    public function get()
    {

    }

    public function users(Tenant $tenant)
    {

        return response()->json($tenant->users);
    }
}
