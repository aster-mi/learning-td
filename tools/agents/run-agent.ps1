# run-agent.ps1
# Usage: .\run-agent.ps1 -Agent <ceo|planning|design|gm>
# Runs the specified learning-td agent via Claude CLI.

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("ceo", "planning", "design", "gm")]
    [string]$Agent
)

$ProjectDir = "D:\game\tower\learning-td"
$PromptsDir = "$ProjectDir\tools\agents\prompts"
$LogDir = "$ProjectDir\tools\agents\logs"
$PromptFile = "$PromptsDir\$Agent.md"

# Ensure log directory exists
if (-not (Test-Path $LogDir)) {
    New-Item -ItemType Directory -Path $LogDir | Out-Null
}

$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$LogFile = "$LogDir\${Agent}_${Timestamp}.log"

if (-not (Test-Path $PromptFile)) {
    Write-Error "Prompt file not found: $PromptFile"
    exit 1
}

$Prompt = Get-Content $PromptFile -Raw

Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] Starting agent: $Agent"

Set-Location $ProjectDir

# Run claude in print mode (non-interactive)
claude -p $Prompt --dangerously-skip-permissions 2>&1 | Tee-Object -FilePath $LogFile

Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] Agent $Agent completed. Log: $LogFile"
