@echo off
title AMSED Management Portal Desktop Launcher
echo ===================================================
echo     AMSED Association - Secure Admin Portal Launcher
echo ===================================================
echo.
echo Launching standalone admin desktop application...

:: Default to live Vercel deployed URL
set "ADMIN_URL=https://asso-amsed.vercel.app/portal-amsed-secure-x98k21/admin?key=amsed_vault_secure_987654"

:: Check if deployed domain is provided as first argument
if not "%~1"=="" set "ADMIN_URL=%~1/portal-amsed-secure-x98k21/admin?key=amsed_vault_secure_987654"

:: Launch in native standalone window (No URL address bar, isolated desktop app)
where msedge >nul 2>nul
if %errorlevel% equ 0 (
    start msedge --app="%ADMIN_URL%" --window-size=1400,900
    exit
)

where chrome >nul 2>nul
if %errorlevel% equ 0 (
    start chrome --app="%ADMIN_URL%" --window-size=1400,900
    exit
)

start "" "%ADMIN_URL%"
exit
