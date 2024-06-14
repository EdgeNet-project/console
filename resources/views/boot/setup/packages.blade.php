dnf --version
if [ $? -ne 0 ]; then
    echo "dnf package manager is required."
    exit 1
fi

# Installs some useful packages
dnf install -y bind-utils jq