@echo off
setlocal
cd /d "%~dp0"
set "BESTABLE_NODE=node"
where node >nul 2>nul
if errorlevel 1 (
  set "BESTABLE_NODE=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
)
"%BESTABLE_NODE%" --version >nul 2>nul
if errorlevel 1 (
  echo Node.js is required. Install the LTS version from https://nodejs.org
  echo Then close this window and double-click start.cmd again.
  pause
  exit /b 1
)
if not exist "node_modules\vite\bin\vite.js" (
  echo Installing required files for the first run...
  where npm.cmd >nul 2>nul
  if not errorlevel 1 (
    call npm.cmd install
  ) else (
    "%BESTABLE_NODE%" "%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules\pnpm\bin\pnpm.cjs" install
  )
)
if not exist "node_modules\vite\bin\vite.js" (
  echo Installation did not finish. Check your internet connection and retry.
  pause
  exit /b 1
)
echo BESTABLE is starting. Keep this window open while using the app.
echo Open the Local address shown below in your browser.
"%BESTABLE_NODE%" "node_modules\vite\bin\vite.js" --host 127.0.0.1 --port 5173 --open
pause
