# process-pr-review.ps1
# Validate, summarize, merge a PR, then sync Issue / Discussion / Project state.

param(
    [Parameter(Mandatory = $true)]
    [int]$PrNumber,

    [string]$Repository = "aster-mi/learning-td",

    [string]$ProjectOwner = "aster-mi",

    [int]$ProjectNumber = 2,

    [ValidateSet("merge", "squash", "rebase")]
    [string]$MergeMethod = "merge",

    [string[]]$ValidationScripts,

    [switch]$DryRun,

    [switch]$SkipProjectUpdate
)

$ErrorActionPreference = "Stop"
if (Get-Variable -Name PSNativeCommandUseErrorActionPreference -ErrorAction SilentlyContinue) {
    $PSNativeCommandUseErrorActionPreference = $false
}

$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..\..")).Path
$LogsDir = Join-Path $RepoRoot "tools\github\logs"
$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$LogFile = Join-Path $LogsDir "pr-review-$PrNumber-$Timestamp.log"

if (-not (Test-Path $LogsDir)) {
    New-Item -ItemType Directory -Path $LogsDir | Out-Null
}

function Write-Section {
    param([string]$Message)
    $line = "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] $Message"
    Write-Host $line
    Add-Content -Path $LogFile -Value $line
}

function Write-LogLines {
    param([string[]]$Lines)
    foreach ($Line in $Lines) {
        Write-Host $Line
        Add-Content -Path $LogFile -Value $Line
    }
}

function Quote-Argument {
    param([string]$Value)

    if ($null -eq $Value) {
        return '""'
    }

    if ($Value -notmatch '[\s"]') {
        return $Value
    }

    return '"' + ($Value -replace '"', '\"') + '"'
}

function Invoke-External {
    param(
        [Parameter(Mandatory = $true)]
        [string]$FilePath,

        [string[]]$Arguments = @(),

        [string]$WorkingDirectory = $RepoRoot,

        [switch]$AllowFailure,

        [switch]$RedactOutput
    )

    $commandLine = "$FilePath $($Arguments -join ' ')".Trim()
    Write-Section "RUN $commandLine"

    $StartInfo = New-Object System.Diagnostics.ProcessStartInfo
    $StartInfo.FileName = $FilePath
    $StartInfo.WorkingDirectory = $WorkingDirectory
    $StartInfo.UseShellExecute = $false
    $StartInfo.RedirectStandardOutput = $true
    $StartInfo.RedirectStandardError = $true
    $StartInfo.CreateNoWindow = $true
    $StartInfo.Arguments = (($Arguments | ForEach-Object { Quote-Argument $_ }) -join " ")

    $Process = New-Object System.Diagnostics.Process
    $Process.StartInfo = $StartInfo
    [void]$Process.Start()
    $StdOut = $Process.StandardOutput.ReadToEnd()
    $StdErr = $Process.StandardError.ReadToEnd()
    $Process.WaitForExit()
    $ExitCode = $Process.ExitCode

    $Lines = @()
    if ($StdOut) {
        $Lines += @($StdOut -split "`r?`n")
    }
    if ($StdErr) {
        $Lines += @($StdErr -split "`r?`n")
    }
    $Lines = @($Lines | Where-Object { $_ -ne "" })

    if (-not $RedactOutput -and $Lines.Count -gt 0) {
        Write-LogLines -Lines $Lines
    }

    if ($ExitCode -ne 0 -and -not $AllowFailure) {
        throw "Command failed ($ExitCode): $commandLine"
    }

    return [pscustomobject]@{
        ExitCode = $ExitCode
        Output   = $Lines
    }
}

