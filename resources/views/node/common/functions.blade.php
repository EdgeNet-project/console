
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