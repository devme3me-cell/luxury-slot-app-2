# Deployment Checklist

## ✅ Completed

- [x] Replaced localStorage with Supabase integration
- [x] Created Supabase client and database functions
- [x] Updated all pages to use Supabase (main page, admin dashboard)
- [x] Updated test data generator to use Supabase
- [x] Created environment variable configuration
- [x] Added comprehensive documentation
- [x] Installed Supabase dependencies

## 📋 What You Need to Do

### 1. Set Up Supabase (Required before testing)

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - Project Name: (e.g., "luxury-slot-app")
   - Database Password: (create a strong password)
   - Region: (choose closest to your users)
5. Wait for project to finish setting up (~2 minutes)

### 2. Create Database Table

1. In your Supabase project, go to **SQL Editor**
2. Click "New Query"
3. Copy and paste the SQL from `SUPABASE_SETUP.md`
4. Click "Run" or press Ctrl+Enter
5. You should see: "Success. No rows returned"

### 3. Get Your Supabase Credentials

1. Go to **Project Settings** (gear icon in sidebar)
2. Click **API** in the left menu
3. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

### 4. Configure Local Environment

1. Open `.env.local` file in the project root
2. Replace the values with your actual Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-actual-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-here
```
3. Save the file
4. Restart the dev server (stop and run `bun run dev` again)

### 5. Test Locally

1. Go to [http://localhost:3000](http://localhost:3000)
2. Complete a lottery entry:
   - Enter username
   - Select amount
   - Upload an image
   - Spin the wheel
3. Go to [http://localhost:3000/admin](http://localhost:3000/admin)
4. Login and verify the entry appears in the admin dashboard
5. Test the following features:
   - Search entries
   - Filter by amount
   - View image preview
   - Delete an entry
   - Generate test data
   - Clear all entries

### 6. Deploy to Zeabur

Follow the steps in `ZEABUR_DEPLOYMENT.md`:

1. **Prepare Your Code**
   - Commit all changes to Git
   - Push to GitHub/GitLab/Bitbucket

2. **Create Zeabur Project**
   - Go to [https://zeabur.com](https://zeabur.com)
   - Sign up or log in
   - Click "New Project"

3. **Add Service**
   - Click "Add Service"
   - Select "Git"
   - Connect your repository
   - Zeabur will auto-detect Next.js

4. **Configure Environment Variables**
   - In Zeabur dashboard, go to your service
   - Click "Variables" tab
   - Add both Supabase variables:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (~2-3 minutes)
   - Visit your deployed URL

## 🔒 Important Security Notes

**Before going to production:**

1. **Row Level Security (RLS)**
   - Current setup allows all operations
   - For production, restrict based on authentication
   - See Supabase docs on RLS policies

2. **Admin Authentication**
   - Currently uses localStorage (demo only)
   - Implement Supabase Auth for production
   - Add proper session management

3. **Image Storage**
   - Currently storing base64 in database
   - For production, use Supabase Storage
   - Store only URLs in database

4. **Rate Limiting**
   - Add rate limiting to prevent abuse
   - Consider using Zeabur's built-in protection

5. **Input Validation**
   - Add server-side validation
   - Sanitize all user inputs
   - Validate image sizes/types

## 📚 Documentation Files

- `SUPABASE_SETUP.md` - Complete Supabase setup guide
- `ZEABUR_DEPLOYMENT.md` - Detailed deployment instructions
- `README.md` - Project overview and features
- `.env.example` - Example environment variables

## 🆘 Troubleshooting

### "Failed to save entry" error
- Check Supabase credentials in `.env.local`
- Verify database table was created
- Check browser console for detailed errors

### "Cannot connect to Supabase" error
- Verify your Supabase project URL is correct
- Check that anon key is copied correctly
- Ensure Row Level Security policies are set

### Admin page shows no entries
- Check if entries were saved successfully
- Open browser DevTools → Network tab
- Look for Supabase API calls
- Verify table has data in Supabase dashboard

### Build fails on Zeabur
- Check environment variables are set correctly
- Verify all dependencies are in package.json
- Review build logs in Zeabur dashboard

## ✨ Next Steps After Deployment

1. Test all features on production URL
2. Share the URL with stakeholders
3. Monitor Supabase usage in dashboard
4. Set up custom domain (optional)
5. Configure backups and monitoring
6. Plan security improvements for production

## 📞 Need Help?

- Supabase Discord: https://discord.supabase.com
- Zeabur Discord: https://discord.gg/zeabur
- Supabase Docs: https://supabase.com/docs
- Zeabur Docs: https://zeabur.com/docs
