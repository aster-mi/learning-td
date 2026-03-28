# setup-task-scheduler.ps1
# Prepare or register learning-td agent tasks in Windows Task Scheduler.
# Default behavior is a dry run so tasks are never created accidentally.
# Usage:
#   .\setup-task-scheduler.ps1
#   .\setup-task-scheduler.ps1 -Register
#   .\setup-task-scheduler.ps1 -Register -Enable
#   .\setup-task-scheduler.ps1 -Remove

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("claude", "codex")]
    [string]$Runner = "claude",

    [Parameter(Mandatory=$false)]
    [switch]$Register,

    [Parameter(Mandatory=$false)]
    [switch]$Enable,

    [Parameter(Mandatory=$false)]
    [switch]$Remove
)

$ProjectDir = "D:\game\tower\learning-td"
$RunAgent = "$ProjectDir\tools\agents\run-agent.ps1"

if (-not (Test-Path $RunAgent)) {
    throw "Runner script not found: $RunAgent"
}

$TaskDefinitions = @(
    [pscustomobject]@{ Name = "learning-td-scout";      Agent = "scout";      Runner = "claude"; Start = "00:30"; RepeatHours = 12; Purpose = "discovery / backlog refill" },
    [pscustomobject]@{ Name = "learning-td-ceo";        Agent = "ceo";        Runner = "claude"; Start = "07:00"; RepeatHours = 12; Purpose = "priority / strategy" },
    [pscustomobject]@{ Name = "learning-td-planning";   Agent = "planning";   Runner = "claude"; Start = "08:30"; RepeatHours = 4;  Purpose = "research / readying" },
    [pscustomobject]@{ Name = "learning-td-design";     Agent = "design";     Runner = "claude"; Start = "09:30"; RepeatHours = 4;  Purpose = "ui / ux design" },
    [pscustomobject]@{ Name = "learning-td-gm";         Agent = "gm";         Runner = "claude"; Start = "10:00"; RepeatHours = 3;  Purpose = "claude gm -> codex build/review" },
    [pscustomobject]@{ Name = "learning-td-librarian";  Agent = "librarian";  Runner = "claude"; Start = "22:30"; RepeatHours = 24; Purpose = "docs / skills upkeep" },
    [pscustomobject]@{ Name = "learning-td-maintainer"; Agent = "maintainer"; Runner = "codex";  Start = "03:15"; RepeatHours = 24; Purpose = "runner / scheduler upkeep" }
)

function Remove-AgentTasks {
    $ExistingTasks = Get-ScheduledTask | Where-Object { $_.TaskName -like "learning-td-*" }

    if (-not $ExistingTasks) {
        Write-Host "No learning-td tasks found."
        return
    }

    foreach ($Task in $ExistingTasks) {
        Unregister-ScheduledTask -TaskName $Task.TaskName -Confirm:$false
        Write-Host "Removed: $($Task.TaskName)"
    }
}

function Register-Agent {
    param($Definition)

    $Name = $Definition.Name
    $Agent = $Definition.Agent
    $Start = $Definition.Start
    $RepeatHours = $Definition.RepeatHours

    $Existing = Get-ScheduledTask -TaskName $Name -ErrorAction SilentlyContinue
    if ($Existing) {
        Unregister-ScheduledTask -TaskName $Name -Confirm:$false
        Write-Host "Removed existing: $Name"
    }

    $AgentRunner = if ($Definition.Runner) { $Definition.Runner } else { $Runner }

    $Action = New-ScheduledTaskAction `
        -Execute "powershell.exe" `
        -Argument "-NonInteractive -NoProfile -ExecutionPolicy Bypass -File `"$RunAgent`" -Agent $Agent -Runner $AgentRunner -ScheduledRun" `
        -WorkingDirectory $ProjectDir

    $Trigger = New-ScheduledTaskTrigger `
        -Once `
        -At $Start `
        -RepetitionInterval (New-TimeSpan -Hours $RepeatHours) `
        -RepetitionDuration (New-TimeSpan -Days 1)

    $Settings = New-ScheduledTaskSettingsSet `
        -ExecutionTimeLimit (New-TimeSpan -Minutes 45) `
        -MultipleInstances IgnoreNew `
        -StartWhenAvailable

    Register-ScheduledTask `
        -TaskName $Name `
        -Action $Action `
        -Trigger $Trigger `
        -Settings $Settings `
        -RunLevel Limited `
        -Force | Out-Null

    if ($Enable) {
        Enable-ScheduledTask -TaskName $Name | Out-Null
        Write-Host "Registered and enabled: $Name"
    } else {
        Disable-ScheduledTask -TaskName $Name | Out-Null
        Write-Host "Registered but disabled: $Name"
    }
}

if ($Remove) {
    Remove-AgentTasks
    exit 0
}

Write-Host ""
Write-Host "Prepared scheduler definitions"
Write-Host "Runner: $Runner"
Write-Host ""
$TaskDefinitions |
    Select-Object Name, Agent, Start, RepeatHours, Purpose |
    Format-Table -AutoSize

if (-not $Register) {
    Write-Host ""
    Write-Host "Dry run only. No tasks were registered."
    Write-Host "Use -Register to create disabled tasks."
    Write-Host "Use -Register -Enable to create and enable tasks immediately."
    exit 0
}

Write-Host ""
Write-Host "Registering tasks..."

foreach ($Definition in $TaskDefinitions) {
    Register-Agent -Definition $Definition
}

Write-Host ""
Write-Host "Current task states:"
Get-ScheduledTask |
    Where-Object { $_.TaskName -like "learning-td-*" } |
    Select-Object TaskName, State |
    Format-Table -AutoSize
