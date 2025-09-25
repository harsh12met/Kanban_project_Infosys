#!/usr/bin/env pwsh

# PowerShell script to start Angular development server
# Navigate to project directory and start server

Write-Host "Starting Kanban Task Manager..." -ForegroundColor Green
Write-Host "Navigating to project directory..." -ForegroundColor Yellow

# Set the project directory
$projectPath = "C:\Users\harsh\OneDrive\Attachments\Desktop\Web-Based-Kanban-Task-Manager-with-Drag-and-Drop-Functionality_September_2025\my-kanban-project"

# Check if directory exists
if (Test-Path $projectPath) {
    Write-Host "Found project directory: $projectPath" -ForegroundColor Green
    Set-Location $projectPath
    
    # Check if package.json exists
    if (Test-Path "package.json") {
        Write-Host "Found package.json - preparing to start server..." -ForegroundColor Green
        
        # Clear Angular cache
        Write-Host "Clearing Angular cache..." -ForegroundColor Yellow
        try {
            Remove-Item -Path ".angular\cache" -Recurse -Force -ErrorAction SilentlyContinue
            Write-Host "Cache cleared successfully" -ForegroundColor Green
        } catch {
            Write-Host "No cache directory found or unable to clear cache" -ForegroundColor Yellow
        }
        
        Write-Host "Server will be available at: http://localhost:4201" -ForegroundColor Cyan
        Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
        Write-Host ""
        
        # Start the server directly with ng serve to avoid npm issues
        ng serve --port 4201
    } else {
        Write-Host "Error: package.json not found in project directory" -ForegroundColor Red
        Write-Host "Current directory contents:" -ForegroundColor Yellow
        Get-ChildItem
    }
} else {
    Write-Host "Error: Project directory not found: $projectPath" -ForegroundColor Red
}

Write-Host "Script completed." -ForegroundColor Green