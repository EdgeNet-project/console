dnf --version
if [ $? -ne 0 ]; then
    fatal "dnf package manager is required."
fi

# Installs some useful packages
dnf install -y bind-utils jq
if [ $? -ne 0 ]; then
    fatal "dnf is unable to install required packages."
fi