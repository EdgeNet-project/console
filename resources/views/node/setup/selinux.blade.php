function setup_selinux() {
  echo_info "Disabling selinux"
  if [[ `getenforce` != "Disabled" ]]; then
      setenforce 0
      sudo sed -i --follow-symlinks 's/SELINUX=enforcing/SELINUX=permissive/g' /etc/sysconfig/selinux
  fi
}
