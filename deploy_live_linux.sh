#!/usr/bin/env bash

# ==============================================================================
# DFUS REUVEN canonical-domain deployment (server-side)
# Builds the indexable root-path site and serves it at https://www.dfusreuven.co.il
# ==============================================================================

set -euo pipefail

BUILD_ROOT="$(pwd)"
APP_ROOT="${LIVE_APP_ROOT:-$BUILD_ROOT}"
ROLLBACK_ROOT="${ROLLBACK_APP_ROOT:-${APP_ROOT}.rollback}"
FAILED_ROOT="${APP_ROOT}.failed"
PROCESS_NAME="dfus-reuven-live"
FRONTEND_PORT="${FRONTEND_PORT:-3106}"
ROOT_DOMAIN="dfusreuven.co.il"
CANONICAL_DOMAIN="www.dfusreuven.co.il"
PUBLIC_SITE_URL="https://$CANONICAL_DOMAIN"
# Quote submissions and customer artwork live outside the release directory so
# the staged swap below never takes them with it.
QUOTE_STORAGE_DIR="${QUOTE_STORAGE_DIR:-/var/lib/dfus-reuven/quotes}"
QUOTE_WEBHOOK_URL="${QUOTE_WEBHOOK_URL:-}"
# Secrets live outside the release directory, in a root-owned chmod 600 file,
# not on the pm2 command line where `ps aux` would print them. Optional: with
# no file the app runs as before and /admin returns 503 rather than opening up.
# Production and staging must use SEPARATE files — never share credentials.
ENV_FILE="${ENV_FILE:-/etc/dfus-reuven/app.env}"
NGINX_CONF="/etc/nginx/sites-available/dfusreuven.co.il.conf"
NGINX_ENABLED="/etc/nginx/sites-enabled/dfusreuven.co.il.conf"
CERT_DIR="/etc/letsencrypt/live/dfusreuven.co.il"
CERT_EMAIL="${CERT_EMAIL:-info@dfusreuven.co.il}"
MAX_UPLOAD="${MAX_UPLOAD:-30m}"

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log() {
    local message="$1"
    local level="${2:-INFO}"
    local color="$NC"
    case "$level" in
        "INFO") color="$BLUE" ;;
        "SUCCESS") color="$GREEN" ;;
        "WARN") color="$YELLOW" ;;
        "ERROR") color="$RED" ;;
    esac
    echo -e "${color}[$(date +'%Y-%m-%d %H:%M:%S')] [$level] $message${NC}"
}

# ---------------------------------------------------------------- DNS preflight
# A freshly registered .co.il can take up to 24h to resolve. Running certbot
# before then burns Let's Encrypt failed-validation rate limits (5/hour per
# hostname) and leaves a half-written vhost, so refuse early and clearly.
if [ ! -f "$CERT_DIR/fullchain.pem" ] && [ "${SKIP_DNS_CHECK:-0}" != "1" ]; then
    log "Checking that $ROOT_DOMAIN resolves before requesting a certificate..."
    SERVER_IP="$(curl -fsS --max-time 10 https://api.ipify.org 2>/dev/null || true)"
    RESOLVED=""
    for host in "$ROOT_DOMAIN" "$CANONICAL_DOMAIN"; do
        ip="$(getent hosts "$host" 2>/dev/null | awk '{print $1}' | head -n1 || true)"
        if [ -z "$ip" ]; then
            log "$host does not resolve yet." "ERROR"
            log "A newly registered domain can take up to 24 hours to propagate." "WARN"
            log "Check with:  dig +short $host" "WARN"
            log "Re-run this deploy once it returns the server's IP${SERVER_IP:+ ($SERVER_IP)}." "WARN"
            log "To deploy the app without TLS anyway:  SKIP_DNS_CHECK=1 bash deploy_live_linux.sh" "WARN"
            exit 3
        fi
        RESOLVED="$RESOLVED $host=$ip"
        if [ -n "$SERVER_IP" ] && [ "$ip" != "$SERVER_IP" ]; then
            log "$host resolves to $ip but this server is $SERVER_IP." "ERROR"
            log "Point the A record at $SERVER_IP and wait for propagation." "WARN"
            exit 3
        fi
    done
    log "DNS OK:$RESOLVED"
fi

# --------------------------------------------------------------------- build
log "Installing dependencies for the canonical-domain build..."
if [ -f package-lock.json ]; then
    npm ci --silent
