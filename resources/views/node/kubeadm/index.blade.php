#!/bin/bash
# (C) Sorbonne. 2024

set -e

if [ ! -f /etc/os-release ]; then
echo "OS not supported, /etc/os-release not found"
fi

. /etc/os-release

@include('boot.common.remote')

@include('boot.common.log')

@include('boot.setup.packages.packages')

mkdir -p /etc/edgenet

##
# Setup node hostname
#
if [ ! -f "/etc/edgenet/node-info" ]; then
curl -s ip-api.com/json | jq -r '. | to_entries | .[] | .key + "=" + (.value | @sh)' > /etc/edgenet/node-info

. /etc/edgenet/node-info

if [ $status != "success" ]; then
echo "Error: IP API failed"
exit 1
fi

rand=$(mktemp -u XXXX)

hostname=$(echo "${countryCode}-${region}-${city}-${rand}.edge-net.io" | tr '[:upper:]' '[:lower:]' )
if [ $? -ne 0 ]; then
echo "Error generating the node hostname"
exit 1
fi

hostnamectl set-hostname ${hostname}
if [ $? -ne 0 ]; then
echo "Error generating the node hostname"
exit 1
fi

fi

##
# KVM if it is a VM
platform_name=$(cat /sys/devices/virtual/dmi/id/product_name)
platform_architecture=$(uname -m)

kernel_name=$(uname -s)
kernel_release=$(uname -r)
kernel_version=$(uname -v)

hostname=$(hostname)
hostname_name=$(hostname -s)
hostname_domain=$(hostname -d)

ip_address=$(ip addr show $(ip route | awk '/default/ { print $5 }') | grep "inet" | head -n 1 | awk '/inet/ {print $2}' | cut -d'/' -f1)
gateway=$(ip r | grep default | awk '{print $3}')

#log_info "Node installation is starting"

##
# GET IP information
ip_info_json=$(curl -sL ip.guide/${ip_address})

info_json=$(cat <
<EOF
        {
"name" : "${hostname_name}",
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
"ip" : "${ip_address}",
"gateway" : "${gateway}"
}
}
}
EOF
)

##
# Sends info to console
# Response will contain the kubelet configuration

kubeadm_cmd=$(remote_post "nodes/register" "$info_json")

@include('boot.setup.containerd')

@include('boot.setup.kubernetes')

@include('boot.setup.modules')

@include('boot.setup.swap')

@include('boot.setup.selinux')

@include('boot.setup.network')

@include('boot.setup.firewall')

log_info "Node installation finishing, joining the cluster"

until host ${hostname};
do
echo "Waiting for the hostname DNS configuration..."
sleep 10;
done

##
# executes kubeadm and join the cluster
$kubeadm_cmd

log_info "Node installation complete"