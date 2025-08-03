@echo off
REM Bu batch dosyasi, start.ps1 PowerShell script'ini yonetici olarak calistirir.
REM Lutfen bu dosyaya cift tiklayarak uygulamayi baslatin.

powershell.exe -ExecutionPolicy Bypass -File "%~dp0\start.ps1"

echo.
echo Tum islemler tamamlandi. Bu pencereyi kapatabilirsiniz.
pause
