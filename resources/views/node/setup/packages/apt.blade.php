apt --version
if [ $? -ne 0 ]; then
    fatal "apt package manager is required."
fi

# Installs some useful packages
apt install -y curl gnupg2 software-properties-common apt-transport-https ca-certificates bind-utils jq
if [ $? -ne 0 ]; then
    fatal "apt is unable to install required packages."
fi