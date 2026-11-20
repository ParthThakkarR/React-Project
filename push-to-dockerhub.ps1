#!/usr/bin/env pwsh
# push-to-dockerhub.ps1
# Builds and pushes both images to Docker Hub under partthh/

$DOCKERHUB_USER = "partthh"
$BACKEND_IMAGE  = "$DOCKERHUB_USER/organic-food-backend"
$FRONTEND_IMAGE = "$DOCKERHUB_USER/organic-food-frontend"
$TAG            = "latest"
$SHA_TAG        = (git -C $PSScriptRoot rev-parse --short HEAD 2>$null) ?? "manual"

Write-Host "`n==============================" -ForegroundColor Cyan
Write-Host " Organic Food — Docker Hub Push" -ForegroundColor Cyan
Write-Host "==============================`n" -ForegroundColor Cyan

# ── 1. Login check ──────────────────────────────────────────
Write-Host "[1/5] Checking Docker Hub login..." -ForegroundColor Yellow
$loginCheck = docker system info --format "{{.Name}}" 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Docker daemon not ready. Please ensure Docker Desktop is running." -ForegroundColor Red
    exit 1
}
Write-Host "     Docker daemon OK" -ForegroundColor Green

# ── 2. Build backend ────────────────────────────────────────
Write-Host "`n[2/5] Building backend image..." -ForegroundColor Yellow
docker build -t "${BACKEND_IMAGE}:${TAG}" -t "${BACKEND_IMAGE}:${SHA_TAG}" "$PSScriptRoot\backend"
if ($LASTEXITCODE -ne 0) { Write-Host "Backend build FAILED" -ForegroundColor Red; exit 1 }
Write-Host "     Backend built OK" -ForegroundColor Green

# ── 3. Build frontend ────────────────────────────────────────
Write-Host "`n[3/5] Building frontend image..." -ForegroundColor Yellow
docker build -t "${FRONTEND_IMAGE}:${TAG}" -t "${FRONTEND_IMAGE}:${SHA_TAG}" "$PSScriptRoot\React\First"
if ($LASTEXITCODE -ne 0) { Write-Host "Frontend build FAILED" -ForegroundColor Red; exit 1 }
Write-Host "     Frontend built OK" -ForegroundColor Green

# ── 4. Push both images ─────────────────────────────────────
Write-Host "`n[4/5] Pushing to Docker Hub..." -ForegroundColor Yellow
docker push "${BACKEND_IMAGE}:${TAG}"
docker push "${BACKEND_IMAGE}:${SHA_TAG}"
docker push "${FRONTEND_IMAGE}:${TAG}"
docker push "${FRONTEND_IMAGE}:${SHA_TAG}"
if ($LASTEXITCODE -ne 0) { Write-Host "Push FAILED — are you logged in? Run: docker login" -ForegroundColor Red; exit 1 }

# ── 5. Summary ──────────────────────────────────────────────
Write-Host "`n[5/5] Done! Images on Docker Hub:" -ForegroundColor Green
Write-Host "  Backend  → https://hub.docker.com/r/$BACKEND_IMAGE" -ForegroundColor Cyan
Write-Host "  Frontend → https://hub.docker.com/r/$FRONTEND_IMAGE" -ForegroundColor Cyan
Write-Host "  Tags: latest, $SHA_TAG`n" -ForegroundColor Cyan
