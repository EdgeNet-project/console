function setup_swap() {
  echo_info "Disabling swap"
  swapoff -a
  sed -e '/swap/s/^/#/g' -i /etc/fstab
}