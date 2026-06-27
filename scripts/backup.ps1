# ═══════════════════════════════════════════════════════════════
#  BACKUP SCRIPT — Instituto Conectar
#  Executa backup do banco PostgreSQL e comprime arquivos de upload
# ═══════════════════════════════════════════════════════════════

$ErrorActionPreference = "Stop"

# Configurações
$BackupDir = Join-Path $PSScriptRoot "..\storage\backups"
$DbUrl = $env:DATABASE_URL
if (-not $DbUrl) {
    # Carrega do arquivo .env se estiver disponível
    $EnvFile = Join-Path $PSScriptRoot "..\.env"
    if (Test-Path $EnvFile) {
        Get-Content $EnvFile | ForEach-Object {
            if ($_ -match "^([^=]+)=(.*)$") {
                [Environment]::SetEnvironmentVariable($Matches[1], $Matches[2].Trim())
            }
        }
        $DbUrl = $env:DATABASE_URL
    }
}

if (-not $DbUrl) {
    Write-Error "DATABASE_URL não configurada no ambiente nem no arquivo .env"
}

# Garante pasta de backups
if (-not (Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir | Out-Null
}

$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$DbBackupFile = Join-Path $BackupDir "db_backup_$Timestamp.sql"
$FilesBackupFile = Join-Path $BackupDir "uploads_backup_$Timestamp.zip"

Write-Host "🏥 Iniciando rotina de Backup - Instituto Conectar"

# 1. Backup do Banco de Dados PostgreSQL via pg_dump
try {
    Write-Host "💾 Fazendo dump do banco PostgreSQL..."
    # Suporta se pg_dump estiver no Path
    pg_dump $DbUrl -f $DbBackupFile
    Write-Host "✓ Dump do banco criado: $DbBackupFile"
} catch {
    Write-Warning "Falha ao rodar pg_dump local. Certifique-se de que as ferramentas Postgres CLI estão instaladas."
}

# 2. Backup dos arquivos de upload (storage)
$UploadsDir = Join-Path $PSScriptRoot "..\storage"
if (Test-Path $UploadsDir) {
    Write-Host "📦 Compactando diretório de uploads..."
    Compress-Archive -Path $UploadsDir -DestinationPath $FilesBackupFile -Force
    Write-Host "✓ Uploads compactados: $FilesBackupFile"
}

Write-Host "🎉 Rotina de Backup concluída com sucesso!"
