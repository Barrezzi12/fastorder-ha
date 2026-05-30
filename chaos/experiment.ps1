# Script de Chaos Engineering para FastOrder HA
# Ejecutar mientras k6 esta corriendo: k6 run tests/stress-test.js

function kill_pod() {
    $pod = (kubectl get pods -l app=$args[0] -o jsonpath='{.items[0].metadata.name}')
    Write-Host "🔥 MATANDO POD: $pod" -ForegroundColor Red
    kubectl delete pod $pod --now
}

function simulate_network_failure() {
    Write-Host "🔌 DESCONECTANDO REDIS (Simulación)..." -ForegroundColor Yellow
    docker pause fastorder-cache
    Start-Sleep -Seconds 10
    docker unpause fastorder-cache
    Write-Host "✅ REDIS RECONECTADO" -ForegroundColor Green
}

# --- ESCENARIO DE CAOS ---
Write-Host "--- INICIANDO EXPERIMENTO DE CAOS ---" -ForegroundColor Cyan

# 1. Matar una instancia del inventario (Saga resilience)
kill_pod "inventory-service"

# 2. Esperar recuperación de K8s
Start-Sleep -Seconds 15

# 3. Fallo de infraestructura de caché
simulate_network_failure

Write-Host "--- EXPERIMENTO FINALIZADO. VERIFICA MÉTRICAS EN GRAFANA ---" -ForegroundColor Cyan
