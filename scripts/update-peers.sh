#!/bin/bash
set -euo pipefail

##
# WireGuard Peer Configuration Updater
#
# PURPOSE:
#   Automatically synchronizes WireGuard peer configurations from a central API
#   to the local WireGuard proxy server. It fetches a list of peers, validates
#   the data, updates the configuration file if changes are detected, and
#   restarts the WireGuard interface.
#
# USAGE:
#   This script should be installed as a cron job to run at regular intervals.
#   Example cron entry (every 5 minutes):
#   */5 * * * * /path/to/scripts/update-peers.sh >> /var/log/wg-update.log 2>&1
#
# PREREQUISITES:
#   - curl: For fetching peer data from the API.
#   - jq: For parsing and processing JSON data.
#   - wireguard-tools: (wg-quick) For managing the WireGuard interface.
#   - Root/Sudo privileges: Required to modify /etc/wireguard and restart the service.
#
# WORKFLOW:
#   1. Fetch peer list (JSON array) from API_URL.
#   2. Validate that the response is a valid JSON array.
#   3. Transform JSON data into WireGuard [Peer] configuration blocks.
#   4. Merge the new peer configurations with the existing Interface header.
#      Note: It assumes the first 11 lines of the current config contain the [Interface] section.
#   5. Compare the new config with the existing one.
#   6. If changes are found:
#      a. Create a timestamped backup of the current config.
#      b. Replace the old config with the new one.
#      c. Restart the WireGuard interface using systemctl or wg-quick.

# =========================
# CONFIG
# =========================
API_URL="https://console.planetlab.io/api/node/peers"
WG_CONFIG="/etc/wireguard/wg0.conf"
WG_INTERFACE="wg0"

TMP_FILE="/tmp/wg0.conf.tmp"

# =========================
# DEPENDENCIES CHECK
# =========================
command -v curl >/dev/null 2>&1 || { echo "curl is required"; exit 1; }
command -v jq   >/dev/null 2>&1 || { echo "jq is required"; exit 1; }
command -v wg   >/dev/null 2>&1 || { echo "wg is required"; exit 1; }

# =========================
# FETCH API (HTTP CHECK)
# =========================
echo "[+] Fetching peer list..."

HTTP_RESPONSE=$(curl -sS -w "\n%{http_code}" "$API_URL")
HTTP_BODY=$(echo "$HTTP_RESPONSE" | sed '$d')
HTTP_CODE=$(echo "$HTTP_RESPONSE" | tail -n1)

if [[ "$HTTP_CODE" -ne 200 ]]; then
    echo "[-] Error: API returned HTTP $HTTP_CODE"
    exit 1
fi

# =========================
# VALIDATE JSON ARRAY
# =========================
if ! echo "$HTTP_BODY" | jq -e 'type == "array"' >/dev/null; then
    echo "[-] Error: API response is not a JSON array"
    exit 1
fi

# =========================
# BUILD PEER CONFIG
# =========================
echo "[+] Building WireGuard peer config..."

PEER_CONFIG="$(echo "$HTTP_BODY" | jq -r '
    .[] |
    "[Peer]\nPublicKey = \(.public_key)\nAllowedIPs = \(.allowed_ips)\n"
')"

if [[ -z "$PEER_CONFIG" ]]; then
    echo "[-] Error: No peers generated"
    exit 1
fi

# =========================
# BUILD FULL CONFIG (FOR COMPARISON + SYNC)
# =========================
head -n 11 "$WG_CONFIG" > "$TMP_FILE"
printf "%b" "$PEER_CONFIG" >> "$TMP_FILE"

# =========================
# CHECK IF CONFIG CHANGED
# =========================
if cmp -s "$WG_CONFIG" "$TMP_FILE"; then
    echo "[+] No changes detected. Skipping sync."
    rm -f "$TMP_FILE"
    exit 0
fi

echo "[+] Changes detected. Applying via wg syncconf..."

# =========================
# APPLY WITHOUT RESTART
# =========================
wg syncconf "$WG_INTERFACE" <(wg-quick strip "$TMP_FILE")

# =========================
# PERSIST CHANGES TO DISK
# =========================
BACKUP_FILE="${WG_CONFIG}.bak.$(date +%s)"
cp "$WG_CONFIG" "$BACKUP_FILE"
mv "$TMP_FILE" "$WG_CONFIG"

echo "[+] Sync complete. Config updated and applied."
echo "[+] Backup saved: $BACKUP_FILE"