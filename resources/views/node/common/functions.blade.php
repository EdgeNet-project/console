
function info() {
    echo "[\033[34mInfo\033[0m] ${1}"
}

function warning() {
    echo "[\033[33mWarning\033[0m] ${1}"
}

function error() {
    echo "[\033[31mError\033[0m] ${1}"

    if [ "${2}" -gt 0 ]; then
        exit ${2}
    fi
}

function fatal() {
    error ${1} 1
}