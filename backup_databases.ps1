# Script de Backup Automatizado para FastOrder HA
# Este script realiza un volcado (dump) de las 3 bases de datos principales.

function Perform-Backup {
    param (
        [string]$dbName
    )
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $backupDir = "./backups"
    if (!(Test-Path $backupDir)) { 
        New-Item -ItemType Directory -Path $backupDir 
    }
    
    $fileName = "$backupDir/backup_${dbName}_$timestamp.sql"
    
    Write-Host "Iniciando backup de $dbName..."
    
    # Ejecutamos pg_dump dentro del contenedor de Docker
    docker exec fastorder-db pg_dump -U postgres -d $dbName > $fileName
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Backup completado: $fileName"
    } else {
        Write-Host "Error al realizar backup de $dbName"
    }
}

# Realizar backups de las 3 bases de datos
Perform-Backup "orders_db"
Perform-Backup "inventory_db"
Perform-Backup "menu_db"

Write-Host "Proceso de Backup Finalizado"
