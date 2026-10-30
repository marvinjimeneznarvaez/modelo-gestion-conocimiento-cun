@echo off
title Subir Simulador CUN a GitHub
echo ==========================================================
echo   Subiendo aplicacion a GitHub
echo   Repositorio: modelo-gestion-conocimiento-cun
echo ==========================================================
echo.
cd /d "%~dp0"
echo Enviando archivos a la rama main...
git branch -M main
git push -u origin main
echo.
echo ==========================================================
echo Proceso finalizado. Si se subio con exito, ya puedes activar
echo GitHub Pages en la configuracion de tu repositorio.
echo ==========================================================
pause
