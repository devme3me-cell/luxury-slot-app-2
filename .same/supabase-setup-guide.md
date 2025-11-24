# Supabase Setup Guide for Luxury Slot App

## Step 1: Create a Supabase Account and Project

1. **Visit Supabase:** Go to https://supabase.com
2. **Sign Up/Login:** Click "Start your project" or "Sign in"
   - You can use GitHub, Google, or email to sign up
3. **Create New Project:**
   - Click "New Project"
   - Organization: Select or create an organization
   - Project Name: `luxury-slot-app` (or any name you prefer)
   - Database Password: Create a strong password (save this!)
   - Region: Choose closest to your users (e.g., Northeast Asia for Asia-Pacific)
   - Pricing Plan: Start with **Free** tier (sufficient for development)
4. **Wait for Setup:** Project creation takes ~2 minutes

---

## Step 2: Get Your API Credentials

Once your project is created:

1. Go to **Project Settings** (gear icon in left sidebar)
2. Click **API** in the settings menu
3. You'll see two important values:

   **Project URL:**
   ```
   https://xxxxxxxxxxxxx.supabase.co
   ```

   **Project API keys:**
   - `anon` `public` key (this is what you need)
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

4. **Copy both values** - you'll need them in the next step

---

## Step 3: Configure Environment Variables

1. Open the file `.env.local` in your project root
2. Replace the empty values with your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. Save the file

---

## Step 4: Create Database Table

1. In your Supabase project, click **SQL Editor** in left sidebar
2. Click **New query**
3. Copy and paste this SQL code:

```sql
-- Create the entries table
CREATE TABLE IF NOT EXISTS entries (
  id TEXT PRIMARY KEY,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  username TEXT NOT NULL,
  amount TEXT NOT NULL,
  image TEXT,
  prize INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS entries_timestamp_idx ON entries(timestamp DESC);
CREATE INDEX IF NOT EXISTS entries_created_at_idx ON entries(created_at DESC);
CREATE INDEX IF NOT EXISTS entries_username_idx ON entries(username);
CREATE INDEX IF NOT EXISTS entries_amount_idx ON entries(amount);

-- Enable Row Level Security (RLS)
ALTER TABLE entries ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (for development)
-- You can make this more restrictive later
CREATE POLICY "Allow all operations" ON entries
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

4. Click **Run** (or press Ctrl+Enter / Cmd+Enter)
5. You should see "Success. No rows returned"

---

## Step 5: Verify the Setup

1. **Check the table was created:**
   - In Supabase, go to **Table Editor** in left sidebar
   - You should see the `entries` table

2. **Test the connection:**
   - Restart your development server
   - Check the browser console - you should see:
     ```
     ✅ Supabase configured successfully
     ```
   - If you see warnings, double-check your `.env.local` credentials

---

## Step 6: Test the Admin Panel

1. Go to `/admin` in your app
2. Login with:
   - Username: `chitu2025`
   - Password: `1234567890`
3. Click **生成測試資料** to generate test data
4. You should see 5 test entries appear in the table
5. Test the following features:
   - ✅ View entries in the table
   - ✅ Delete individual entries
   - ✅ Clear all entries
   - ✅ Export to CSV
   - ✅ Filter by today's entries

---

## Troubleshooting

### Error: "Failed to fetch"
- Check that your Supabase project is not paused (free tier projects pause after 7 days)
- Go to Supabase Dashboard → Your Project → Check status
- If paused, click "Resume"

### Error: "Table doesn't exist"
- Make sure you ran the SQL script in Step 4
- Check in Table Editor that `entries` table exists

### Error: "Row Level Security policy violation"
- Make sure you created the RLS policy in Step 4
- The policy allows all operations for development

### Error: "Invalid API key"
- Double-check you copied the `anon` `public` key, not the `service_role` key
- Make sure there are no extra spaces in `.env.local`
- Restart your dev server after changing `.env.local`

---

## Database Schema Reference

### `entries` Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | TEXT | Unique identifier (PRIMARY KEY) |
| `timestamp` | TIMESTAMPTZ | When the entry was created |
| `username` | TEXT | User who made the entry |
| `amount` | TEXT | Selected amount tier (1000, 5000, 10000) |
| `image` | TEXT | Optional image URL |
| `prize` | INTEGER | Prize won (number or 0 for sports ticket) |
| `created_at` | TIMESTAMPTZ | Auto-generated timestamp |

### Indexes
- `entries_timestamp_idx` - For sorting by time
- `entries_created_at_idx` - For sorting by creation
- `entries_username_idx` - For filtering by user
- `entries_amount_idx` - For filtering by amount

---

## Security Considerations (For Production)

When deploying to production, consider updating the RLS policy:

```sql
-- Remove the allow-all policy
DROP POLICY "Allow all operations" ON entries;

-- Add more restrictive policies
-- Example: Only allow authenticated users to insert
CREATE POLICY "Authenticated users can insert" ON entries
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Example: Everyone can read
CREATE POLICY "Anyone can read" ON entries
  FOR SELECT
  USING (true);

-- Example: Only admins can delete
CREATE POLICY "Only admins can delete" ON entries
  FOR DELETE
  USING (auth.role() = 'service_role');
```

---

## Next Steps After Setup

1. Test all admin panel features
2. Create real user entries through the slot machine
3. Monitor database usage in Supabase Dashboard
4. Set up email notifications (optional)
5. Configure backup policies (Supabase has automatic backups on paid plans)

---

## Support

If you encounter issues:
- Check Supabase documentation: https://supabase.com/docs
- View Supabase logs: Project → Logs
- Check project status: Project → Settings → General