function Invoke-GitHubGraphQl {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Query,

        [hashtable]$Variables = @{}
    )

    if (-not $script:GitHubToken) {
        $TokenResult = Invoke-External -FilePath "gh" -Arguments @("auth", "token") -RedactOutput
        $script:GitHubToken = ($TokenResult.Output -join "`n").Trim()
    }

    $Headers = @{
        Authorization = "Bearer $script:GitHubToken"
        "Content-Type" = "application/json"
        "User-Agent" = "codex"
    }

    $Body = @{
        query = $Query
    }

    if ($Variables.Count -gt 0) {
        $Body.variables = $Variables
    }

    $Response = Invoke-RestMethod `
        -Method Post `
        -Uri "https://api.github.com/graphql" `
        -Headers $Headers `
        -Body ($Body | ConvertTo-Json -Depth 50)

    if ($Response.errors) {
        $ErrorMessage = ($Response.errors | ConvertTo-Json -Depth 20)
        throw "GraphQL error: $ErrorMessage"
    }

    return $Response.data
}

function Get-GitHubScopes {
    if ($script:GrantedScopes) {
        return $script:GrantedScopes
    }

    if (-not $script:GitHubToken) {
        $TokenResult = Invoke-External -FilePath "gh" -Arguments @("auth", "token") -RedactOutput
        $script:GitHubToken = ($TokenResult.Output -join "`n").Trim()
    }

    $Headers = @{
        Authorization = "Bearer $script:GitHubToken"
        "User-Agent" = "codex"
    }

    $Response = Invoke-WebRequest `
        -Uri "https://api.github.com/rate_limit" `
        -Headers $Headers `
        -UseBasicParsing

    $RawScopes = $Response.Headers["X-OAuth-Scopes"]
    if (-not $RawScopes) {
        $script:GrantedScopes = @()
        return $script:GrantedScopes
    }

    $script:GrantedScopes = @(
        $RawScopes.Split(",") |
            ForEach-Object { $_.Trim() } |
            Where-Object { $_ }
    )

    return $script:GrantedScopes
}

function Test-GitHubScope {
    param([string]$Scope)
    return (Get-GitHubScopes) -contains $Scope
}

function Get-JsonFromGh {
    param(
        [Parameter(Mandatory = $true)]
        [string[]]$Arguments
    )

    $Result = Invoke-External -FilePath "gh" -Arguments $Arguments
    return (($Result.Output -join "`n") | ConvertFrom-Json)
}

function Resolve-ValidationScripts {
    param([string[]]$RequestedScripts)

    if ($RequestedScripts -and $RequestedScripts.Count -gt 0) {
        return $RequestedScripts
    }

    $PackageJsonPath = Join-Path $RepoRoot "package.json"
    if (-not (Test-Path $PackageJsonPath)) {
        return @()
    }

    $PackageJson = Get-Content -Path $PackageJsonPath -Raw -Encoding UTF8 | ConvertFrom-Json
    $Scripts = @()

    foreach ($Name in @("quiz:validate", "build", "test")) {
        if ($PackageJson.scripts.PSObject.Properties.Name -contains $Name) {
            $Scripts += $Name
        }
    }

    return $Scripts
}

function Resolve-IssueNumbers {
    param(
        [string]$Text,
        [string]$HeadRefName
    )

    $Matches = New-Object System.Collections.Generic.List[int]
    $Patterns = @(
        "(?im)\b(?:ref|refs|fix|fixes|close|closes|resolve|resolves)\s*#(\d+)",
        "(?im)\bissue\s*[:：]?\s*#(\d+)",
        "(?im)関連(?:\s*issue)?\s*[:：]?\s*#(\d+)",
        "(?im)チケット\s*[:：]?\s*#(\d+)"
    )

    if ($Text) {
        foreach ($Pattern in $Patterns) {
            foreach ($Match in [regex]::Matches($Text, $Pattern)) {
                $Matches.Add([int]$Match.Groups[1].Value)
            }
        }
    }

    if ($Matches.Count -eq 0 -and $HeadRefName) {
        foreach ($Match in [regex]::Matches($HeadRefName, "issue-(\d+)")) {
            $Matches.Add([int]$Match.Groups[1].Value)
        }
    }

    return @($Matches | Sort-Object -Unique)
}

function Resolve-DiscussionNumbers {
    param([string[]]$Texts)

    $Matches = New-Object System.Collections.Generic.List[int]
    foreach ($Text in $Texts) {
        if (-not $Text) {
            continue
        }

        foreach ($Match in [regex]::Matches($Text, "github\.com\/[^\/]+\/[^\/]+\/discussions\/(\d+)")) {
            $Matches.Add([int]$Match.Groups[1].Value)
        }
    }

    return @($Matches | Sort-Object -Unique)
}

