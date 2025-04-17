function setup_apt() {
  echo_info "Checking if package manager is present"

  if is_debian()
  apt --version
  if [ $? -ne 0 ]; then
      echo_fatal "apt package manager is required."
  fi

  # Installs some useful packages
  apt install -y curl gnupg2 software-properties-common apt-transport-https ca-certificates bind-utils jq
  if [ $? -ne 0 ]; then
      echo_fatal "apt is unable to install required packages."
  fi

  dnf --version
  if [ $? -ne 0 ]; then
      echo_fatal "dnf package manager is required."
  fi

  # Installs some useful packages
  dnf install -y bind-utils jq
  if [ $? -ne 0 ]; then
      echo_fatal "dnf is unable to install required packages."
  fi
}