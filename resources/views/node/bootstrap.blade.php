#!/bin/bash
# (C) Sorbonne. 2024
#
# Bootstrap node
# - Check if ARCH and OS are supported
# - Check state of node on server (present, installed...)
# - Executes installation script

set -e

@include('node.common.functions')

USER_ID=$(id -u)
if [ ${USER_ID} -ne 0 ]; then
  echo_fatal "this script needs to be run as root"
fi

ARCH=$(uname -m)

if [ "${ARCH}" != "x86_64" ]; then
    echo_fatal "architecture ${ARCH} not yet supported"
fi

if [ ! -f /etc/os-release ]; then
    echo_fatal "OS not supported, /etc/os-release not found"
fi

. /etc/os-release

verbose=0
force=0

while getopts "h?vf" opt; do
  case "$opt" in
    h|\?)
      echo "Node bootstrap"
      echo "-f to force installation"
      exit 0
      ;;
    v)
      verbose=1
      ;;
    f)
      force=1
      ;;
  esac
done

if [ $force -eq 1 ]; then
  echo_info "forcing installation - cleaning up"

  rm -rf /etc/edgenet

fi

mkdir -p /etc/edgenet

##
# Setup node hostname
#
if [ ! -f "/etc/edgenet/node-info" ]; then
  curl -s ip-api.com/json | jq -r '. | to_entries | .[] | .key + "=" + (.value | @sh)' > /etc/edgenet/node-info
  if [ $? -ne 0 ]; then
    echo_fatal "IP API failed - ip-api.com/json"
  fi
fi

. /etc/edgenet/node-info

if [ $status != "success" ]; then
  echo_warning "IP API status ${status} - ip-api.com/json"
fi

if [ ! -f "/etc/edgenet/node-hostname" ]; then

  rand=$(mktemp -u XXXX)

  hostname=$(echo "${countryCode}-${region}-${rand}.edge-net.io" | tr '[:upper:]' '[:lower:]' )
  if [ $? -ne 0 ]; then
    echo_fatal "unable to generate node hostname"
  fi

  echo_info "setting up node hostname ${hostname}"

  hostnamectl set-hostname ${hostname}
  if [ $? -ne 0 ]; then
    echo_fatal "unable to set node hostname ${hostname}"
  fi

  echo ${hostname} > /etc/edgenet/node-hostname

else

  hostname=$(cat /etc/edgenet/node-hostname)
  echo_info "node hostname is ${hostname}"

fi

##
# Prepare local scripts
mkdir -p /etc/edgenet/scripts

cat << EOF | tee /etc/edgenet/scripts/functions.sh
@include('node.common.functions')
EOF