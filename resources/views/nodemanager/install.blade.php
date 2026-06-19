#!/bin/bash
# ==============================================================================
# EdgeNet NodeManager Installation Script
#
# Instructions:
#   To install the NodeManager package on a supported machine, run:
#     curl -fsSL https://{{config('nodemanager.orchestrator.host')}}/install.sh | sudo bash
#
# Supported architectures: x86_64, arm64 (aarch64)
# Supported distributions & minimum versions:
#   - Debian 13
#   - Ubuntu 24.04 LTS, 26.04 LTS
#   - Rocky Linux 9, 10
#   - Raspberry Pi OS (latest)
# ==============================================================================

set -e

# 1. Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "This script must be run as root (sudo)."
    exit 1
fi

# 2. Check Architecture
ARCH=$(uname -m)
case $ARCH in
    x86_64) ;;
    aarch64) ;;
    *)
        echo "Error: Architecture ${ARCH} is not supported."
        exit 1
        ;;
esac

# 3. Check OS / Distro / Version
if [ -f /etc/os-release ]; then
    . /etc/os-release
else
    echo "Error: /etc/os-release not found. Cannot determine distribution."
    exit 1
fi

SUPPORTED=false
case $ID in
    debian)
        # Debian 13
        if [ "${VERSION_ID}" == "13" ]; then SUPPORTED=true; fi
        ;;
    ubuntu)
        # Ubuntu 24.04 and 26.04
        if [ "${VERSION_ID}" == "24.04" ] || [ "${VERSION_ID}" == "26.04" ]; then SUPPORTED=true; fi
        ;;
    rocky)
        # Rocky Linux 9 and 10
        if [ "${VERSION_ID}" == "9" ] || [ "${VERSION_ID}" == "10" ]; then SUPPORTED=true; fi
        ;;
    raspbian)
        # Raspberry Pi OS - assume latest is supported
        SUPPORTED=true
        ;;
esac

if [ "$SUPPORTED" != "true" ]; then
    echo "Error: Distribution ${ID} version ${VERSION_ID} is not supported."
    exit 1
fi

# 4. Install based on package manager
if command -v apt > /dev/null; then
    # DEBIAN BASED
    echo "Installing for Debian-based system..."
    
    # Add the key
    curl -fsSL https://{{config('nodemanager.repository.host')}}/deb/{{config('nodemanager.repository.name')}}.gpg \
      | gpg --dearmor -o /usr/share/keyrings/{{config('nodemanager.repository.name')}}.gpg

    # Add the repo
    echo "deb [signed-by=/usr/share/keyrings/{{config('nodemanager.repository.name')}}.gpg] https://{{config('nodemanager.repository.host')}}/deb stable main" \
      | tee /etc/apt/sources.list.d/{{config('nodemanager.repository.name')}}.list

    # Install packages
    apt update
    apt install -y nodemanager
elif command -v dnf > /dev/null; then
    # RPM BASED
    echo "RPM-based installation is not yet implemented."
    exit 1
else
    echo "Error: Could not find a supported package manager (apt/dnf)."
    exit 1
fi