function New-ReviewWorktree {
    param(
        [int]$PullRequestNumber,
        [string]$BaseRefName
    )

    $WorktreePath = Join-Path $env:TEMP "learning-td-pr-$PullRequestNumber-$Timestamp"

    Invoke-External -FilePath "git" -Arguments @("-C", $RepoRoot, "fetch", "origin") | Out-Null
    Invoke-External -FilePath "git" -Arguments @("-C", $RepoRoot, "worktree", "add", "--detach", $WorktreePath, "origin/$BaseRefName") | Out-Null

    try {
        $SafePath = $WorktreePath -replace "\\", "/"
        Invoke-External -FilePath "git" -Arguments @("config", "--global", "--add", "safe.directory", $SafePath) -AllowFailure | Out-Null
    }
    catch {
        Write-Section "WARN failed to add safe.directory for $WorktreePath"
    }

    Invoke-External -FilePath "git" -Arguments @("-C", $WorktreePath, "fetch", "origin", "pull/$PullRequestNumber/head") | Out-Null
    Invoke-External -FilePath "git" -Arguments @("-C", $WorktreePath, "checkout", "--detach", "FETCH_HEAD") | Out-Null

    return $WorktreePath
}

function Remove-ReviewWorktree {
    param([string]$WorktreePath)

    if (-not $WorktreePath -or -not (Test-Path $WorktreePath)) {
        return
    }

    try {
        Invoke-External -FilePath "git" -Arguments @("-C", $RepoRoot, "worktree", "remove", "--force", $WorktreePath) -AllowFailure | Out-Null
    }
    catch {
        Write-Section "WARN failed to remove worktree $WorktreePath"
    }
}

function Ensure-Dependencies {
    param([string]$WorktreePath)

    $WorktreeNodeModules = Join-Path $WorktreePath "node_modules"

    if (Test-Path $WorktreeNodeModules) {
        return
    }

    if (Test-Path (Join-Path $WorktreePath "package-lock.json")) {
        Write-Section "Installing dependencies in isolated worktree"
        Invoke-External -FilePath "cmd.exe" -Arguments @("/c", "npm ci --no-audit --no-fund") -WorkingDirectory $WorktreePath
        return
    }

    if (Test-Path (Join-Path $WorktreePath "package.json")) {
        Write-Section "Installing dependencies in isolated worktree"
        Invoke-External -FilePath "cmd.exe" -Arguments @("/c", "npm install") -WorkingDirectory $WorktreePath
    }
}

function Invoke-ValidationSuite {
    param(
        [string]$WorktreePath,
        [string[]]$Scripts
    )

    $Results = @()

    foreach ($ScriptName in $Scripts) {
        $Result = Invoke-External `
            -FilePath "cmd.exe" `
            -Arguments @("/c", "npm run $ScriptName") `
            -WorkingDirectory $WorktreePath `
            -AllowFailure

        $Results += [pscustomobject]@{
            Name     = $ScriptName
            ExitCode = $Result.ExitCode
            Output   = $Result.Output
            Passed   = ($Result.ExitCode -eq 0)
        }

        if ($Result.ExitCode -ne 0) {
            break
        }
    }

    return $Results
}

function Get-ProjectSnapshot {
    param(
        [string]$Owner,
        [int]$Number
    )

    $Query = @'
query($owner: String!, $number: Int!) {
  user(login: $owner) {
    projectV2(number: $number) {
      id
      title
      fields(first: 50) {
        nodes {
          __typename
          ... on ProjectV2FieldCommon {
            id
            name
          }
          ... on ProjectV2SingleSelectField {
            options {
              id
              name
            }
          }
        }
      }
      items(first: 100) {
        nodes {
          id
          fieldValues(first: 20) {
            nodes {
              __typename
              ... on ProjectV2ItemFieldSingleSelectValue {
                name
                optionId
                field {
                  ... on ProjectV2FieldCommon {
                    name
                  }
                }
              }
            }
          }
          content {
            __typename
            ... on Issue {
              number
              state
            }
            ... on PullRequest {
              number
              state
            }
          }
        }
      }
    }
  }
}
'@

    return (Invoke-GitHubGraphQl -Query $Query -Variables @{
        owner = $Owner
        number = $Number
    }).user.projectV2
}

