# Diagnostic script for Supabase connection
$hostName = "fsjroxinzhhjovqeaowp.supabase.co"

Write-Host "--- Diagnóstico de Conexão Supabase ---" -ForegroundColor Cyan
Write-Host "Testando resolução de: $hostName"

try {
    $addresses = [System.Net.Dns]::GetHostAddresses($hostName)
    Write-Host "[OK] Domínio resolvido com sucesso por este computador." -ForegroundColor Green
    foreach ($addr in $addresses) {
        Write-Host "   -> IP: $($addr.IPAddressToString)"
    }
} catch {
    Write-Host "[ERRO] Falha ao resolver o domínio: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Motivo provável: Seu servidor DNS não conhece este endereço."
    Write-Host "RECOMENDAÇÃO: Tente alterar seu DNS para 8.8.8.8 (Google) ou 1.1.1.1 (Cloudflare)."
}

Write-Host "`nTestando conexão via DNS do Google (8.8.8.8)..."
$nslookup = nslookup $hostName 8.8.8.8
if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] O domínio EXISTE e é resolvível via Google DNS." -ForegroundColor Green
} else {
    Write-Host "[AVISO] Falha ao consultar via Google DNS. Verifique sua conexão total com a internet." -ForegroundColor Yellow
}

Write-Host "`n--- Fim do Diagnóstico ---"
