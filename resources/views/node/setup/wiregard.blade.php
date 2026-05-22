
##
# WireGuard Setup (Phase 4)
#
echo_info "starting phase 4: wireguard setup"

WG_CONFIG_DIR="/etc/wireguard"
WG_INTERFACE="wg0"
EDGENET_CONFIG="/etc/edgenet/wiregard.json"
NODE_INFO="/etc/edgenet/node-info"

if [ ! -f "$NODE_INFO" ]; then
    echo_fatal "node info missing, run checkin first"
fi

# Load node info
. "$NODE_INFO"

# Generate WireGuard keys if they don't exist
if [ ! -f "$WG_CONFIG_DIR/private.key" ]; then
    mkdir -p "$WG_CONFIG_DIR"
    chmod 700 "$WG_CONFIG_DIR"
    wg genkey | tee "$WG_CONFIG_DIR/private.key" | wg pubkey > "$WG_CONFIG_DIR/public.key"
fi

PRIVATE_KEY=$(cat "$WG_CONFIG_DIR/private.key")
PUBLIC_KEY=$(cat "$WG_CONFIG_DIR/public.key")

# System UUID and Code are needed for activation
SYSTEM_UUID=$(cat /sys/class/dmi/id/product_uuid | tr '[:upper:]' '[:lower:]')
# In this environment, we might not have the code readily available if it wasn't saved.
# Assuming it was saved in /etc/edgenet/node-code during checkin or passed via env.
if [ -f "/etc/edgenet/node-code" ]; then
    NODE_CODE=$(cat /etc/edgenet/node-code)
else
    # Fallback to a placeholder or error out if absolutely required
    # But usually it should be provided.
    echo_warning "node code not found in /etc/edgenet/node-code"
    NODE_CODE="XXXXXX" 
fi

activate_node() {
    echo_info "sending activation request to edgenet console..."
    
    RESPONSE=$(curl -s -X POST "{{ url('/api/node/activate/wireguard') }}" \
        -H "Content-Type: application/json" \
        -d "{
            \"uuid\": \"$SYSTEM_UUID\",
            \"code\": \"$NODE_CODE\",
            \"public_key\": \"$PUBLIC_KEY\"
        }")
    
    if [ $? -ne 0 ]; then
        return 1
    fi
    
    echo "$RESPONSE" > "$EDGENET_CONFIG"
    
    # Check if response has error
    if echo "$RESPONSE" | jq -e '.error' > /dev/null; then
        echo_error "activation failed: $(echo "$RESPONSE" | jq -r .error)"
        return 1
    fi

    # Check if required fields are present
    if ! echo "$RESPONSE" | jq -e '.endpoint and .endpoint_key and .address' > /dev/null; then
        echo_error "invalid response from server"
        return 1
    fi

    return 0
}

# Retry activation every 5 minutes if it fails
until activate_node; do
    echo_warning "activation failed, retrying in 5 minutes..."
    sleep 300
done

# Generate WireGuard configuration
ENDPOINT=$(jq -r .endpoint "$EDGENET_CONFIG")
ENDPOINT_KEY=$(jq -r .endpoint_key "$EDGENET_CONFIG")
ADDRESS=$(jq -r .address "$EDGENET_CONFIG")
ALLOWED_IPS=$(jq -r .allowed_ips "$EDGENET_CONFIG")
MTU=$(jq -r .mtu "$EDGENET_CONFIG")

cat > "$WG_CONFIG_DIR/$WG_INTERFACE.conf" <<EOF
[Interface]
PrivateKey = $PRIVATE_KEY
Address = $ADDRESS/32
MTU = $MTU

[Peer]
PublicKey = $ENDPOINT_KEY
Endpoint = $ENDPOINT
AllowedIPs = $ALLOWED_IPS
PersistentKeepalive = 25
EOF

chmod 600 "$WG_CONFIG_DIR/$WG_INTERFACE.conf"

# Bring up the interface
echo_info "bringing up wireguard interface $WG_INTERFACE"
if ip link show "$WG_INTERFACE" > /dev/null 2>&1; then
    wg-quick down "$WG_INTERFACE" || true
fi
wg-quick up "$WG_INTERFACE"

# Ping the peer to verify connection
PEER_IP=$(echo "$ALLOWED_IPS" | cut -d'/' -f1) # Assuming the first IP in allowed_ips is the hub

ping_peer() {
    echo_info "pinging wireguard peer $PEER_IP..."
    ping -c 3 -W 5 "$PEER_IP" > /dev/null 2>&1
}

until ping_peer; do
    echo_warning "ping failed, retrying in 5 minutes..."
    sleep 300
done

echo_info "wireguard setup complete and verified"
