# Deploying Your AI Companion Chatbot to Vercel

Vercel is the recommended hosting platform for Next.js applications. It's free for personal projects and provides a seamless deployment experience.

## Prerequisites

1. GitHub Repository (follow the steps in GITHUB_SETUP.md first)
2. Vercel Account (free)

## Deployment Steps

### 1. Create a Vercel Account

- Go to [vercel.com](https://vercel.com/)
- Sign up with GitHub (recommended)
- Complete the account setup

### 2. Import Your GitHub Repository

1. Once logged in to Vercel, click "Add New..." → "Project"
2. Select your GitHub account and find `ai-companion-chatbot`
3. Click "Import"

### 3. Configure Project Settings

- **Framework Preset**: Next.js (should be auto-detected)
- **Project Name**: Can be customized or left as default
- **Root Directory**: Leave as `.` (default)
- **Build Command**: Keep default (`next build`)
- **Output Directory**: Keep default (`Next.js default`)

### 4. Environment Variables

Add the following environment variables:

| NAME | VALUE |
|------|-------|
| NEXT_PUBLIC_SUPABASE_URL | your-supabase-url |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | your-supabase-anon-key |
| DATABASE_URL | your-database-url (if using a production DB) |

### 5. Deploy

- Click "Deploy"
- Wait for the build and deployment to complete

### 6. Access Your Deployed App

- Once deployment is successful, you'll get a URL like `https://ai-companion-chatbot.vercel.app`
- This is the URL you can share with your friend

## Using Your Own Domain (Optional)

1. In your Vercel project dashboard, go to "Settings" → "Domains"
2. Add your custom domain
3. Follow the instructions to configure DNS settings

## Continuous Deployment

Vercel automatically deploys your app when you push changes to your GitHub repository. This makes it easy to keep your deployed app up to date.

## Managing Environment Variables for Production

For a production environment, you should:

1. Set up a production Supabase project
2. Use a proper PostgreSQL database instead of SQLite
3. Update the environment variables in Vercel accordingly

## Monitoring and Logs

- Vercel provides build logs, deployment logs, and function logs
- Access these from your project dashboard

## Troubleshooting Common Issues

### Build Failures

- Check the build logs for specific errors
- Ensure all dependencies are correctly installed
- Verify that environment variables are properly set

### Database Connection Issues

- If using Supabase, check that your IP is allowed in Supabase settings
- Verify the database connection string is correct
- Ensure database migrations have been applied

### API Routes Not Working

- Check for CORS issues if calling from a different domain
- Verify that API routes are correctly implemented
- Check function logs in Vercel

## Sharing with Your Friend

Simply send your friend the deployed URL:
```
https://ai-companion-chatbot.vercel.app
```

They can use the demo login credentials (demo@example.com / demopassword) or create their own account.
