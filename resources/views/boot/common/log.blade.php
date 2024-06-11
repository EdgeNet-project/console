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