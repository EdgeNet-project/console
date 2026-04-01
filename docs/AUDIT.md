# Kubernetes Audit Configuration

Audit logs provide a security-relevant, chronological set of records documenting the sequence of activities that have affected the system by individual users, administrators, or other components of the system.

This guide explains how to configure the Kubernetes API Server to send audit logs to the EdgeNet Console webhook endpoint.

## 1. Audit Policy

The audit policy defines which events should be recorded and what data they should include.

Create the file `/etc/kubernetes/config/audit-policy.yaml` on your Kubernetes master node(s):

```yaml
apiVersion: audit.k8s.io/v1
kind: Policy

omitStages:
   - RequestReceived

rules:
   # Ignore common unauthenticated health probes.
   - level: None
     userGroups: ["system:unauthenticated"]
     nonResourceURLs:
        - "/healthz*"
        - "/readyz*"
        - "/livez*"
        - "/version"

   # Ignore kubelet / node traffic.
   - level: None
     userGroups: ["system:nodes"]

   # Ignore service account traffic from controllers/operators if you don't care about it.
   - level: None
     userGroups: ["system:serviceaccounts"]

   # Ignore read-only activity in kube-system only.
   - level: None
     namespaces: ["kube-system"]
     verbs: ["get", "list", "watch"]

   # Log all normal reads.
   - level: Metadata
     verbs: ["get", "list", "watch"]

   # Log all writes.
   - level: Metadata
     verbs: ["create", "update", "patch", "delete", "deletecollection"]

   # Catch-all.
   - level: Metadata
```

If you want to restrict audit logging to specific users or groups and avoid system noise, use this configuration:

```yaml
apiVersion: audit.k8s.io/v1
kind: Policy

omitStages:
  - RequestReceived

rules:
  - level: Metadata
    userGroups: ["edgenet:user"]

  - level: None
```
## 2. Audit Webhook Configuration

The webhook configuration tells the API Server where to send the audit events.

Create the file `/etc/kubernetes/config/audit-webhook.yaml` on your Kubernetes master node(s). Replace `portal.example.com` with your actual console domain.

```yaml
# /etc/kubernetes/config/audit-webhook.yaml
apiVersion: v1
kind: Config

clusters:
- name: portal-audit
  cluster:
    server: https://portal.example.com/kubernetes/audit
    certificate-authority: /etc/kubernetes/pki/portal-audit-ca.crt

users:
- name: apiserver-to-portal
  user:
    # Use either client certificates OR a token for authentication.
    # To use a token, set KUBERNETES_AUDIT_TOKEN in your .env file.
    # client-certificate: /etc/kubernetes/pki/portal-audit-client.crt
    # client-key: /etc/kubernetes/pki/portal-audit-client.key
    token: "YOUR_SHARED_SECRET_TOKEN"

contexts:
- name: audit
  context:
    cluster: portal-audit
    user: apiserver-to-portal

current-context: audit
```

**Note:** Ensure that the CA certificate and the client certificate/key (if using mTLS) are present at the specified paths.

### Token Authentication (Optional)

If you prefer to use a token instead of client certificates:

1. Generate a secure token.
2. Add it to your EdgeNet Console `.env` file:
   ```env
   KUBERNETES_AUDIT_TOKEN=your-secure-token-here
   ```
3. Uncomment the `token` line in `audit-webhook.yaml` and comment out the `client-certificate` and `client-key` lines.

## 3. API Server configuration

To enable audit logging, you must update the Kubernetes API Server configuration.

If you are using `kubeadm`, edit the manifest file `/etc/kubernetes/manifests/kube-apiserver.yaml` and add the following flags under the `spec.containers.command` section:

```yaml
- --audit-policy-file=/etc/kubernetes/config/audit-policy.yaml
- --audit-webhook-config-file=/etc/kubernetes/config/audit-webhook.yaml
- --audit-webhook-mode=batch
- --audit-webhook-batch-max-size=100
- --audit-webhook-batch-max-wait=5s
- --audit-webhook-batch-throttle-qps=10
- --audit-webhook-batch-throttle-burst=15
```

You also need to ensure the audit configuration files are accessible to the API Server container by adding them to `volumeMounts` and `volumes`:

```yaml
# ... inside kube-apiserver.yaml manifest ...
  volumeMounts:
    - mountPath: /etc/kubernetes/config
      name: site-config
      readOnly: true
  volumes:
  - hostPath:
      path: /etc/kubernetes/config
      type: DirectoryOrCreate
    name: site-config
```

After saving the manifest, `kubelet` will automatically restart the API Server pod with the new configuration.

## 4. Verification

Once the API Server has restarted, you can verify that audit logs are being sent to the console:

1. Perform some actions in the cluster (e.g., `kubectl get pods`).
2. Check the console logs or the database for new audit events.
3. The EdgeNet Console logs these events to the `k8s_audit` channel.

## Audit payload example

The API Server sends a `POST` request to the webhook endpoint with a JSON payload:

```json
{
  "apiVersion": "audit.k8s.io/v1",
  "kind": "EventList",
  "items": [
    {
      "level": "Metadata",
      "auditID": "8f6f...",
      "stage": "ResponseComplete",
      "requestURI": "/api/v1/namespaces/default/pods",
      "verb": "create",
      "user": {
        "username": "alice@example.com",
        "groups": ["portal-users"]
      },
      "sourceIPs": ["203.0.113.10"],
      "userAgent": "kubectl/v1.34.0",
      "objectRef": {
        "resource": "pods",
        "namespace": "default",
        "apiVersion": "v1"
      },
      "responseStatus": {
        "code": 201
      },
      "requestReceivedTimestamp": "2026-04-01T08:10:00Z",
      "stageTimestamp": "2026-04-01T08:10:00Z"
    }
  ]
}
```