function Get-ProjectStatusOptionId {
    param(
        [object]$Project,
        [string]$StatusName
    )

    $StatusField = $Project.fields.nodes | Where-Object { $_.name -eq "Status" } | Select-Object -First 1
    if (-not $StatusField) {
        throw "Project Status field not found."
    }

    $Option = $StatusField.options | Where-Object { $_.name -eq $StatusName } | Select-Object -First 1
    if (-not $Option) {
        throw "Project status option '$StatusName' not found."
    }

    return [pscustomobject]@{
        FieldId  = $StatusField.id
        OptionId = $Option.id
    }
}

function Find-ProjectItemId {
    param(
        [object]$Project,
        [string]$ContentType,
        [int]$Number
    )

    $Item = $Project.items.nodes | Where-Object {
        $_.content.__typename -eq $ContentType -and $_.content.number -eq $Number
    } | Select-Object -First 1

    return $Item.id
}

function Set-ProjectStatusIfPossible {
    param(
        [object]$Project,
        [string]$ContentType,
        [int]$ContentNumber,
        [string]$StatusName
    )

    if ($SkipProjectUpdate -or -not (Test-GitHubScope -Scope "project")) {
        Write-Section "WARN skipping project status update for $ContentType #$ContentNumber because token lacks 'project' scope"
        return
    }

    $ItemId = Find-ProjectItemId -Project $Project -ContentType $ContentType -Number $ContentNumber
    if (-not $ItemId) {
        Write-Section "WARN project item not found for $ContentType #$ContentNumber"
        return
    }

    $Status = Get-ProjectStatusOptionId -Project $Project -StatusName $StatusName

    $Mutation = @'
mutation($projectId: ID!, $itemId: ID!, $fieldId: ID!, $optionId: String!) {
  updateProjectV2ItemFieldValue(input: {
    projectId: $projectId,
    itemId: $itemId,
    fieldId: $fieldId,
    value: { singleSelectOptionId: $optionId }
  }) {
    projectV2Item {
      id
    }
  }
}
'@

    Invoke-GitHubGraphQl -Query $Mutation -Variables @{
        projectId = $Project.id
        itemId = $ItemId
        fieldId = $Status.FieldId
        optionId = $Status.OptionId
    } | Out-Null

    Write-Section "Updated project status for $ContentType #$ContentNumber -> $StatusName"
}

function Get-DiscussionId {
    param(
        [string]$Owner,
        [string]$Name,
        [int]$DiscussionNumber
    )

    $Query = @'
query($owner: String!, $name: String!, $number: Int!) {
  repository(owner: $owner, name: $name) {
    discussion(number: $number) {
      id
    }
  }
}
'@

    return (Invoke-GitHubGraphQl -Query $Query -Variables @{
        owner = $Owner
        name = $Name
        number = $DiscussionNumber
    }).repository.discussion.id
}

function Add-DiscussionComment {
    param(
        [string]$Owner,
        [string]$Name,
        [int]$DiscussionNumber,
        [string]$Body
    )

    $DiscussionId = Get-DiscussionId -Owner $Owner -Name $Name -DiscussionNumber $DiscussionNumber
    if (-not $DiscussionId) {
        Write-Section "WARN discussion #$DiscussionNumber not found"
        return
    }

    $Mutation = @'
mutation($discussionId: ID!, $body: String!) {
  addDiscussionComment(input: {
    discussionId: $discussionId,
    body: $body
  }) {
    comment {
      id
    }
  }
}
'@

    Invoke-GitHubGraphQl -Query $Mutation -Variables @{
        discussionId = $DiscussionId
        body = $Body
    } | Out-Null
}