else
    npm install --silent
fi

log "Building the root-path, indexable site for $PUBLIC_SITE_URL..."
NEXT_BASE_PATH="" NEXT_PUBLIC_BASE_PATH="" \
    NEXT_PUBLIC_SITE_URL="$PUBLIC_SITE_URL" NEXT_PUBLIC_ALLOW_INDEXING=true \
    npm run build

# ------------------------------------------------------------ staged activation
STAGED_ACTIVATION=false
if [ "$BUILD_ROOT" != "$APP_ROOT" ]; then
    if [ "$APP_ROOT" != "/root/DfusReuven-live" ] || \
       [ "$ROLLBACK_ROOT" != "/root/DfusReuven-live.rollback" ] || \
       [ "$FAILED_ROOT" != "/root/DfusReuven-live.failed" ]; then
        log "Refusing to rotate unexpected deployment paths." "ERROR"
        exit 64
    fi

    log "Activating the clean staged release..."
    rm -rf -- "$ROLLBACK_ROOT" "$FAILED_ROOT"
    if [ -d "$APP_ROOT" ]; then
        mv "$APP_ROOT" "$ROLLBACK_ROOT"
    fi
    mv "$BUILD_ROOT" "$APP_ROOT"
    cd "$APP_ROOT"
    STAGED_ACTIVATION=true
fi

start_app() {
    # Exported, so pm2 inherits them instead of taking them as visible argv.
    if [ -f "$ENV_FILE" ]; then
        set -a; . "$ENV_FILE"; set +a
    fi
    PORT="$FRONTEND_PORT" NEXT_BASE_PATH="" NEXT_PUBLIC_BASE_PATH="" \
        NEXT_PUBLIC_SITE_URL="$PUBLIC_SITE_URL" NEXT_PUBLIC_ALLOW_INDEXING=true \
        QUOTE_STORAGE_DIR="$QUOTE_STORAGE_DIR" \
        QUOTE_WEBHOOK_URL="$QUOTE_WEBHOOK_URL" \
        pm2 start npm --name "$PROCESS_NAME" --cwd "$APP_ROOT" -- start
}

restore_previous_release() {
    if [ "$STAGED_ACTIVATION" != true ] || [ ! -d "$ROLLBACK_ROOT" ]; then
        return
    fi

    log "Restoring the previous canonical-domain release..." "WARN"
    pm2 delete "$PROCESS_NAME" > /dev/null 2>&1 || true
    mv "$APP_ROOT" "$FAILED_ROOT"
    mv "$ROLLBACK_ROOT" "$APP_ROOT"
    cd "$APP_ROOT"
    start_app
    pm2 save > /dev/null
}

log "Preparing quote storage at $QUOTE_STORAGE_DIR..."
mkdir -p "$QUOTE_STORAGE_DIR/files"

log "Starting PM2 process $PROCESS_NAME on port $FRONTEND_PORT..."
pm2 delete "$PROCESS_NAME" > /dev/null 2>&1 || true
if ! start_app; then
    restore_previous_release
    exit 1
fi
pm2 save > /dev/null

log "Waiting for the root-path application health check..."
for attempt in {1..30}; do
    if curl -fsS "http://127.0.0.1:$FRONTEND_PORT/" > /dev/null 2>&1; then
        break
    fi
    if [ "$attempt" -eq 30 ]; then
        log "The canonical-domain application did not become healthy." "ERROR"
        pm2 logs "$PROCESS_NAME" --lines 100 --nostream --no-color || true
        restore_previous_release
        exit 1
    fi
    sleep 1
done

# ----------------------------------------------------------------- certificate
if [ ! -f "$CERT_DIR/fullchain.pem" ]; then
    log "Writing the temporary HTTP virtual host for certificate issuance..."
    cat > "$NGINX_CONF" <<NGINX
