[CmdletBinding()]
param(
  [int]$Port = 3030,
  [switch]$ForceRestart
)

$ErrorActionPreference = 'Stop'

$dashboardDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$outLog = Join-Path $dashboardDir 'dashboard.out.log'
$errLog = Join-Path $dashboardDir 'dashboard.err.log'

$listener = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue |
  Select-Object -First 1

if ($listener) {
  if (-not $ForceRestart) {
    Write-Output "Dashboard already listening on port $Port (PID $($listener.OwningProcess))."
    exit 0
  }

  Stop-Process -Id $listener.OwningProcess -Force
  Start-Sleep -Seconds 1
}

$node = (Get-Command node -ErrorAction Stop).Source

Start-Process `
  -FilePath $node `
  -ArgumentList 'server.js' `
  -WorkingDirectory $dashboardDir `
  -RedirectStandardOutput $outLog `
  -RedirectStandardError $errLog `
  -WindowStyle Hidden

Write-Output "Dashboard start requested on port $Port."
