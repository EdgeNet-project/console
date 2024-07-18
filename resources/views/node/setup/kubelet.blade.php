
# disabled
if [[ 1 -eq 0 ]]; then
#kubectl apply -f /tmp/kubelet_cfg
mv -f /tmp/bootstrap-kubelet.conf /etc/kubernetes/bootstrap-kubelet.conf

mkdir -p /usr/lib/systemd/system/kubelet.service.d/

cat << EOF | tee /usr/lib/systemd/system/kubelet.service.d/10-kubelet-edgenet.conf
[Service]
Environment="KUBELET_CONFIG_ARGS1=--bootstrap-kubeconfig=/etc/kubernetes/bootstrap-kubelet.conf --kubeconfig=/etc/kubernetes/kubelet.conf"
Environment="KUBELET_CONFIG_ARGS2=--config=/var/lib/kubelet/config.yaml"
# This is a file that "kubeadm init" and "kubeadm join" generates at runtime, populating the KUBELET_KUBEADM_ARGS variable dynamically
Environment="KUBELET_CONFIG_ARGS3=--container-runtime-endpoint=unix:///var/run/containerd/containerd.sock --pod-infra-container-image=registry.k8s.io/pause:3.9"
EnvironmentFile=-/etc/sysconfig/kubelet
ExecStart=
ExecStart=/usr/bin/kubelet $KUBELET_CONFIG_ARGS1 $KUBELET_CONFIG_ARGS2 $KUBELET_CONFIG_ARGS3 $KUBELET_EXTRA_ARGS
EOF

systemctl daemon-reload
fi

systemctl enable kubelet --now