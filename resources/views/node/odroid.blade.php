#!/bin/sh
# Adapted from http://ppa.linuxfactory.or.kr/mastering/android-odroidn2-20210930/userscript.sh
set -ux

LOCAL_URL=/tmp/image.xz
REMOTE_URL=http://download.edge-net.org/Armbian_22.08.0-trunk_Odroidn2_jammy_current_5.10.123_minimal.img.xz
REMOTE_MD5=82f8aefcbb01285dd5fa8ae3a0e8b106

TARGET=

MACADDR=$(ip a | grep link/ether | awk -F " " '{print $2}')
IPADDR=$(ip addr show $(ip route | awk '/default/ { print $5 }') | grep "inet" | head -n 1 | awk '/inet/ {print $2}' | cut -d'/' -f1)
GATEWAY=$(ip r | grep default | awk '{print $3}')

IS_REGISTERED=$(wget --post-data="mac=${MACADDR}&ipv4=${IPADDR}&gatewayv4=${GATEWAY}" -q -O - http://boot.edge-net.io/odroid)

# NOT USED
setup_network() {
    NET_IPTYPE=$(fw_printenv -n iptype 2>/dev/null)
    NET_IPADDR=$(fw_printenv -n ipaddr 2>/dev/null)
    NET_GATEWAY=$(fw_printenv -n gatewayip 2>/dev/null)
    NET_DNS1=$(fw_printenv -n dns1 2>/dev/null)
    NET_DNS2=$(fw_printenv -n dns2 2>/dev/null)

    if [ "$NET_IPTYPE" = "static" ]; then
        echo "Use static IP address"
        ifconfig eth0 $NET_IPADDR
        route add default gw $NET_GATEWAY dev eth0
        rm -f /etc/resolv.conf
        [ -n "$NET_DNS1" ] && echo "nameserver $NET_DNS1" >> /etc/resolv.conf
        [ -n "$NET_DNS2" ] && echo "nameserver $NET_DNS2" >> /etc/resolv.conf
    else
        echo "Use dynamic IP address"
        udhcpc 2>/dev/null
    fi

    echo "---------------------------------------"
    echo "IP : $(ip a show eth0 | grep inet | awk '{print $2}')"
    echo "Gateway : $(ip r | grep default | awk '{print $3}')"
    echo "---------------------------------------"
}

panic() {

    echo "E: $1"
    /usr/bin/figlet FAILED!!
    sleep 10

    exit 1

}

reboot() {
    echo 1 > /proc/sys/kernel/sysrq
    echo b > /proc/sysrq-trigger
}

find_target_device() {

    for d in /dev/mmcblk0 /dev/mmcblk1; do
        n=1
        echo "W: waiting for "${d}"..."
        while [ ${n} -le 5 ]; do
            if [ -e ${d} ]; then
                TARGET=${d}
                return 0
            fi
            n=$((n + 1))
            sleep 1
        done
    done

    return 1
}

node_install() {
    # Download and write the disk image to the eMMC
    wget -O ${LOCAL_URL} ${REMOTE_URL}
    LOCAL_MD5=$(md5sum ${LOCAL_URL} | awk '{print $1}')

    if [ "${LOCAL_MD5}" != "${REMOTE_MD5}" ]; then
    	echo "invalid hash"
    	sleep 5
        # Reboot
    	reboot
    fi

    xzcat ${LOCAL_URL} | dd conv=fsync bs=500M of=${1}
    if [ $? -ne 0 ]; then
        rm ${LOCAL_URL}
        panic "error copying the image"
    fi

    rm ${LOCAL_URL}

    # set partition bootable
    #(echo a; echo 1; echo w) | fdisk ${1}

    sync

    wget --post-data="mac=${MACADDR}" -q -O - http://boot.edge-net.io/odroid/installed

    sleep 10

    reboot
}

find_target_device
if [ $? -ne 0 ]; then
    panic "no device not found"
fi

if [ ${IS_REGISTERED} -ne 1 ]; then
    node_install ${TARGET}
fi

sleep 5