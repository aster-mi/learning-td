# run-agent.ps1
# Usage: .\run-agent.ps1 -Agent <scout|ceo|planning|design|gm|librarian|maintainer> [-Runner <claude|codex>] [-ScheduledRun]
# Runs the specified learning-td agent via the selected CLI runner.

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("scout", "ceo", "planning", "design", "gm", "librarian", "maintainer")]
    [string]$Agent,

    [Parameter(Mandatory=$false)]
    [ValidateSet("claude", "codex")]
    [string]$Runner = "claude",

    [Parameter(Mandatory=$false)]
    [switch]$ScheduledRun
)

$ProjectDir = "D:\game\tower\learning-td"
$PromptsDir = "$ProjectDir\tools\agents\prompts"
$LogDir = "$ProjectDir\tools\agents\logs"
$PromptFile = "$PromptsDir\$Agent.md"
$RoleFile = "$ProjectDir\.ai\agents\$Agent.md"
$DiscordSessionReportScript = "$ProjectDir\tools\agents\send-discord-session-report.ps1"
$SharedEnvFile = "$ProjectDir\.claude\.env.local"

function Assert-CommandExists {
    param([string]$CommandName)

    if (-not (Get-Command $CommandName -ErrorAction SilentlyContinue)) {
        throw "Command not found on PATH: $CommandName"
    }
}

function Write-RunnerLog {
    param([string]$Message)

    $Line = "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] $Message"
    $Line | Tee-Object -FilePath $LogFile -Append | Out-Host
}

function Get-LastRunMarker {
    param(
        [string]$Path,
        [string]$Label
    )

    if (-not (Test-Path -LiteralPath $Path)) {
        return $null
    }

    $Pattern = "^\s*$([regex]::Escape($Label)):\s*(.+)$"
    $Lines = Get-Content -LiteralPath $Path -Encoding UTF8
    for ($Index = $Lines.Count - 1; $Index -ge 0; $Index--) {
        if ($Lines[$Index] -match $Pattern) {
            return $matches[1].Trim()
        }
    }

    return $null
}

function Ensure-RunMarkers {
    param(
        [string]$Path,
        [int]$ExitCode
    )

    $ExistingResult = Get-LastRunMarker -Path $Path -Label "RUN RESULT"
    $ExistingSummary = Get-LastRunMarker -Path $Path -Label "RUN SUMMARY"

    if (-not $ExistingResult) {
        $FallbackResult = if ($ExitCode -eq 0) { "success" } else { "failed" }
        Write-RunnerLog "RUN RESULT: $FallbackResult"
    }

    if (-not $ExistingSummary) {
        $FallbackSummary = if ($ExitCode -eq 0) {
            "Runner completed without explicit run summary"
        } else {
            "Runner exit code $ExitCode"
        }
        Write-RunnerLog "RUN SUMMARY: $FallbackSummary"
    }
}

function Import-EnvFile {
    param(
        [string]$Path,
        [scriptblock]$Logger
    )

    if (-not (Test-Path -LiteralPath $Path)) {
        return
    }

    foreach ($RawLine in Get-Content -LiteralPath $Path -Encoding UTF8) {
        $Line = $RawLine.Trim()

        if (-not $Line -or $Line.StartsWith("#")) {
            continue
        }

        $SeparatorIndex = $Line.IndexOf("=")
        if ($SeparatorIndex -lt 1) {
            continue
        }

        $Name = $Line.Substring(0, $SeparatorIndex).Trim()
        $Value = $Line.Substring($SeparatorIndex + 1).Trim()

        if (($Value.StartsWith('"') -and $Value.EndsWith('"')) -or ($Value.StartsWith("'") -and $Value.EndsWith("'"))) {
            $Value = $Value.Substring(1, $Value.Length - 2)
        }

        [Environment]::SetEnvironmentVariable($Name, $Value, "Process")
    }

    if ($Logger) {
        & $Logger "Loaded shared env file: $Path"
    }
}

function Get-CurrentBranch {
    $Branch = (& git branch --show-current 2>$null)
    if ($LASTEXITCODE -ne 0) {
        return $null
    }

    return $Branch.Trim()
}

function Get-GitStatusPorcelain {
    $Status = (& git status --porcelain 2>$null)
    if ($LASTEXITCODE -ne 0) {
        return @()
    }

    if ($null -eq $Status) {
        return @()
    }

    return @($Status)
}

