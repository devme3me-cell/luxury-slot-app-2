# Setup Guide - Luxury Slot App

This guide will help you set up the Luxury Slot App from scratch.

## Prerequisites

- **Bun** (recommended) or Node.js 18+
- A **Supabase** account (free tier works fine)
- **Git** for version control

## Step-by-Step Setup

### 1. Clone the Repository

```bash
git clone https://github.com/devme3me-cell/luxury-slot-app-2.git
cd luxury-slot-app-2
```

### 2. Install Dependencies

Using Bun (recommended):
```bash
bun install
```

Or using npm:
```bash
npm install
```

### 3. Set Up Supabase Database

#### 3.1 Create a Supabase Project

1. Go to [Supabase](https://supabase.com)
2. Click "New Project"
3. Fill in:
   - Project name: `luxury-slot-app` (or any name you prefer)
   - Database password: Create a strong password (save it somewhere safe)
   - Region: Choose closest to your users
4. Click "Create new project" and wait for it to initialize (takes 1-2 minutes)

#### 3.2 Create the Database Schema

1. In your Supabase project dashboard, click on "SQL Editor" in the left sidebar
2. Open the `SUPABASE_SETUP.md` file in this repository
3. Copy the entire SQL code from that file
4. Paste it into the SQL Editor in Supabase
5. Click "Run" to execute the SQL

This will create the `entries` table with the correct schema.

#### 3.3 Get Your Supabase Credentials

1. In your Supabase project, click "Settings" (gear icon) in the left sidebar
2. Click "API" in the settings menu
3. You'll see two important values:
   - **Project URL**: Looks like `https://xxxxx.supabase.co`
   - **anon public key**: A long string starting with `eyJ...`
4. Keep this tab open, you'll need these values in the next step

### 4. Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` in your text editor

3. Replace the placeholder values with your actual Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-actual-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-from-supabase
   ```

**Important**:
- Replace `https://your-actual-project-id.supabase.co` with the Project URL from Supabase
- Replace `your-actual-anon-key-from-supabase` with the anon public key from Supabase
- Do NOT commit `.env.local` to Git (it's already in `.gitignore`)

### 5. Run the Development Server

Using Bun:
```bash
bun run dev
```

Or using npm:
```bash
npm run dev
```

The app should now be running at [http://localhost:3000](http://localhost:3000)

### 6. Verify Everything Works

1. Open [http://localhost:3000](http://localhost:3000) in your browser
2. You should see the luxury slot machine interface
3. Try the following:
   - Enter a username
   - Select a deposit amount
   - Upload an image
   - Spin the slot machine
4. Go to [http://localhost:3000/admin](http://localhost:3000/admin) to access the admin dashboard
   - Default password: `admin123` (you can change this in the code)

## Troubleshooting

### "supabaseUrl is required" Error

This means your environment variables aren't loaded properly:
1. Make sure `.env.local` exists in the project root
2. Make sure it contains valid Supabase credentials (not placeholders)
3. Restart the dev server after creating/editing `.env.local`

### "Failed to fetch" Error

This usually means:
1. Your Supabase URL or anon key is incorrect
2. Your Supabase project isn't running
3. The database schema wasn't created properly

To fix:
1. Double-check your credentials in `.env.local`
2. Make sure you ran the SQL from `SUPABASE_SETUP.md`
3. Check your Supabase project is active at https://supabase.com/dashboard

### Database Connection Issues

If data isn't saving or loading:
1. Go to Supabase Dashboard > Table Editor
2. Check if the `entries` table exists
3. Check if the table has the correct columns (id, timestamp, username, amount, image, prize, created_at)
4. Try manually inserting a test row to verify the table works

### Development Server Won't Start

1. Make sure port 3000 isn't already in use
2. Try deleting `node_modules` and `.next` folders, then reinstall:
   ```bash
   rm -rf node_modules .next
   bun install
   bun run dev
   ```

## Next Steps

- Deploy to Netlify, Vercel, or your preferred hosting platform
- Customize the prize tiers in `src/app/page.tsx`
- Modify the UI styling in the component files
- Set up proper authentication for the admin dashboard

## Security Notes

⚠️ **For Production Deployment**:

1. **Never commit `.env.local`** - it's already in `.gitignore`
2. Set up proper Row Level Security (RLS) in Supabase
3. Implement real authentication instead of the demo admin password
4. Use Supabase Storage for images instead of base64 encoding
5. Add rate limiting to prevent abuse
6. Use environment variables for all sensitive data

## Need Help?

- Check the [README.md](README.md) for general information
- Review Supabase docs: https://supabase.com/docs
- Check Next.js docs: https://nextjs.org/docs
- Open an issue on GitHub if you find bugs
