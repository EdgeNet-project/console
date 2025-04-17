function echo_info() {
    echo -e "[\033[34mInfo\033[0m] ${1}"
}

function echo_warning() {
    echo -e "[\033[33mWarning\033[0m] ${1}"
}

function echo_error() {
    echo -e "[\033[31mError\033[0m] ${1}"

    if [ ${2} -gt 0 ]; then
        exit ${2}
    fi
}

function echo_fatal() {
    error "${1}" 1
}

function log() {
  remote_post "nodes/log" '{"severity":"'"${1}"'","message":"'"${2}"'"}'
}

function log_info() {
  log "info" "$1"
}

function log_warning() {
  log "warning" "$1"
}

function log_error() {
  log "error" "$1"
}

function get_distro_id() {
    # Check if /etc/os-release exists (modern Linux distros)
    if [ -f /etc/os-release ]; then
        # Extract ID from os-release file
        . /etc/os-release
        echo "$ID"
    # Check for older LSB release method
    elif command -v lsb_release >/dev/null 2>&1; then
        lsb_release -is | tr '[:upper:]' '[:lower:]'
    # Check for legacy distro-specific files
    elif [ -f /etc/redhat-release ]; then
        echo "rhel"
    elif [ -f /etc/debian_version ]; then
        echo "debian"
    else
        echo "unknown"
    fi
}

function get_distro() {
  if [ -f /etc/os-release ]; then
      # freedesktop.org and systemd
      . /etc/os-release
      DISTRO=$ID
      VER=$VERSION_ID
  elif type lsb_release >/dev/null 2>&1; then
      # linuxbase.org
      DISTRO=$(lsb_release -si)
      VER=$(lsb_release -sr)
  elif [ -f /etc/lsb-release ]; then
      # For some versions of Debian/Ubuntu without lsb_release command
      . /etc/lsb-release
      DISTRO=$DISTRIB_ID
      VER=$DISTRIB_RELEASE
  elif [ -f /etc/debian_version ]; then
      # Older Debian/Ubuntu/etc.
      DISTRO=debian
      VER=$(cat /etc/debian_version)
  else
      # Fall back to uname, e.g. "Linux <version>", also works for BSD, etc.
      DISTRO=$(uname -s)
      VER=$(uname -r)
  fi
}

function get_distro_version() {
    # Check if /etc/os-release exists (modern Linux distros)
    if [ -f /etc/os-release ]; then
        # Extract VERSION_ID from os-release file
        . /etc/os-release
        echo "$VERSION_ID"
    # Check for older LSB release method
    elif command -v lsb_release >/dev/null 2>&1; then
        lsb_release -rs
    # Check for legacy distro-specific files
    elif [ -f /etc/redhat-release ]; then
        grep -o "[0-9]\.[0-9]" /etc/redhat-release | head -n1
    elif [ -f /etc/debian_version ]; then
        cat /etc/debian_version
    else
        echo "unknown"
    fi
}

function get_architecture() {
    # Try uname first (works on most systems)
    if command -v uname >/dev/null 2>&1; then
        # Get machine hardware name (architecture)
        arch=$(uname -m)

        # Map some common architectures to more standard names
        case "$arch" in
            x86_64)
                echo "amd64"
                ;;
            aarch64)
                echo "arm64"
                ;;
            armv7l|armv6l)
                echo "arm"
                ;;
            i386|i686)
                echo "i386"
                ;;
            *)
                # Return the raw architecture if no mapping
                echo "$arch"
                ;;
        esac
    # Fallback to dpkg if available (Debian-based)
    elif command -v dpkg >/dev/null 2>&1; then
        dpkg --print-architecture
    # Last resort
    else
        echo "unknown"
    fi
}

function remote_get() {
    curl -s \
    --header "Content-Type: application/json" \
    --header 'Accept: application/json' \
    --header "Authorization: Bearer {{$node->auth}}" \
    --data @- \
    https://{{config('edgenet.boot.server')}}/$1
}

function remote_post() {
    echo "$2" | curl -s \
    --header "Content-Type: application/json" \
    --header 'Accept: application/json' \
    --header "Authorization: Bearer {{$node->auth}}" \
    --data @- \
    https://{{config('edgenet.boot.server')}}/$1
}