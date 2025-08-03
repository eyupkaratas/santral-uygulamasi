if (-Not ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Host "Yönetici yetkileri gerekiyor. Script yeniden başlatılacak..." -ForegroundColor Yellow
   
    $arguments = "-ExecutionPolicy Bypass -File `"$($MyInvocation.MyCommand.Path)`""
    Start-Process powershell.exe -Verb RunAs -ArgumentList $arguments
    exit
}

Set-Location -Path $PSScriptRoot
Write-Host "✅ Çalışma dizini ayarlandı: $($PSScriptRoot)" -ForegroundColor Green

Write-Host "`n--- Gerekli Araçların Kontrolü ve Kurulumu ---" -ForegroundColor Cyan


$wingetExists = $false
try {
    winget --version | Out-Null
    $wingetExists = $true
} catch {}

if (-Not $wingetExists) {
    Write-Host "❌ Bu script'in otomatik kurulum yapabilmesi için Windows Paket Yöneticisi (winget) gereklidir." -ForegroundColor Red
    Write-Host "Lütfen Windows'unuzu güncelleyin veya App Installer'ı Microsoft Store'dan yükleyin." -ForegroundColor Red
    pause
    exit
}

$prerequisitesMissing = $false


try {
    dotnet --version | Out-Null
    Write-Host "✅ .NET SDK bulundu." -ForegroundColor Green
} catch {
    Write-Host "🟡 .NET SDK bulunamadı. Winget ile en güncel sürüm kuruluyor..." -ForegroundColor Yellow
    winget install --id Microsoft.DotNet.SDK -e --accept-package-agreements --accept-source-agreements
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ .NET SDK kurulumu başarısız oldu. Lütfen manuel olarak kurun." -ForegroundColor Red
        pause
        exit
    }
    $prerequisitesMissing = $true
}


try {
    node --version | Out-Null
    Write-Host "✅ Node.js bulundu." -ForegroundColor Green
} catch {
    Write-Host "🟡 Node.js bulunamadı. Winget ile en güncel LTS sürümü kuruluyor..." -ForegroundColor Yellow
    winget install --id OpenJS.NodeJS.LTS -e --accept-package-agreements --accept-source-agreements
     if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Node.js kurulumu başarısız oldu. Lütfen manuel olarak kurun." -ForegroundColor Red
        pause
        exit
    }
    $prerequisitesMissing = $true
}


if ($prerequisitesMissing) {
    Write-Host "✅ Temel kurulumlar tamamlandı. Değişikliklerin etkili olması için script'i yeniden başlatın." -ForegroundColor Magenta
    Write-Host "Lütfen bu pencereyi kapatıp start.bat dosyasına tekrar çift tıklayın."
    pause
    exit
}

try {
    pnpm --version | Out-Null
    Write-Host "✅ pnpm bulundu." -ForegroundColor Green
} catch {
    Write-Host "🟡 pnpm bulunamadı. npm ile en güncel sürüm kuruluyor..." -ForegroundColor Yellow
    npm install -g pnpm
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ pnpm kurulumu başarısız oldu. Lütfen 'npm install -g pnpm' komutunu manuel çalıştırın." -ForegroundColor Red
        pause
        exit
    }
    Write-Host "✅ pnpm başarıyla kuruldu. Değişikliklerin etkili olması için script'i yeniden başlatın." -ForegroundColor Magenta
    Write-Host "Lütfen bu pencereyi kapatıp start.bat dosyasına tekrar çift tıklayın."
    pause
    exit
}



Write-Host "`n--- Proje Bağımlılıkları Kuruluyor ---" -ForegroundColor Cyan


$migrationPath = "./server/SantralOpsAPI/Migrations"
if (Test-Path $migrationPath) {
    Write-Host "Eski veritabanı migration'ları temizleniyor..."
    Remove-Item -Recurse -Force $migrationPath
    Write-Host "✅ Eski migration'lar silindi."
}


Write-Host "Backend (.NET) paketleri geri yükleniyor..."
Push-Location -Path "./server/SantralOpsAPI"
dotnet restore
Pop-Location


Write-Host "Frontend (Node.js) paketleri kuruluyor..."
Push-Location -Path "./client"
pnpm install
Pop-Location

$envFilePath = "./client/.env"
if (-Not (Test-Path $envFilePath)) {
    Write-Host "Frontend için .env dosyası oluşturuluyor..."
    $envContent = @"
JWT_SECRET=48D4E3839EFD528F542F8791F736403DCA1CA21E5EED146E722572DF0442E79F
API_BASE_URL=http://localhost:5049
"@
    Set-Content -Path $envFilePath -Value $envContent
    Write-Host "✅ .env dosyası oluşturuldu."
}

Write-Host "✅ Tüm proje bağımlılıkları hazır." -ForegroundColor Green


Write-Host "`n--- Sunucular Başlatılıyor ---" -ForegroundColor Cyan

Write-Host "Backend sunucusu başlatılıyor..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host 'Backend sunucusu çalışıyor... Bu pencereyi kapatmayın.'; cd ./server/SantralOpsAPI; dotnet run"

Write-Host "Frontend sunucusu başlatılıyor..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host 'Frontend sunucusu çalışıyor... Bu pencereyi kapatmayın.'; cd ./client; pnpm dev"

Write-Host "Sunucuların başlaması için 10 saniye bekleniyor..."
Start-Sleep -Seconds 10

$url = "http://localhost:3000"
Write-Host "✅ Uygulama başlatıldı! Tarayıcıda açılıyor: $url" -ForegroundColor Green
Start-Process $url

Write-Host "`nKurulum tamamlandı. Keyfini çıkarın!"