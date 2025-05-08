# Pushing Your Project to GitHub

Since Git wasn't available on the system when we tried to initialize the repository, follow these steps to push your project to GitHub once Git is installed:

## Prerequisites

1. **Install Git**:
   - Download from [git-scm.com](https://git-scm.com/downloads)
   - Follow the installation instructions

2. **Create a GitHub Account** (if you don't have one already):
   - Go to [github.com](https://github.com) and sign up

## Steps to Push Your Project to GitHub

1. **Create a New Repository on GitHub**:
   - Go to [github.com/new](https://github.com/new)
   - Name: `ai-companion-chatbot`
   - Description: "A modern AI companion platform built with Next.js"
   - Keep it Public (or Private if you prefer)
   - Don't initialize with a README, .gitignore, or license (we already have these)
   - Click "Create repository"

2. **Open a Command Line/Terminal**:
   - Navigate to your project directory:
   ```bash
   cd /Users/PC/ai-companion-chatbot
   ```

3. **Initialize Git Repository**:
   ```bash
   git init
   ```

4. **Add Your Files**:
   ```bash
   git add .
   ```

5. **Commit Your Files**:
   ```bash
   git commit -m "Initial commit of AI Companion Chatbot"
   ```

6. **Add Remote Repository**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/ai-companion-chatbot.git
   ```
   (Replace YOUR_USERNAME with your actual GitHub username)

7. **Push to GitHub**:
   ```bash
   git push -u origin main
   ```
   (You might need to authenticate with your GitHub credentials)

## Possible Issues and Solutions

### If Your Default Branch is "master" Instead of "main"

```bash
git branch -M main
git push -u origin main
```

### If You Get Authentication Errors

- You might need to set up a personal access token:
  1. Go to GitHub → Settings → Developer settings → Personal access tokens
  2. Generate a new token with "repo" scope
  3. Use this token as your password when pushing

### If You Have Large Files

If you have any large files that exceed GitHub's file size limit:
1. Add them to `.gitignore` before committing
2. Consider using Git LFS for large files

## Sharing Your Repository

Once pushed, your repository will be available at:
```
https://github.com/YOUR_USERNAME/ai-companion-chatbot
```

Share this URL with your friend, and they can clone the repository to their local machine:
```bash
git clone https://github.com/YOUR_USERNAME/ai-companion-chatbot.git
```

## Next Steps After Pushing

1. **Setup GitHub Pages** or deploy to Vercel/Netlify for a live demo
2. **Add Collaborators** if you want your friend to contribute to the code
3. **Setup Branch Protection** if multiple people will be working on the project
