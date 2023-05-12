<?php

namespace App\Model;

use App\Services\Edgenet;
use App\Services\EdgenetAdmin;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use RenokiCo\PhpK8s\Exceptions\KubernetesAPIException;
use RenokiCo\PhpK8s\Kinds\K8sRoleBinding;

class SubNamespace extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function users()
    {
        return $this->belongsToMany(User::class)
            ->using(SubNamespaceUser::class)
            ->withPivot('roles')
            ->withTimestamps();
    }

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }

    public function addUser(EdgenetAdmin $edgenetAdmin)
    {
        // TODO: how to check if user has permission to add?
        try {


            $rb = $edgenetAdmin->getCluster()
                ->roleBinding()
                ->setNamespace($this->namespace)
                ->setName('edgenet:tenant-collaborator')
                ->get();

//            $roleRequest = new K8sRoleBinding($edgenet->getCluster(),
//                [
//                    'metadata' => [
//                        'namespace' => $this->namespace,
//                        'name' => 'edgenet:tenant-collaborator'
//                    ],
//                    'roleRef' => [
//                        'apiGroup' => 'rbac.authorization.k8s.io',
//                        'kind' => 'ClusterRole',
//                        'name' => 'edgenet:tenant-collaborator'
//                    ]
//
//                ]
//            );
//                ->roleBinding()
//                ->whereNamespace($this->namespace)
//                ->getByName($name);

        } catch (KubernetesAPIException $e) {

            return response()->json([
                'message' => $e->getMessage()
            ], 400);

        }
    }
}
