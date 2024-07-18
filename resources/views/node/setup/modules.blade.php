# required modules
info "Loading required modules"
modprobe overlay
modprobe br_netfilter
cat << EOF | tee /etc/modules-load.d/k8s.conf
overlay
br_netfilter
EOF