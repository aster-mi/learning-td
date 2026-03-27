[CmdletBinding()]
param(
    [string]$ProjectDir = "D:\game\tower\learning-td",
    [string]$ThreadId = $env:DISCORD_SESSION_REPORT_THREAD_ID,
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"

if ([string]::IsNullOrWhiteSpace($ThreadId)) {
    $ThreadId = "1487013724807106700"
}

function Write-ReportLog {
    param([string]$Message)

    Write-Output "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] $Message"
}

function Import-EnvFile {
    param([string]$Path)

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
}

Import-EnvFile -Path (Join-Path $ProjectDir ".claude\.env.local")

function Get-LatestHandoffEntry {
    param([string]$HandoffPath)

    if (-not (Test-Path $HandoffPath)) {
        throw "Handoff file not found: $HandoffPath"
    }

    $Content = Get-Content -LiteralPath $HandoffPath -Raw -Encoding UTF8
    $Match = [regex]::Match(
        $Content,
        '(?ms)^## \[(?<timestamp>[^\]]+)\] Agent: (?<agent>[^\r\n]+)\r?\n(?<body>.*?)(?=^---\s*$)'
    )

    if (-not $Match.Success) {
        throw "Latest handoff entry could not be parsed: $HandoffPath"
    }

    return [pscustomobject]@{
        Timestamp = $Match.Groups["timestamp"].Value.Trim()
        Agent = $Match.Groups["agent"].Value.Trim()
        Body = $Match.Groups["body"].Value.Trim()
    }
}

function Get-SectionLines {
    param(
        [string]$Body,
        [string]$SectionName
    )

    $Lines = $Body -split "\r?\n"
    $Collect = $false
    $Results = @()

    $SectionPattern = "^{0}:$" -f [regex]::Escape($SectionName)

    foreach ($Line in $Lines) {
        if ($Line -match $SectionPattern) {
            $Collect = $true
            continue
        }

        if ($Collect -and $Line -match '^[A-Za-z][A-Za-z ]+:$') {
            break
        }

        if ($Collect) {
            $Trimmed = $Line.Trim()
            if ($Trimmed) {
                $Results += $Trimmed
            }
        }
    }

    return ,$Results
}

function Select-Bullets {
    param(
        [string[]]$Lines,
        [int]$MaxCount
    )

    $Results = @()
    foreach ($Line in $Lines) {
        $Normalized = ($Line -replace '^\s*-\s*', '').Trim()
        if (-not $Normalized) {
            continue
        }

        $Results += $Normalized
        if ($Results.Count -ge $MaxCount) {
            break
        }
    }

    return ,$Results
}

function Add-BulletSection {
    param(
        [System.Collections.Generic.List[string]]$Target,
        [string]$Title,
        [string[]]$Bullets
    )

    if (-not $Bullets -or $Bullets.Count -eq 0) {
        return
    }

    $Target.Add($Title)
    foreach ($Bullet in $Bullets) {
        $Target.Add("- $Bullet")
    }
}

$HandoffPath = Join-Path $ProjectDir ".ai\AGENT_HANDOFF.md"
$Entry = Get-LatestHandoffEntry -HandoffPath $HandoffPath

$Summary = Select-Bullets -Lines (Get-SectionLines -Body $Entry.Body -SectionName "Summary") -MaxCount 2
$Validation = Select-Bullets -Lines (Get-SectionLines -Body $Entry.Body -SectionName "Validation") -MaxCount 2
$NextStep = Select-Bullets -Lines (Get-SectionLines -Body $Entry.Body -SectionName "Next Step") -MaxCount 1
$OpenQuestions = Select-Bullets -Lines (Get-SectionLines -Body $Entry.Body -SectionName "Open Questions") -MaxCount 1

$MessageLines = New-Object 'System.Collections.Generic.List[string]'
$MessageLines.Add("[$($Entry.Timestamp)] GM Session Report")
Add-BulletSection -Target $MessageLines -Title "Summary:" -Bullets $Summary
Add-BulletSection -Target $MessageLines -Title "Validation:" -Bullets $Validation

if ($NextStep.Count -gt 0) {
    Add-BulletSection -Target $MessageLines -Title "Next Step:" -Bullets $NextStep
} elseif ($OpenQuestions.Count -gt 0) {
    Add-BulletSection -Target $MessageLines -Title "Open Questions:" -Bullets $OpenQuestions
}

$Content = ($MessageLines -join "`n").Trim()
if ($Content.Length -gt 1900) {
    $Content = $Content.Substring(0, 1896) + "..."
}

if ($DryRun) {
    Write-ReportLog "Discord session report dry run:"
    Write-Output $Content
    exit 0
}

$Token = $env:DISCORD_BOT_TOKEN
if ([string]::IsNullOrWhiteSpace($Token)) {
    Write-ReportLog "Discord session report skipped: DISCORD_BOT_TOKEN is not set."
    exit 0
}

$Payload = @{ content = $Content } | ConvertTo-Json -Depth 4 -Compress
$Headers = @{
    Authorization = "Bot $Token"
    "Content-Type" = "application/json"
    "User-Agent" = "learning-td-gm-session-report"
}

try {
    Invoke-RestMethod `
        -Method Post `
        -Uri "https://discord.com/api/v10/channels/$ThreadId/messages" `
        -Headers $Headers `
        -Body $Payload | Out-Null
} catch {
    $Response = $_.Exception.Response
    if ($Response -and $Response.StatusCode -eq 401) {
        Write-ReportLog "Discord session report failed: token was rejected by Discord (401 Unauthorized)."
        exit 1
    }

    throw
}

Write-ReportLog "Discord session report posted to thread $ThreadId."
exit 0
