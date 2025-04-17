function setup_network() {
  echo_info "Network configuration"
  cat << EOF | sudo tee /etc/sysctl.d/k8s.conf
  net.ipv4.ip_forward = 1
  net.bridge.bridge-nf-call-ip6tables = 1
  net.bridge.bridge-nf-call-iptables = 1
  EOF
  sysctl --system
}
}