# Installation Guide

This guide will help you set up the AI Companion Chatbot project locally.

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

## Step 1: Set up Supabase

1. Create a new project on [Supabase](https://supabase.com)
2. Once your project is created, go to Project Settings > API to get your:
   - Project URL (for `NEXT_PUBLIC_SUPABASE_URL`)
   - Project API Key (for `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
3. Go to the SQL Editor and run the following script to enable the storage for character avatars:

```sql
-- Create a storage bucket for character avatars
INSERT INTO storage.buckets (id, name) VALUES ('characters', 'characters');

-- Set up public access for the avatars
CREATE POLICY "Public Access"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'characters');

-- Allow authenticated users to upload avatars
CREATE POLICY "Authenticated users can upload avatars"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'characters');

-- Allow users to update their own avatars
CREATE POLICY "Users can update their own avatars"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'characters');

-- Allow users to delete their own avatars
CREATE POLICY "Users can delete their own avatars"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'characters');
```

## Step 2: Set up Environment Variables

Create a `.env` file in the project root with the following variables:

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Database (copy from Supabase > Settings > Database > Connection string > URI)
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# AI API (placeholder for now)
AI_API_URL=https://api.example.com/v1/chat
AI_API_KEY=your-ai-api-key

# Image generation (placeholder for now)
IMAGE_API_URL=https://api.example.com/v1/images
IMAGE_API_KEY=your-image-api-key
```

## Step 3: Install Dependencies and Initialize Database

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed the database (optional)
# npx prisma db seed
```

## Step 4: Start the Development Server

```bash
npm run dev
```

The application should now be running at [http://localhost:3000](http://localhost:3000)

## Step 5: Testing the Application

1. Go to [http://localhost:3000/register](http://localhost:3000/register) to create a user account
2. After logging in, you'll be redirected to the dashboard
3. Create a new character
4. Start chatting with your character!

## Troubleshooting

- **Database Connection Issues**: Make sure your DATABASE_URL is correct and that your IP address is allowed in Supabase
- **Authentication Issues**: Check that your Supabase URL and anon key are correct
- **Prisma Errors**: Try running `npx prisma generate` after making changes to the schema

## Deployment

To deploy this project:

1. Set up a Vercel project connected to your repository
2. Add the environment variables to your Vercel project
3. Deploy your project

For more information, see the [README.md](README.md) file.
