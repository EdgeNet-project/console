#!/bin/bash
# (C) Sorbonne. 2024
#

set -e

@include('boot.functions')

ARCH=$(uname -m)
if [ "${ARCH}" != "x86_64" ]; then
  fatal "Architecture ${ARCH} not yet supported"
fi

echo_info "Architecture ${ARCH}"

if [ -f /etc/os-release ]; then
    # freedesktop.org and systemd
    . /etc/os-release
    OS=$ID
    VER=$VERSION_ID
elif type lsb_release >/dev/null 2>&1; then
    # linuxbase.org
    OS=$(lsb_release -si)
    VER=$(lsb_release -sr)
elif [ -f /etc/lsb-release ]; then
    # For some versions of Debian/Ubuntu without lsb_release command
    . /etc/lsb-release
    OS=$DISTRIB_ID
    VER=$DISTRIB_RELEASE
elif [ -f /etc/debian_version ]; then
    # Older Debian/Ubuntu/etc.
    OS=Debian
    VER=$(cat /etc/debian_version)
else
    # Fall back to uname, e.g. "Linux <version>", also works for BSD, etc.
    OS=$(uname -s)
    VER=$(uname -r)
fi

case $ID in
  ubuntu)
    ;;
  rocky)

    ;;
  *)
    fatal "OS ${VERSION_ID} not supported."
    ;;
esac

##
# KVM if it is a VM
platform_name=$(cat /sys/devices/virtual/dmi/id/product_name)
platform_architecture=$(uname -m)

kernel_name=$(uname -s)
kernel_release=$(uname -r)
kernel_version=$(uname -v)

hostname_name=$(hostname -s)
hostname_domain=$(hostname -d)
hostname_ip=$(hostname -i)

ip_address=$(ip addr show $(ip route | awk '/default/ { print $5 }') | grep "inet" | head -n 1 | awk '/inet/ {print $2}' | cut -d'/' -f1)
gateway=$(ip r | grep default | awk '{print $3}')

##
# GET IP information
ip_info_json=$(curl -sL ip.guide/${hostname_ip})

info_json=$(cat <<EOF
{
  "auth" : "{{$node->auth}}",
  "ip" : ${ip_info_json},
  "host" :
  {
    "os" :
    {
      "id" : "${ID}",
      "version" : "${VERSION_ID}",
      "name" : "${PRETTY_NAME}"
    },
    "kernel" :
    {
      "name" : "${kernel_name}",
      "release" : "${kernel_release}",
      "version" : "${kernel_version}"
    },
    "platform" :
    {
      "name" : "${platform_name}",
      "architecture" : "${platform_architecture}"
    },
    "network" :
    {
      "name" : "${hostname_name}",
      "domain" : "${hostname_domain}",
      "ip" : "${hostname_ip}",
      "gateway" : "${gateway}"
    }
  }
}
EOF
)


##
# Sends info to console
# Response will contain the kubelet configuration

echo $info_json | curl \
 --header "Content-Type: application/json" \
 --header 'Accept: application/json' \
 --data @- \
 https://boot.edge-net.io/nodes > /tmp/bootstrap-kubelet.conf



@include('node.setup.modules')

@include('node.setup.swap')

@include('node.setup.selinux')

@include('boot.setup.network')

@include('boot.setup.firewall')

@include('boot.setup.kubelet')
