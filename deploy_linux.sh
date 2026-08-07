#!/usr/bin/env bash

# ==============================================================================
# DFUS REUVEN Production Deployment Script (Server-Side)
# Next.js app under PM2, proxied by Nginx at https://vee-app.co.il/DfusReuven
# ==============================================================================

set -euo pipefail

APP_ROOT="$(pwd)"
REMOTE_REPO="${REMOTE_REPO:-https://github.com/lironatar1994-coder/DfusReuven.git}"
PROCESS_NAME="${PROCESS_NAME:-dfus-reuven}"
FRONTEND_PORT="${FRONTEND_PORT:-3104}"
ROUTE_BASE="${ROUTE_BASE:-/DfusReuven}"
LOWER_ROUTE_BASE="$(echo "$ROUTE_BASE" | tr '[:upper:]' '[:lower:]')"
PUBLIC_SITE_URL="${NEXT_PUBLIC_SITE_URL:-https://vee-app.co.il$ROUTE_BASE}"
ALLOW_INDEXING="${NEXT_PUBLIC_ALLOW_INDEXING:-false}"
# Quote submissions and customer artwork live outside the repo so a deploy never wipes them.
QUOTE_STORAGE_DIR="${QUOTE_STORAGE_DIR:-/var/lib/dfus-reuven/quotes}"
QUOTE_WEBHOOK_URL="${QUOTE_WEBHOOK_URL:-}"
# Secrets — the admin password hash, the mail API key, the webhook signing key —
# come from a root-owned chmod 600 file outside the release directory, not from
# the pm2 command line where `ps aux` and `pm2 describe` would print them. The
# file is optional: without it the app runs exactly as before, and /admin
# returns 503 rather than opening up.
ENV_FILE="${ENV_FILE:-/etc/dfus-reuven/app.env}"
NGINX_CONF="${NGINX_CONF:-/etc/nginx/sites-available/vee-app.co.il.conf}"
NGINX_SNIPPET="${NGINX_SNIPPET:-/etc/nginx/snippets/dfus-reuven-locations.conf}"
# Customers upload print-ready PDF/AI artwork; Nginx defaults to 1MB and would 413.
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

run_npm_install() {
    if [ -f package-lock.json ]; then
        npm ci --silent
    else
        npm install --silent
    fi
}

log "Starting DFUS REUVEN deployment..."

if [ "${SKIP_GIT_SYNC:-0}" != "1" ]; then
    log "Syncing repository from origin/main..."
    git remote set-url origin "$REMOTE_REPO"
    git fetch origin main
    git reset --hard origin/main
else
    log "Skipping git sync because SKIP_GIT_SYNC=1." "WARN"
fi

log "Installing dependencies..."
cd "$APP_ROOT"
run_npm_install

log "Preparing quote storage at $QUOTE_STORAGE_DIR..."
mkdir -p "$QUOTE_STORAGE_DIR/files"

log "Building Next.js app for $PUBLIC_SITE_URL..."
NEXT_BASE_PATH="$ROUTE_BASE" NEXT_PUBLIC_BASE_PATH="$ROUTE_BASE" \
    NEXT_PUBLIC_SITE_URL="$PUBLIC_SITE_URL" \
    NEXT_PUBLIC_ALLOW_INDEXING="$ALLOW_INDEXING" \
    npm run build

log "Starting/restarting PM2 process $PROCESS_NAME on port $FRONTEND_PORT..."
pm2 delete "$PROCESS_NAME" > /dev/null 2>&1 || true
# `set -a` exports everything the file defines, so pm2 inherits it rather than
# receiving it as visible argv. The explicit assignments below still win.
if [ -f "$ENV_FILE" ]; then
    log "Loading runtime secrets from $ENV_FILE..."
    set -a; . "$ENV_FILE"; set +a
else
    log "No $ENV_FILE — /admin will return 503 and lead emails are off." "WARN"
fi
PORT="$FRONTEND_PORT" NEXT_BASE_PATH="$ROUTE_BASE" NEXT_PUBLIC_BASE_PATH="$ROUTE_BASE" \
    NEXT_PUBLIC_SITE_URL="$PUBLIC_SITE_URL" \
    NEXT_PUBLIC_ALLOW_INDEXING="$ALLOW_INDEXING" \
    QUOTE_STORAGE_DIR="$QUOTE_STORAGE_DIR" \
    QUOTE_WEBHOOK_URL="$QUOTE_WEBHOOK_URL" \
    pm2 start npm --name "$PROCESS_NAME" --cwd "$APP_ROOT" -- start
pm2 save > /dev/null

log "Writing Nginx route snippet for vee-app.co.il$ROUTE_BASE..."
mkdir -p "$(dirname "$NGINX_SNIPPET")"
cat > "$NGINX_SNIPPET" <<NGINX
location = $ROUTE_BASE {
    proxy_pass http://127.0.0.1:$FRONTEND_PORT;
    proxy_http_version 1.1;
    proxy_set_header Upgrade \$http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host \$host;
    proxy_cache_bypass \$http_upgrade;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
}