server {
    listen 80;
    listen [::]:80;
    server_name $ROOT_DOMAIN $CANONICAL_DOMAIN;

    location / {
        proxy_pass http://127.0.0.1:$FRONTEND_PORT;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
NGINX
    ln -sfn "$NGINX_CONF" "$NGINX_ENABLED"
    nginx -t
    systemctl reload nginx

    if [ "${SKIP_DNS_CHECK:-0}" = "1" ]; then
        log "SKIP_DNS_CHECK=1 — serving over HTTP only, no certificate requested." "WARN"
        log "Site is reachable at http://$CANONICAL_DOMAIN once DNS resolves." "WARN"
        log "Re-run without SKIP_DNS_CHECK to issue TLS." "WARN"
        exit 0
    fi

    log "Issuing the TLS certificate for both hostnames..."
    if ! certbot certonly --nginx --non-interactive --agree-tos \
            --email "$CERT_EMAIL" \
            -d "$ROOT_DOMAIN" -d "$CANONICAL_DOMAIN"; then
        log "Certificate issuance failed. The app is running on HTTP." "ERROR"
        log "Most common cause: DNS has not finished propagating." "WARN"
        log "Verify with 'dig +short $ROOT_DOMAIN', then re-run this script." "WARN"
        exit 1
    fi
fi

# ------------------------------------------------------------------ https vhost
log "Writing the canonical HTTPS virtual host..."
cat > "$NGINX_CONF" <<NGINX
server {
    listen 80;
    listen [::]:80;
    server_name $ROOT_DOMAIN $CANONICAL_DOMAIN;
    return 301 https://$CANONICAL_DOMAIN\$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name $ROOT_DOMAIN;

    ssl_certificate $CERT_DIR/fullchain.pem;
    ssl_certificate_key $CERT_DIR/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    return 301 https://$CANONICAL_DOMAIN\$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name $CANONICAL_DOMAIN;

    ssl_certificate $CERT_DIR/fullchain.pem;
    ssl_certificate_key $CERT_DIR/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    access_log /var/log/nginx/dfusreuven.access.log;
    error_log /var/log/nginx/dfusreuven.error.log;

    # Print-ready artwork uploads on the quote form.
    client_max_body_size $MAX_UPLOAD;

    location / {
        proxy_pass http://127.0.0.1:$FRONTEND_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header X-Forwarded-Host \$host;
        proxy_read_timeout 300s;
        proxy_send_timeout 300s;
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;
        add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'; script-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    }
}
NGINX

ln -sfn "$NGINX_CONF" "$NGINX_ENABLED"
nginx -t
systemctl reload nginx

# ----------------------------------------------------------------- final checks
log "Running canonical-domain HTTPS checks..."
curl --noproxy '*' -fsS --resolve "$CANONICAL_DOMAIN:443:127.0.0.1" "$PUBLIC_SITE_URL/" > /dev/null
curl --noproxy '*' -fsSI --resolve "$ROOT_DOMAIN:443:127.0.0.1" "https://$ROOT_DOMAIN/" | grep -qi "location: $PUBLIC_SITE_URL/"

log "Verifying the site is now indexable..."
if curl --noproxy '*' -fsS --resolve "$CANONICAL_DOMAIN:443:127.0.0.1" "$PUBLIC_SITE_URL/robots.txt" | grep -qi "Disallow: /$"; then
    log "robots.txt still blocks crawlers — NEXT_PUBLIC_ALLOW_INDEXING did not take effect." "ERROR"
    restore_previous_release
    exit 1
fi

log "Verifying the quote API on the canonical domain..."
API_CODE="$(curl --noproxy '*' -k -s -o /tmp/dfus-live-check.json -w '%{http_code}' \
    --resolve "$CANONICAL_DOMAIN:443:127.0.0.1" \
    -F 'fullname=בדיקת דיפלוי' \
    -F 'phone=050-0000000' \
    -F 'product=בדיקה אוטומטית' \
    -F 'details=live deployment smoke test' \
    "$PUBLIC_SITE_URL/api/quote")"
if [ "$API_CODE" != "200" ]; then
    log "Quote API returned HTTP $API_CODE" "ERROR"
    cat /tmp/dfus-live-check.json 2>/dev/null || true
    restore_previous_release
    exit 1
fi
rm -f /tmp/dfus-live-check.json
log "Quote API -> HTTP 200"

log "Removing disposable build cache and the superseded release..."
rm -rf -- "$APP_ROOT/.next/cache"
if [ "$STAGED_ACTIVATION" = true ]; then
    rm -rf -- "$ROLLBACK_ROOT" "$FAILED_ROOT"
fi

log "DFUS REUVEN canonical-domain deployment complete." "SUCCESS"
log "Public: $PUBLIC_SITE_URL" "SUCCESS"
log "Quote submissions: $QUOTE_STORAGE_DIR/quotes.jsonl" "SUCCESS"
