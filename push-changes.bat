@echo off
ECHO Pushing changes to GitHub to trigger Vercel deployment...

REM Get current timestamp for commit message
FOR /F "tokens=2-4 delims=/ " %%a in ('date /t') do (set mydate=%%c-%%a-%%b)
FOR /F "tokens=1-2 delims=/:" %%a in ('time /t') do (set mytime=%%a%%b)
SET timestamp=%mydate%_%mytime%

ECHO Adding all changes...
git add .

ECHO Committing changes...
git commit -m "Auto update: %timestamp%"

ECHO Pushing to GitHub...
git push

ECHO Done! Vercel deployment should start automatically.
ECHO.
ECHO Press any key to exit...
pause > nul