location = $LOWER_ROUTE_BASE {
    return 301 $ROUTE_BASE\$is_args\$args;
}

location ^~ $LOWER_ROUTE_BASE/ {
    rewrite ^$LOWER_ROUTE_BASE(.*)\$ $ROUTE_BASE\$1 permanent;
}

location ^~ $ROUTE_BASE/ {
    proxy_pass http://127.0.0.1:$FRONTEND_PORT;
    proxy_http_version 1.1;
    proxy_set_header Upgrade \$http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host \$host;
    proxy_cache_bypass \$http_upgrade;
    proxy_set_header X-Real-IP \$remote_addr;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;

    # Print-ready artwork uploads on the quote form.
    client_max_body_size $MAX_UPLOAD;
    proxy_read_timeout 300s;
    proxy_send_timeout 300s;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'; script-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}
NGINX

if [ ! -f "$NGINX_CONF" ]; then
    log "Nginx config not found: $NGINX_CONF" "ERROR"
    exit 1
fi

log "Ensuring the snippet is included in $NGINX_CONF..."
python3 - "$NGINX_CONF" "$NGINX_SNIPPET" <<'PY'
from pathlib import Path
import sys

conf_path = Path(sys.argv[1])
snippet_path = Path(sys.argv[2])
include_line = f"    include {snippet_path};\n"
text = conf_path.read_text()

if include_line not in text:
    marker = "    location /text-to-pdf {"
    if marker not in text:
        marker = "    location / {"
    if marker not in text:
        raise SystemExit("Could not find insertion point in vee-app.co.il.conf")
    text = text.replace(marker, include_line + "\n" + marker, 1)
    conf_path.write_text(text)
    print("include line added")
else:
    print("include line already present")
PY

log "Testing and reloading Nginx..."
nginx -t
systemctl reload nginx

log "Waiting for the app to answer locally..."
for attempt in {1..30}; do
    if curl -fsS "http://127.0.0.1:$FRONTEND_PORT$ROUTE_BASE" > /dev/null 2>&1; then
        break
    fi
    if [ "$attempt" -eq 30 ]; then
        log "Local app health check failed after waiting." "ERROR"
        pm2 logs "$PROCESS_NAME" --lines 80 --nostream --no-color || true
        exit 1
    fi
    sleep 1
done

log "Running health checks through Nginx..."
check_url() {
    local url="$1"
    local expected="$2"
    local label="$3"
    local code
    code="$(curl -k -s -o /dev/null -w '%{http_code}' --resolve vee-app.co.il:443:127.0.0.1 "$url")"
    if [ "$code" != "$expected" ]; then
        log "$label returned HTTP $code (expected $expected)" "ERROR"
        return 1
    fi
    log "$label -> HTTP $code"
    return 0
}

FAILED=0
check_url "https://vee-app.co.il$ROUTE_BASE" "200" "Home page" || FAILED=1
check_url "https://vee-app.co.il$ROUTE_BASE/products" "200" "Products page" || FAILED=1
check_url "https://vee-app.co.il$ROUTE_BASE/products/business-cards" "200" "Product detail" || FAILED=1
check_url "https://vee-app.co.il$ROUTE_BASE/quote" "200" "Quote page" || FAILED=1

if [ "$FAILED" -ne 0 ]; then
    log "Health checks failed. Recent app logs:" "ERROR"
    pm2 logs "$PROCESS_NAME" --lines 60 --nostream --no-color || true
    exit 1
fi

# The quote API is the site's conversion path — verify it accepts a real submission.
log "Verifying the quote API end to end..."
API_CODE="$(curl -k -s -o /tmp/dfus-quote-check.json -w '%{http_code}' \
    --resolve vee-app.co.il:443:127.0.0.1 \
    -F 'fullname=בדיקת דיפלוי' \
    -F 'phone=050-0000000' \
    -F 'product=בדיקה אוטומטית' \
    -F 'details=deployment smoke test' \
    "https://vee-app.co.il$ROUTE_BASE/api/quote")"

if [ "$API_CODE" != "200" ]; then
    log "Quote API returned HTTP $API_CODE" "ERROR"
    cat /tmp/dfus-quote-check.json 2>/dev/null || true
    pm2 logs "$PROCESS_NAME" --lines 40 --nostream --no-color || true
    exit 1
fi
log "Quote API -> HTTP 200 (test submission recorded in $QUOTE_STORAGE_DIR/quotes.jsonl)"
rm -f /tmp/dfus-quote-check.json

log "DFUS REUVEN deployment complete." "SUCCESS"
log "Public: https://vee-app.co.il$ROUTE_BASE" "SUCCESS"
log "Quote submissions: $QUOTE_STORAGE_DIR/quotes.jsonl" "SUCCESS"
if [ "$ALLOW_INDEXING" != "true" ]; then
    log "Search engine indexing is disabled (NEXT_PUBLIC_ALLOW_INDEXING=$ALLOW_INDEXING)." "WARN"
fi
