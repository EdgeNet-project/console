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