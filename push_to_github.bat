@echo off
echo Pushing code to GitHub repository...
echo You will be prompted for your GitHub credentials.
echo If you have 2FA enabled, use a personal access token instead of your password.
echo.

cd /Users/PC/ai-companion-chatbot
"C:\Program Files\Git\bin\git.exe" push -u origin main

echo.
if %ERRORLEVEL% EQU 0 (
  echo Success! Your code has been pushed to GitHub.
  echo Repository URL: https://github.com/georgerokvich/ai-companion-chatbot
) else (
  echo There was an error pushing to GitHub.
  echo.
  echo If you're having authentication issues, try creating a personal access token:
  echo 1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
  echo 2. Generate a new token with "repo" scope
  echo 3. Use this token as your password when prompted
)

pause
