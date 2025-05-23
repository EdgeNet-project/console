function setup_kubernetes() {
    echo_info "Setting up kubernetes"
    # Kubernetes
    cat << EOF | tee /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://pkgs.k8s.io/core:/stable:/v1.29/rpm/
enabled=1
gpgcheck=1
gpgkey=https://pkgs.k8s.io/core:/stable:/v1.29/rpm/repodata/repomd.xml.key
exclude=kubelet kubeadm kubectl cri-tools kubernetes-cni
EOF

    dnf makecache
    dnf install -y {kubelet,kubeadm,kubectl} --disableexcludes=kubernetes

    systemctl enable kubelet
}