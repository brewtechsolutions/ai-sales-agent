# Development Server Helper Script
# Usage: .\dev.ps1

Write-Host "🚀 Starting Expo Development Server..." -ForegroundColor Green
Write-Host ""
Write-Host "Choose an option:"
Write-Host "1. Full build (builds native app + starts Metro) - Recommended"
Write-Host "2. Metro only (starts bundler, app must be installed)"
Write-Host "3. Clear cache and start Metro"
Write-Host ""
$choice = Read-Host "Enter choice (1-3)"

switch ($choice) {
    "1" {
        Write-Host "Building native app and starting Metro..." -ForegroundColor Yellow
        bun android
    }
    "2" {
        Write-Host "Starting Metro bundler..." -ForegroundColor Yellow
        bun start
    }
    "3" {
        Write-Host "Clearing cache and starting Metro..." -ForegroundColor Yellow
        if (Test-Path .expo) { Remove-Item -Recurse -Force .expo }
        expo start --clear
    }
    default {
        Write-Host "Invalid choice. Starting default (full build)..." -ForegroundColor Yellow
        bun android
    }
}

