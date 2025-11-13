# Zeabur Deployment Guide

This guide will help you deploy your luxury slot app to Zeabur with Supabase as the database.

## Prerequisites

1. A [Zeabur](https://zeabur.com) account
2. A [Supabase](https://supabase.com) account
3. Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)

## Step 1: Set Up Supabase Database

1. Go to [Supabase](https://supabase.com) and sign in
2. Create a new project
3. Wait for the project to finish setting up
4. Go to the **SQL Editor** in your Supabase dashboard
5. Run the following SQL to create the database table:

```sql
-- Create entries table
CREATE TABLE entries (
  id TEXT PRIMARY KEY,
  timestamp TEXT NOT NULL,
  username TEXT NOT NULL,
  amount TEXT NOT NULL,
  image TEXT NOT NULL,
  prize INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX idx_entries_timestamp ON entries(timestamp DESC);
CREATE INDEX idx_entries_created_at ON entries(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE entries ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations
CREATE POLICY "Allow all operations on entries" ON entries
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

6. Go to **Project Settings** > **API**
7. Copy your **Project URL** and **anon public** key (you'll need these later)

## Step 2: Deploy to Zeabur

### 2.1 Create a New Project

1. Go to [Zeabur Dashboard](https://dash.zeabur.com)
2. Click **New Project**
3. Give your project a name

### 2.2 Add Your Service

1. Click **Add Service**
2. Select **Git** as the source
3. Connect your Git provider (GitHub, GitLab, or Bitbucket)
4. Select your repository
5. Zeabur will automatically detect it's a Next.js project

### 2.3 Configure Environment Variables

1. In your Zeabur project, click on your service
2. Go to the **Variables** tab
3. Add the following environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Replace the values with your actual Supabase project URL and anon key from Step 1.

### 2.4 Deploy

1. Click **Deploy** or **Redeploy**
2. Wait for the deployment to complete (usually takes 2-3 minutes)
3. Once deployed, Zeabur will provide you with a URL to access your app

## Step 3: Configure Custom Domain (Optional)

1. In your Zeabur service, go to the **Domain** tab
2. Click **Add Domain**
3. Enter your custom domain or use Zeabur's free subdomain
4. Follow the DNS configuration instructions if using a custom domain

## Step 4: Test Your Deployment

1. Visit your deployed app URL
2. Go through the lottery flow:
   - Enter an account name
   - Select an amount
   - Upload an image
   - Spin the wheel
3. Go to `/admin` and login to verify entries are saved in Supabase

## Troubleshooting

### Database Connection Issues

- Verify your Supabase URL and anon key are correct
- Check that the `entries` table was created successfully
- Ensure Row Level Security policies are set correctly

### Build Failures

- Check the build logs in Zeabur
- Ensure all dependencies are listed in `package.json`
- Verify environment variables are set correctly

### Image Upload Issues

- Large images may cause issues; consider compressing images before upload
- Base64 images are stored in the database; for production, consider using Supabase Storage

## Production Recommendations

1. **Use Supabase Storage for Images**: Instead of storing base64 images in the database, upload images to Supabase Storage and store only the URL
2. **Implement Authentication**: Add proper admin authentication using Supabase Auth
3. **Set Up RLS Policies**: Configure more restrictive Row Level Security policies for production
4. **Monitor Performance**: Use Supabase dashboard to monitor database performance
5. **Set Up Backups**: Enable automatic backups in Supabase
6. **Add Rate Limiting**: Implement rate limiting to prevent abuse

## Support

- Zeabur Docs: https://zeabur.com/docs
- Supabase Docs: https://supabase.com/docs
- GitHub Issues: [Your Repository Issues]

## Admin Access

Default admin credentials (you should change these in production):
- Path: `/admin`
- Password: (stored in localStorage, implement proper auth for production)
