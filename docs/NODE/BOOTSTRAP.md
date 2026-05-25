# Node Bootstrapping Process

This document describes the node bootstrapping and joining process as implemented in the EdgeNet Console.

## Overview

The bootstrapping process is a multi-stage sequence that moves a node from discovery to being a fully joined member of the Kubernetes cluster.

## 1. Registration (Checkin)

When a new node starts, it first registers itself with the console.

- **Endpoint**: `POST /api/node/checkin`
- **Controller**: `App\Http\Controllers\Node\CheckinController`
- **Request Body**:
  - `uuid`: System UUID of the node.
  - `code`: A unique 6-character registration code.
  - `ip`: Local IP address.
  - `arch`: CPU architecture (e.g., amd64).
  - `distro`: OS distribution (e.g., ubuntu).
  - `version`: OS version.
  - `kernel`: Kernel version.
- **Process**:
  - The controller creates a new node record if it doesn't exist (using `code` and `uuid`).
  - It determines the node's location based on its public IP and assigns a name (e.g., `us-west-01`).
  - The node is initially set to `enabled: false` and status `checkin`.
- **Response**: `name`, `public_ip`, `status`, `enabled`, `location`.

## 2. Activation

Activation is a manual step typically performed by an administrator.

- **Endpoint**: `POST /api/node/activate`
- **Controller**: `App\Http\Controllers\Node\ActivationController`
- **Authentication**: Required (Sanctum).
- **Process**:
  - The admin provides the 6-character `code` of the node to be activated.
  - The controller verifies the node is in the `checkin` state.
  - It sets `enabled: true` and status to `enabled`.

## 3. Wireguard Configuration

Once enabled, the node configures its secure tunnel to the cluster network.

- **Endpoint**: `POST /api/node/wireguard`
- **Controller**: `App\Http\Controllers\Node\WireguardController`
- **Request Body**:
  - `uuid`: System UUID.
  - `code`: Registration code.
  - `public_key`: The node's Wireguard public key.
- **Process**:
  - The controller assigns an internal IP from the Wireguard pool (default `10.80.0.0/16`).
  - It stores the node's public key for peer configuration.
- **Response**: `endpoint`, `endpoint_key`, `address` (with mask), `allowed_ips`, `mtu`, `persistent_keepalive`.

## 4. Kubernetes Joining

The final stage is joining the Kubernetes cluster.

- **Endpoint**: `POST /api/node/kubernetes`
- **Controller**: `App\Http\Controllers\Node\KubernetesController`
- **Request Body**:
  - `code`: Registration code.
  - `uuid`: System UUID (optional).
  - `hostname`: Node hostname (optional).
  - `token`: Combined bootstrap token `token-id.token-secret` (optional).
- **Process**:
  - Validates the node is enabled.
  - Generates a bootstrap token in the Kubernetes cluster (valid for 2 hours) if one wasn't provided in the request.
  - Creates or updates a `Node` resource in Kubernetes with the internal Wireguard IP.
  - Retrieves the CA certificate from the cluster's `cluster-info` ConfigMap.
- **Response**:
  - `apiServer`: URL of the Kubernetes API server.
  - `kubeletNodeIP`: The internal IP to be used by the kubelet (Wireguard IP preferred).
  - `bootstrapToken`: The token to be used for the join process.
  - `caCert`: Base64-encoded CA certificate.
  - `kubeletConfig`: Specific kubelet configuration if available.

When kubelet starts it will send a CSR request to the K8s API using the token.
For it to be automatically signed (and approved) some ClusterRoleBinding must be created.
See included `bootstrap-rolebinding.yaml` for an example.

## 5. Kubernetes Readiness Check

Nodes can check if their Kubernetes Node resource has been successfully created in the cluster.

- **Endpoint**: `POST /api/node/kubernetes/ready`
- **Controller**: `App\Http\Controllers\Node\KubernetesController`
- **Request Body**:
  - `uuid`: System UUID.
  - `name`: Node name.
- **Process**:
  - Validates the node exists in the database and matches the provided UUID.
  - Checks the Kubernetes cluster for a Node resource with the same name.
- **Response**: `ready` (boolean).

## 6. Heartbeat (Ping)

Nodes periodically report their status to remain active and signal health.

- **Endpoint**: `POST /api/node/ping`
- **Controller**: `App\Http\Controllers\Node\PingController`
- **Request Body**:
  - `uuid`: System UUID.
- **Process**:
  - Updates the `last_seen_at` timestamp in the database.
- **Response**: Current `status` and `enabled` state.
