# setup-task-scheduler.ps1
# Register learning-td agents in Windows Task Scheduler.
# Run as Administrator.
# Usage: .\setup-task-scheduler.ps1

$ProjectDir = "D:\game\tower\learning-td"
$RunAgent = "$ProjectDir\tools\agents\run-agent.ps1"

function Register-Agent {
    param($Name, $Agent, $TriggerType, $Time, $RepeatHours)

    $Existing = Get-ScheduledTask -TaskName $Name -ErrorAction SilentlyContinue
    if ($Existing) {
        Unregister-ScheduledTask -TaskName $Name -Confirm:$false
        Write-Host "Removed existing: $Name"
    }

    $Action = New-ScheduledTaskAction `
        -Execute "powershell.exe" `
        -Argument "-NonInteractive -NoProfile -ExecutionPolicy Bypass -File `"$RunAgent`" -Agent $Agent" `
        -WorkingDirectory $ProjectDir

    if ($TriggerType -eq "Daily") {
        $Trigger = New-ScheduledTaskTrigger -Daily -At $Time
    } else {
        # Repeat every N hours starting from midnight
        $Trigger = New-ScheduledTaskTrigger -RepetitionInterval (New-TimeSpan -Hours $RepeatHours) `
            -Once -At "00:00" -RepetitionDuration (New-TimeSpan -Days 1)
    }

    $Settings = New-ScheduledTaskSettingsSet `
        -ExecutionTimeLimit (New-TimeSpan -Minutes 30) `
        -MultipleInstances IgnoreNew `
        -StartWhenAvailable

    Register-ScheduledTask `
        -TaskName $Name `
        -Action $Action `
        -Trigger $Trigger `
        -Settings $Settings `
        -RunLevel Limited `
        -Force | Out-Null

    Write-Host "Registered: $Name"
}

Register-Agent -Name "learning-td-ceo"      -Agent "ceo"      -TriggerType "Daily"  -Time "07:00"
Register-Agent -Name "learning-td-planning" -Agent "planning" -TriggerType "Daily"  -Time "08:30"
Register-Agent -Name "learning-td-design"   -Agent "design"   -TriggerType "Daily"  -Time "09:30"
Register-Agent -Name "learning-td-gm"       -Agent "gm"       -TriggerType "Repeat" -RepeatHours 5

Write-Host ""
Write-Host "Registered tasks:"
Get-ScheduledTask | Where-Object { $_.TaskName -like "learning-td-*" } | Select-Object TaskName, State | Format-Table -AutoSize
