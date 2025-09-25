# Run-Angular-App-Fixed.ps1
# A script to run the Angular application with proper network binding

Write-Host "Starting Kanban Task Manager with fixed network binding..." -ForegroundColor Green

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
    exit 1
}

# Kill any existing node processes that might be using our ports
Write-Host "Stopping any existing Node.js processes..." -ForegroundColor Yellow
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force

# Port to use
$port = 4201

# Start the server with host 0.0.0.0 to bind to all interfaces
Write-Host "Starting server on port $port..." -ForegroundColor Green
Write-Host "Access the application at: http://localhost:$port" -ForegroundColor Cyan
Write-Host "You can also try accessing with your computer's IP address: http://[YOUR-IP]:$port" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow

# Use ng serve directly with proper arguments
Write-Host "Using direct ng serve command for better network binding..." -ForegroundColor Yellow
npx ng serve --port $port --host 0.0.0.0 --disable-host-check