function Format-ValidationLines {
    param([object[]]$Results)

    $Lines = @()
    foreach ($Result in $Results) {
        $Marker = if ($Result.Passed) { "成功" } else { "失敗" }
        $Lines += ('- [{0}] `npm run {1}`' -f $Marker, $Result.Name)
    }

    return $Lines
}

function Get-FailureExcerpt {
    param([object[]]$Results)

    $Failed = $Results | Where-Object { -not $_.Passed } | Select-Object -First 1
    if (-not $Failed) {
        return @()
    }

    $Tail = @($Failed.Output | Select-Object -Last 20)
    if ($Tail.Count -eq 0) {
        return @()
    }

    return @(
        "",
        '```text'
    ) + $Tail + @(
        '```'
    )
}

function Get-RepoParts {
    param([string]$Repo)
    $Parts = $Repo.Split("/")
    if ($Parts.Count -ne 2) {
        throw "Repository must be in owner/name form: $Repo"
    }

    return [pscustomobject]@{
        Owner = $Parts[0]
        Name  = $Parts[1]
    }
}

$RepoParts = Get-RepoParts -Repo $Repository
$ValidationScripts = Resolve-ValidationScripts -RequestedScripts $ValidationScripts

Write-Section "Start PR review automation for #$PrNumber"
Write-Section "Repository: $Repository"
Write-Section "Validation scripts: $($ValidationScripts -join ', ')"

$CurrentUser = Get-JsonFromGh -Arguments @("api", "user")
$Pr = Get-JsonFromGh -Arguments @(
    "pr", "view", "$PrNumber",
    "--repo", $Repository,
    "--json", "number,title,url,state,isDraft,mergeStateStatus,reviewDecision,headRefName,baseRefName,body,author"
)

if ($Pr.state -ne "OPEN") {
    throw "PR #$PrNumber is not open."
}

if ($Pr.isDraft) {
    throw "PR #$PrNumber is draft."
}

if ($Pr.mergeStateStatus -notin @("CLEAN", "HAS_HOOKS", "UNSTABLE")) {
    throw "PR #$PrNumber is not mergeable enough for automation. mergeStateStatus=$($Pr.mergeStateStatus)"
}

$IssueNumbers = Resolve-IssueNumbers -Text $Pr.body -HeadRefName $Pr.headRefName
$Issues = @()
foreach ($IssueNumber in $IssueNumbers) {
    $Issues += Get-JsonFromGh -Arguments @(
        "issue", "view", "$IssueNumber",
        "--repo", $Repository,
        "--json", "number,title,state,body,url"
    )
}

$DiscussionNumbers = Resolve-DiscussionNumbers -Texts @($Pr.body) + @($Issues | ForEach-Object { $_.body })

$Project = $null
if (-not $SkipProjectUpdate -and (Test-GitHubScope -Scope "read:project")) {
    $Project = Get-ProjectSnapshot -Owner $ProjectOwner -Number $ProjectNumber
}

$WorktreePath = $null
$ValidationResults = @()

try {
    $WorktreePath = New-ReviewWorktree -PullRequestNumber $PrNumber -BaseRefName $Pr.baseRefName
    Ensure-Dependencies -WorktreePath $WorktreePath
    $ValidationResults = Invoke-ValidationSuite -WorktreePath $WorktreePath -Scripts $ValidationScripts
}
finally {
    Remove-ReviewWorktree -WorktreePath $WorktreePath
}

$ValidationLines = Format-ValidationLines -Results $ValidationResults
$AllPassed = -not ($ValidationResults | Where-Object { -not $_.Passed })
$LinkedIssueText = if ($IssueNumbers.Count -gt 0) {
    ($IssueNumbers | ForEach-Object { "#$_" }) -join ", "
} else {
    "なし"
}

