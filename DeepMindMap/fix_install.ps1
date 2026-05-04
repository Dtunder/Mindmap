# This script fixes npm install issues caused by Google Drive sync interference.
$projectName = "DeepMindMap"
$localPath = "C:\Users\$env:USERNAME\DeepMindMap_Temp"
$gDrivePath = Get-Location

Write-Host "Cleaning up local temp path if it exists..." -ForegroundColor Cyan
if (Test-Path $localPath) { Remove-Item -Recurse -Force $localPath }

Write-Host "Copying project to local disk for stable installation..." -ForegroundColor Cyan
Copy-Item -Path $gDrivePath -Destination $localPath -Recurse -Exclude "node_modules"

Set-Location $localPath

Write-Host "Running npm install locally..." -ForegroundColor Green
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "Installation successful! Moving project back to Google Drive..." -ForegroundColor Green
    Set-Location $gDrivePath
    # Only move node_modules back as that's what's usually broken
    if (Test-Path "node_modules") { Remove-Item -Recurse -Force "node_modules" }
    Move-Item -Path "$localPath\node_modules" -Destination "$gDrivePath\node_modules"
    
    Write-Host "Success! You can now run 'npm run dev'." -ForegroundColor Green
} else {
    Write-Host "Installation failed even locally. Check your internet connection or npm cache." -ForegroundColor Red
}

Remove-Item -Recurse -Force $localPath
