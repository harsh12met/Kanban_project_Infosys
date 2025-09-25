# Run-Angular-App.ps1
# A simple script to run the Angular application with proper error handling

Write-Host "Starting Kanban Task Manager..." -ForegroundColor Green

# Set the project directory
$projectPath = "C:\Users\harsh\OneDrive\Attachments\Desktop\Web-Based-Kanban-Task-Manager-with-Drag-and-Drop-Functionality_September_2025\my-kanban-project"

# Check if project directory exists
if (-not (Test-Path $projectPath)) {
    Write-Host "Error: Project directory not found at $projectPath" -ForegroundColor Red
    exit 1
}

# Navigate to project directory
Set-Location $projectPath

# Check if package.json exists
if (-not (Test-Path "package.json")) {
    Write-Host "Error: package.json not found in project directory" -ForegroundColor Red
    Write-Host "Current directory: $(Get-Location)" -ForegroundColor Yellow
    Write-Host "Directory contents:" -ForegroundColor Yellow
    Get-ChildItem
    exit 1
}

# Check if node_modules exists, if not, install dependencies
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error installing dependencies" -ForegroundColor Red
        exit 1
    }
}

# Try to find an available port starting from 4201
$port = 4201
$maxPort = 4210  # Try up to this port number

while ($port -le $maxPort) {
    # Check if port is available
    $portInUse = Get-NetTCPConnection -ErrorAction SilentlyContinue | Where-Object { $_.LocalPort -eq $port -and ($_.State -eq "Listen" -or $_.State -eq "Established") }
    
    if (-not $portInUse) {
        Write-Host "Found available port: $port" -ForegroundColor Green
        break
    }
    
    Write-Host "Port $port is in use, trying next port..." -ForegroundColor Yellow
    $port++
}

if ($port -gt $maxPort) {
    Write-Host "Error: Could not find an available port between 4201 and $maxPort" -ForegroundColor Red
    exit 1
}

# Start the server
Write-Host "Starting server on port $port..." -ForegroundColor Green
Write-Host "Access the application at: http://localhost:$port" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow

npm run start -- --port $port