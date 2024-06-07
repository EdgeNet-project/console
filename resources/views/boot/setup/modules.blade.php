# required modules
modprobe overlay
modprobe br_netfilter
cat << EOF | sudo tee /etc/modules-load.d/k8s.conf
overlay
br_netfilter
EOF