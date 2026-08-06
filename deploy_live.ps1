# ==============================================================================
# DFUS REUVEN canonical-domain deployment (local Windows)
# Ships the approved release to https://www.dfusreuven.co.il
# ==============================================================================

param (
    [switch]$SkipCheck,
    [switch]$SkipBuild,
    [switch]$SkipDnsCheck
)

$ErrorActionPreference = "Stop"

$SSH_HOST = "root@vee-app.co.il"
$SSH_DOMAIN = "vee-app.co.il"
$REMOTE_DIR = "/root/DfusReuven-live"
$REMOTE_STAGE_DIR = "/root/DfusReuven-live.next"
$REMOTE_ROLLBACK_DIR = "/root/DfusReuven-live.rollback"
$ARCHIVE_NAME = "dfus-reuven-live-deploy.tar.gz"
$ROOT_DOMAIN = "dfusreuven.co.il"
$CANONICAL_DOMAIN = "www.dfusreuven.co.il"

Write-Host "--- Starting DFUS REUVEN canonical-domain deployment ---" -ForegroundColor Cyan

if (-not $SkipCheck) {
    Write-Host "Checking server connectivity..." -ForegroundColor Gray
    if (-not (Test-Connection -ComputerName $SSH_DOMAIN -Count 1 -Quiet)) {
        Write-Host "Error: Could not ping server $SSH_DOMAIN." -ForegroundColor Red
        exit 1
    }
}

# ------------------------------------------------------------- DNS preflight
# A freshly registered .co.il can take up to 24 hours to resolve. Catch it here
# so we never ship a release that the server will refuse to certificate.
if (-not $SkipDnsCheck) {
    Write-Host "Checking that $ROOT_DOMAIN resolves..." -ForegroundColor Gray
    # NB: $host is a reserved PowerShell automatic variable — do not shadow it.
    $resolved = $true
    foreach ($domain in @($ROOT_DOMAIN, $CANONICAL_DOMAIN)) {
        try {
            $null = [System.Net.Dns]::GetHostAddresses($domain)
        } catch {
            Write-Host "  $domain does not resolve yet." -ForegroundColor Yellow
            $resolved = $false
        }
    }
    if (-not $resolved) {
        Write-Host ""
        Write-Host "DNS has not propagated yet." -ForegroundColor Red
        Write-Host "A newly registered domain can take up to 24 hours." -ForegroundColor Yellow
        Write-Host "Check with:  nslookup $ROOT_DOMAIN" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Until then, deploy to the staging subpath instead:" -ForegroundColor Cyan
        Write-Host "  powershell -ExecutionPolicy Bypass -File deploy.ps1" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "To push the app now and add TLS later:" -ForegroundColor Cyan
        Write-Host "  .\deploy_live.ps1 -SkipDnsCheck" -ForegroundColor Cyan
        exit 3
    }
    Write-Host "DNS resolves." -ForegroundColor Green
}

# ------------------------------------------------- local verification gate
if (-not $SkipBuild) {
    Write-Host "Type-checking and building locally..." -ForegroundColor Gray
    npm run typecheck
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error: Type check failed. The canonical domain gets verified code only." -ForegroundColor Red
        exit $LASTEXITCODE
    }
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error: Local build failed." -ForegroundColor Red
        exit $LASTEXITCODE
    }
}

if (-not (Test-Path ".git")) {
    Write-Host "Error: Run this script from the release repository root." -ForegroundColor Red
    exit 1
}

# The live domain ships committed code only — never a dirty worktree.
$status = git status --porcelain
if ($status) {
    Write-Host "Error: The worktree must be clean before a canonical-domain deployment." -ForegroundColor Red
    git status --short
    Write-Host ""
    Write-Host "Commit your changes first, or deploy to staging with deploy.ps1." -ForegroundColor Yellow
    exit 1
}

$archivePath = Join-Path $env:TEMP $ARCHIVE_NAME
if (Test-Path $archivePath) { Remove-Item -LiteralPath $archivePath -Force }

git archive --format=tar.gz -o $archivePath HEAD
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Failed to create the live deployment archive." -ForegroundColor Red
    exit $LASTEXITCODE
}

$deployExitCode = 1
try {
    Write-Host "Uploading the approved release archive..." -ForegroundColor Gray
    scp $archivePath "${SSH_HOST}:/tmp/$ARCHIVE_NAME"
    if ($LASTEXITCODE -ne 0) { throw "Failed to upload the live deployment archive." }

    Write-Host "Building and activating $CANONICAL_DOMAIN..." -ForegroundColor Blue
    $skipDns = if ($SkipDnsCheck) { "1" } else { "0" }
    $REMOTE_CMD = "set -e && trap 'rm -f -- /tmp/$ARCHIVE_NAME' EXIT && if [ '$REMOTE_STAGE_DIR' != '/root/DfusReuven-live.next' ]; then exit 64; fi && rm -rf -- '$REMOTE_STAGE_DIR' && mkdir -p '$REMOTE_STAGE_DIR' && tar -xzf '/tmp/$ARCHIVE_NAME' -C '$REMOTE_STAGE_DIR' && cd '$REMOTE_STAGE_DIR' && sed -i 's/\r`$//' deploy_live_linux.sh && chmod +x deploy_live_linux.sh && SKIP_DNS_CHECK=$skipDns LIVE_APP_ROOT='$REMOTE_DIR' ROLLBACK_APP_ROOT='$REMOTE_ROLLBACK_DIR' bash deploy_live_linux.sh"
    ssh $SSH_HOST $REMOTE_CMD
    $deployExitCode = $LASTEXITCODE
}
finally {
    if (Test-Path -LiteralPath $archivePath) { Remove-Item -LiteralPath $archivePath -Force }
}

if ($deployExitCode -eq 3) {
    Write-Host "`n[!] DNS is not ready on the server yet." -ForegroundColor Yellow
    Write-Host "Nothing was changed. Re-run once the domain resolves." -ForegroundColor Yellow
    exit 3
}

if ($deployExitCode -ne 0) {
    Write-Host "`n[!] LIVE DEPLOYMENT FAILED" -ForegroundColor Red
    Write-Host "The previous release was restored automatically." -ForegroundColor Yellow
    exit $deployExitCode
}

Write-Host "`n================================================" -ForegroundColor Green
Write-Host "      DFUS REUVEN LIVE DEPLOYED" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host "Public: https://$CANONICAL_DOMAIN" -ForegroundColor Cyan
Write-Host "Quote submissions: /var/lib/dfus-reuven/quotes/quotes.jsonl" -ForegroundColor Cyan
