dnf --version
if [ $? -ne 0 ]; then
    echo "dnf package manager is required."
    exit 1
fi

# Containerd
dnf config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
dnf makecache
dnf install -y containerd.io

containerd config default | sudo tee /etc/containerd/config.toml >/dev/null 2>&1
sed -i 's/SystemdCgroup \= false/SystemdCgroup \= true/g' /etc/containerd/config.toml

systemctl enable --now containerd.service

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