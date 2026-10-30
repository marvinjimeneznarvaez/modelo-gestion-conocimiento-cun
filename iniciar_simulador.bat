@echo off
title Simulador Modelo de Gestion del Conocimiento - CUN
echo ========================================================
echo   Iniciando Simulador Modelo GC CUN - Equipo de Investigacion
echo ========================================================
echo.
cd /d "%~dp0"
echo Abriendo navegador en http://localhost:8085 ...
start http://localhost:8085
echo Servidor web activo. Presiona Ctrl+C para detener.
python -m http.server 8085
pause
