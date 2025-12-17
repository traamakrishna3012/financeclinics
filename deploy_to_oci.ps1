# Deploy to OCI: compress and upload via SCP, then extract remotely
# Usage:
# .\deploy_to_oci.ps1 -KeyPath 'C:\Users\you\.ssh\oci_key.pem' -LocalDir 'D:\Freelance\Financeclinics' -RemoteHost '80.225.193.56'

[CmdletBinding()]
param(
  [Parameter(Mandatory=$true)] [string] $KeyPath,
  [string] $LocalDir = (Get-Location).Path,
  [string] $RemoteUser = 'ubuntu',
  [Parameter(Mandatory=$true)] [string] $RemoteHost,
  [string] $RemotePath = '/home/ubuntu',
  [string] $ArchiveName = 'financeclinics.zip'
)

if (-not (Test-Path $KeyPath)) {
  Write-Error "SSH key not found at $KeyPath"
  exit 1
}

if (-not (Test-Path $LocalDir)) {
  Write-Error "Local directory not found: $LocalDir"
  exit 1
}

try {
  $archiveFull = Join-Path -Path (Get-Location) -ChildPath $ArchiveName
  if (Test-Path $archiveFull) { Remove-Item $archiveFull -Force }

  Write-Host "Creating archive $archiveFull from $LocalDir (excluding private keys)..."
  # Exclude private key files and other large folders that shouldn't be uploaded
  $excludeRegex = '(\.key$|\.pem$|\\node_modules\\|\\venv\\|__pycache__)'
  $files = Get-ChildItem -Path $LocalDir -Recurse -File | Where-Object { $_.FullName -notmatch $excludeRegex } | ForEach-Object { $_.FullName }
  if (-not $files) { Write-Error "No files found to archive."; exit 1 }
  Compress-Archive -Path $files -DestinationPath $archiveFull -Force

  Write-Host ("Uploading {0} to {1}@{2}:{3} ..." -f $archiveFull, $RemoteUser, $RemoteHost, $RemotePath)
  $scpTarget = "{0}@{1}:{2}/" -f $RemoteUser, $RemoteHost, $RemotePath
  & scp -i $KeyPath $archiveFull $scpTarget
  if ($LASTEXITCODE -ne 0) {
    Write-Error "SCP failed with exit code $LASTEXITCODE"
    exit $LASTEXITCODE
  }

  Write-Host "Connecting via SSH to extract archive and set permissions..."
  $remoteArchive = Join-Path $RemotePath $ArchiveName
  $sshTarget = "{0}@{1}" -f $RemoteUser, $RemoteHost
  $remoteDir = "$RemotePath/financeclinics"
  $remoteCmd = "mkdir -p {2} && unzip -o {0} -d {2} && rm -f {0} && chown -R {1}:{1} {2}" -f $remoteArchive, $RemoteUser, $remoteDir
  & ssh -i $KeyPath $sshTarget $remoteCmd
  if ($LASTEXITCODE -ne 0) {
    Write-Error "SSH remote commands failed with exit code $LASTEXITCODE"
    exit $LASTEXITCODE
  }

  Write-Host "Upload and extraction completed successfully. Remote path: $RemotePath/financeclinics"
  exit 0
}
catch {
  Write-Error "Error: $_"
  exit 1
}
