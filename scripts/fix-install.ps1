# ============================================================================
# PUBLICADIS - Fix Installation Script (PowerShell)
# ============================================================================

Write-Host "🔧 PUBLICADIS - Fixing Installation Issues" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Clean everything
Write-Host "🧹 Cleaning old installations..." -ForegroundColor Yellow
Remove-Item -Recurse -Force -ErrorAction SilentlyContinue node_modules
Remove-Item -Force -ErrorAction SilentlyContinue package-lock.json
Get-ChildItem -Path apps -Directory | ForEach-Object {
    Remove-Item -Recurse -Force -ErrorAction SilentlyContinue "$($_.FullName)/node_modules"
    Remove-Item -Recurse -Force -ErrorAction SilentlyContinue "$($_.FullName)/.next"
    Remove-Item -Recurse -Force -ErrorAction SilentlyContinue "$($_.FullName)/dist"
}
Get-ChildItem -Path packages -Directory | ForEach-Object {
    Remove-Item -Recurse -Force -ErrorAction SilentlyContinue "$($_.FullName)/node_modules"
}
Write-Host "✅ Cleaned" -ForegroundColor Green
Write-Host ""

# Clear npm cache
Write-Host "🗑️  Clearing npm cache..." -ForegroundColor Yellow
npm cache clean --force
Write-Host "✅ Cache cleared" -ForegroundColor Green
Write-Host ""

# Install dependencies
Write-Host "📦 Installing dependencies (this may take a few minutes)..." -ForegroundColor Yellow
npm install --legacy-peer-deps
Write-Host "✅ Dependencies installed" -ForegroundColor Green
Write-Host ""

# Verify turbo is installed
Write-Host "🔍 Verifying turbo installation..." -ForegroundColor Yellow
if (Test-Path "node_modules/.bin/turbo") {
    Write-Host "✅ Turbo is installed" -ForegroundColor Green
    & node_modules/.bin/turbo --version
} else {
    Write-Host "❌ Turbo not found, installing..." -ForegroundColor Red
    npm install turbo@^2.3.3 --save-dev --legacy-peer-deps
}
Write-Host ""

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "🎉 Installation fixed!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Yellow
Write-Host "   1. Run: npm run dev"
Write-Host ""

