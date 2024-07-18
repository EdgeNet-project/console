swapoff -a
sed -e '/swap/s/^/#/g' -i /etc/fstab