if (-not $AllPassed) {
    $PrFailureBody = @(
        "自動レビューを停止しました。検証で失敗が発生しています。",
        "",
        "## 検証結果"
    ) + $ValidationLines + (Get-FailureExcerpt -Results $ValidationResults)

    $IssueFailureBody = @(
        "PR #$PrNumber の自動レビューを停止しました。",
        "",
        "検証サマリ:"
    ) + $ValidationLines

    if ($DryRun) {
        Write-Section "DRY RUN: PR / Issue に失敗コメントを残し、PR は open のままにします"
        Write-LogLines -Lines $PrFailureBody
        exit 2
    }

    Invoke-External -FilePath "gh" -Arguments @(
        "pr", "comment", "$PrNumber",
        "--repo", $Repository,
        "--body", ($PrFailureBody -join "`n")
    ) | Out-Null

    foreach ($Issue in $Issues) {
        Invoke-External -FilePath "gh" -Arguments @(
            "issue", "comment", "$($Issue.number)",
            "--repo", $Repository,
            "--body", ($IssueFailureBody -join "`n")
        ) | Out-Null
    }

    foreach ($DiscussionNumber in $DiscussionNumbers) {
        Add-DiscussionComment `
            -Owner $RepoParts.Owner `
            -Name $RepoParts.Name `
            -DiscussionNumber $DiscussionNumber `
            -Body ($IssueFailureBody -join "`n")
    }

    Write-Section "検証に失敗したため PR #$PrNumber は open のままです"
    exit 2
}

$ReviewSummary = @(
    "自動 PR レビューが完了しました。",
    "",
    "## 検証結果"
) + $ValidationLines

$IssueSummary = @(
    "自動 PR レビューによりタスクを完了しました。",
    "",
    "- PR: $($Pr.url)",
    "- マージ方法: $MergeMethod",
    "",
    "検証サマリ:"
) + $ValidationLines

$DiscussionSummary = @(
    "このスレッドはマージ完了により解消しました。",
    "",
    "- マージ済み PR: $($Pr.url)",
    "- 関連 Issue: $LinkedIssueText",
    "",
    "検証サマリ:"
) + $ValidationLines

if ($DryRun) {
    Write-Section "DRY RUN: PR コメント、merge、Issue / Discussion / Project 同期を行います"
    Write-LogLines -Lines $ReviewSummary
    exit 0
}

$CanApprove = $CurrentUser.login -ne $Pr.author.login
if ($CanApprove) {
    Invoke-External -FilePath "gh" -Arguments @(
        "pr", "review", "$PrNumber",
        "--repo", $Repository,
        "--approve",
        "--body", ($ReviewSummary -join "`n")
    ) | Out-Null
} else {
    Invoke-External -FilePath "gh" -Arguments @(
        "pr", "comment", "$PrNumber",
        "--repo", $Repository,
        "--body", ($ReviewSummary -join "`n")
    ) | Out-Null
}

$MergeFlag = "--$MergeMethod"
Invoke-External -FilePath "gh" -Arguments @(
    "pr", "merge", "$PrNumber",
    "--repo", $Repository,
    $MergeFlag,
    "--delete-branch"
) | Out-Null

foreach ($Issue in $Issues) {
    if ($IssueNumbers.Count -eq 1 -and $Issue.state -eq "OPEN") {
        Invoke-External -FilePath "gh" -Arguments @(
            "issue", "close", "$($Issue.number)",
            "--repo", $Repository,
            "--comment", ($IssueSummary -join "`n")
        ) | Out-Null
    } else {
        Invoke-External -FilePath "gh" -Arguments @(
            "issue", "comment", "$($Issue.number)",
            "--repo", $Repository,
            "--body", ($IssueSummary -join "`n")
        ) | Out-Null
    }
}

foreach ($DiscussionNumber in $DiscussionNumbers) {
    Add-DiscussionComment `
        -Owner $RepoParts.Owner `
        -Name $RepoParts.Name `
        -DiscussionNumber $DiscussionNumber `
        -Body ($DiscussionSummary -join "`n")
}

if ($Project) {
    Set-ProjectStatusIfPossible -Project $Project -ContentType "PullRequest" -ContentNumber $PrNumber -StatusName "Done"
    foreach ($IssueNumber in $IssueNumbers) {
        Set-ProjectStatusIfPossible -Project $Project -ContentType "Issue" -ContentNumber $IssueNumber -StatusName "Done"
    }
}

Write-Section "PR #$PrNumber のレビューとマージが完了しました"
exit 0