function Sync-ScheduledChanges {
    param(
        [string]$AgentName
    )

    $Branch = Get-CurrentBranch
    if (-not $Branch) {
        Write-RunnerLog "Auto-push skipped: current branch could not be determined."
        return
    }

    $PostRunStatus = Get-GitStatusPorcelain
    if ($PostRunStatus.Count -gt 0) {
        Write-RunnerLog "Auto-commit: staging scheduled run changes."
        & git add -A 2>&1 | Tee-Object -FilePath $LogFile -Append | Out-Host
        if ($LASTEXITCODE -ne 0) {
            throw "git add failed during scheduled auto-push."
        }

        $CommitMessage = "chore: auto-save $AgentName scheduled run"
        & git commit -m $CommitMessage 2>&1 | Tee-Object -FilePath $LogFile -Append | Out-Host
        if ($LASTEXITCODE -ne 0) {
            throw "git commit failed during scheduled auto-push."
        }
    } else {
        Write-RunnerLog "Auto-commit skipped: no working tree changes after scheduled run."
    }

    & git fetch origin $Branch 2>&1 | Tee-Object -FilePath $LogFile -Append | Out-Host
    if ($LASTEXITCODE -ne 0) {
        throw "git fetch failed during scheduled auto-push."
    }

    $AheadCount = [int]((& git rev-list --count "origin/$Branch..HEAD" 2>$null).Trim())
    $BehindCount = [int]((& git rev-list --count "HEAD..origin/$Branch" 2>$null).Trim())

    if ($BehindCount -gt 0) {
        Write-RunnerLog "Auto-sync: rebasing scheduled branch onto origin/$Branch."
        & git pull --rebase origin $Branch 2>&1 | Tee-Object -FilePath $LogFile -Append | Out-Host
        if ($LASTEXITCODE -ne 0) {
            throw "git pull --rebase failed during scheduled auto-push."
        }

        $AheadCount = [int]((& git rev-list --count "origin/$Branch..HEAD" 2>$null).Trim())
    }

    if ($AheadCount -gt 0) {
        Write-RunnerLog "Auto-push: pushing $AheadCount commit(s) to origin/$Branch."
        & git push origin $Branch 2>&1 | Tee-Object -FilePath $LogFile -Append | Out-Host
        if ($LASTEXITCODE -ne 0) {
            throw "git push failed during scheduled auto-push."
        }
    } else {
        Write-RunnerLog "Auto-push skipped: branch is already in sync with origin/$Branch."
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

Write-RunnerLog "Starting agent: $Agent"
Write-RunnerLog "Runner: $Runner"
Write-RunnerLog "Scheduled run: $ScheduledRun"
Write-RunnerLog "Prompt: $PromptFile"
if (Test-Path $RoleFile) {
    Write-RunnerLog "Role: $RoleFile"
}
Write-RunnerLog "Mode: full-auto"
Import-EnvFile -Path $SharedEnvFile -Logger ${function:Write-RunnerLog}

Set-Location $ProjectDir

$AutoSyncArmed = $false
if ($ScheduledRun) {
    if (Get-Command git -ErrorAction SilentlyContinue) {
        $InitialGitStatus = Get-GitStatusPorcelain
        if ($InitialGitStatus.Count -eq 0) {
            $AutoSyncArmed = $true
            Write-RunnerLog "Auto-push armed: working tree clean at scheduled run start."
        } else {
            Write-RunnerLog "Auto-push skipped: working tree was already dirty before scheduled run."
        }
    } else {
        Write-RunnerLog "Auto-push skipped: git is not available on PATH."
    }
}

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

if ($Agent -eq "gm") {
    if (-not (Test-Path $DiscordSessionReportScript)) {
        Write-RunnerLog "Discord session report skipped: script not found: $DiscordSessionReportScript"
    } elseif ($exitCode -ne 0) {
        Write-RunnerLog "Discord session report skipped: GM exited with code $exitCode"
    } else {
        & powershell.exe `
            -NoProfile `
            -ExecutionPolicy Bypass `
            -File $DiscordSessionReportScript `
            -ProjectDir $ProjectDir 2>&1 | Tee-Object -FilePath $LogFile -Append | Out-Host
    }
}

if ($ScheduledRun -and $exitCode -eq 0 -and $AutoSyncArmed) {
    try {
        Sync-ScheduledChanges -AgentName $Agent
    } catch {
        $_ | Tee-Object -FilePath $LogFile -Append | Out-Host
        $exitCode = 1
    }
}

Ensure-RunMarkers -Path $LogFile -ExitCode $exitCode
Write-RunnerLog "Agent $Agent completed. Log: $LogFile"
exit $exitCode
