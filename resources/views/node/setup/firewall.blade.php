function setup_firewall() {
  echo_info "Setting up firewall rules"
  systemctl enable firewalld --now

  firewall-cmd --permanent --add-port=179/tcp
  firewall-cmd --permanent --add-port=10250/tcp
  firewall-cmd --permanent --add-port=30000-32767/tcp
  firewall-cmd --permanent --add-port=4789/udp

  # ANTREA
  firewall-cmd --permanent --add-port=7471/tcp
  firewall-cmd --permanent --add-port=6081/udp
  firewall-cmd --permanent --add-port=51820-51821/udp
  firewall-cmd --permanent --add-port=10351/udp
  firewall-cmd --permanent --add-port=10349-10351/tcp

  firewall-cmd --reload
}