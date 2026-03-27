# process-review-queue.ps1
# Process PR items currently in the project review column.

param(
    [string]$Repository = "aster-mi/learning-td",

    [string]$ProjectOwner = "aster-mi",

    [int]$ProjectNumber = 2,

    [ValidateSet("merge", "squash", "rebase")]
    [string]$MergeMethod = "merge",

    [switch]$DryRun,

    [switch]$SkipProjectUpdate
)

$ErrorActionPreference = "Stop"
if (Get-Variable -Name PSNativeCommandUseErrorActionPreference -ErrorAction SilentlyContinue) {
    $PSNativeCommandUseErrorActionPreference = $false
}

$ProcessScript = Join-Path $PSScriptRoot "process-pr-review.ps1"
if (-not (Test-Path $ProcessScript)) {
    throw "Missing script: $ProcessScript"
}

function Get-GitHubToken {
    if ($script:Token) {
        return $script:Token
    }

    $script:Token = (gh auth token).Trim()
    return $script:Token
}

function Invoke-GitHubGraphQl {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Query,

        [hashtable]$Variables = @{}
    )

    $Headers = @{
        Authorization = "Bearer $(Get-GitHubToken)"
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

$Query = @'
query($owner: String!, $number: Int!) {
  user(login: $owner) {
    projectV2(number: $number) {
      title
      items(first: 100) {
        nodes {
          id
          fieldValues(first: 20) {
            nodes {
              __typename
              ... on ProjectV2ItemFieldSingleSelectValue {
                name
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
            ... on PullRequest {
              number
              title
              state
              url
            }
          }
        }
      }
    }
  }
}
'@

$Project = (Invoke-GitHubGraphQl -Query $Query -Variables @{
    owner = $ProjectOwner
    number = $ProjectNumber
}).user.projectV2

$Queue = @(
    $Project.items.nodes |
        Where-Object {
            $_.content.__typename -eq "PullRequest" -and
            $_.content.state -eq "OPEN" -and
            (($_.fieldValues.nodes | Where-Object {
                $_.__typename -eq "ProjectV2ItemFieldSingleSelectValue" -and
                $_.field.name -eq "Status"
            } | Select-Object -First 1).name -eq "In review")
        }
)

if ($Queue.Count -eq 0) {
    Write-Host "No open PR items in 'In review' on project '$($Project.title)'."
    exit 0
}

$Failures = 0

foreach ($Item in $Queue) {
    $Args = @(
        "-NoProfile",
        "-ExecutionPolicy", "Bypass",
        "-File", $ProcessScript,
        "-PrNumber", "$($Item.content.number)",
        "-Repository", $Repository,
        "-ProjectOwner", $ProjectOwner,
        "-ProjectNumber", "$ProjectNumber",
        "-MergeMethod", $MergeMethod
    )

    if ($DryRun) {
        $Args += "-DryRun"
    }

    if ($SkipProjectUpdate) {
        $Args += "-SkipProjectUpdate"
    }

    Write-Host "Processing PR #$($Item.content.number): $($Item.content.title)"
    & powershell.exe @Args

    if ($LASTEXITCODE -ne 0) {
        $Failures += 1
        Write-Warning "PR #$($Item.content.number) returned exit code $LASTEXITCODE"
    }
}

if ($Failures -gt 0) {
    exit 1
}

exit 0
