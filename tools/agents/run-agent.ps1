# run-agent.ps1
# Usage: .\run-agent.ps1 -Agent <scout|ceo|planning|design|gm|librarian|maintainer> [-Runner <claude|codex>]
# Runs the specified learning-td agent via the selected CLI runner.

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("scout", "ceo", "planning", "design", "gm", "librarian", "maintainer")]
    [string]$Agent,

    [Parameter(Mandatory=$false)]
    [ValidateSet("claude", "codex")]
    [string]$Runner = "claude"
)

$ProjectDir = "D:\game\tower\learning-td"
$PromptsDir = "$ProjectDir\tools\agents\prompts"
$LogDir = "$ProjectDir\tools\agents\logs"
$PromptFile = "$PromptsDir\$Agent.md"
$RoleFile = "$ProjectDir\.ai\agents\$Agent.md"

function Assert-CommandExists {
    param([string]$CommandName)

    if (-not (Get-Command $CommandName -ErrorAction SilentlyContinue)) {
        throw "Command not found on PATH: $CommandName"
    }
}

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

$Prompt = Get-Content $PromptFile -Raw -Encoding utf8

Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] Starting agent: $Agent"
Write-Host "Runner: $Runner"
Write-Host "Prompt: $PromptFile"
if (Test-Path $RoleFile) {
    Write-Host "Role: $RoleFile"
}
Write-Host "Mode: full-auto"

Set-Location $ProjectDir

$exitCode = 0

try {
    switch ($Runner) {
        "claude" {
            Assert-CommandExists -CommandName "claude"
            & claude -p $Prompt --dangerously-skip-permissions 2>&1 | Tee-Object -FilePath $LogFile
            $exitCode = $LASTEXITCODE
        }
        "codex" {
            Assert-CommandExists -CommandName "codex"
            & codex exec -C $ProjectDir --full-auto $Prompt 2>&1 | Tee-Object -FilePath $LogFile
            $exitCode = $LASTEXITCODE
        }
    }
} catch {
    $_ | Tee-Object -FilePath $LogFile -Append | Out-Host
    $exitCode = 1
}

Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] Agent $Agent completed. Log: $LogFile"
exit $exitCode
