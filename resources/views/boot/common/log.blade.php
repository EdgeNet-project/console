function log() {
    remote_post "nodes" '{"severity":"'"${1}"'","message":"'"${2}"'","status":"'"${3}"'"}'
}

function log_info() {
    log "info" $1 $2
}

function log_warning() {
    log "warning" $1 $2
}

function log_error() {
    log "error" $1 $2
}