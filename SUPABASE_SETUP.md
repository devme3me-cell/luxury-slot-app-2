# Supabase Setup Guide

## Issue: Database Timeout Errors

If you're seeing timeout errors when loading data in the admin dashboard, follow these steps:

### 1. Check Supabase Project Status

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Check if the project is **paused** (free tier projects pause after 7 days of inactivity)
4. If paused, click **Resume** to restart it

### 2. Create the Database Table

The app needs an `entries` table with the following schema:

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

-- Create index on timestamp for faster queries
CREATE INDEX IF NOT EXISTS entries_timestamp_idx ON entries(timestamp DESC);

-- Create index on created_at
CREATE INDEX IF NOT EXISTS entries_created_at_idx ON entries(created_at DESC);
```

### 3. Run the SQL in Supabase

1. Go to your Supabase project dashboard
2. Click on **SQL Editor** in the left sidebar
3. Copy and paste the SQL code above
4. Click **Run** to execute it

### 4. Enable Row Level Security (Optional)

If you want to secure your data:

```sql
-- Enable RLS
ALTER TABLE entries ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow all operations (for testing)
CREATE POLICY "Allow all operations" ON entries
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

### 5. Verify Environment Variables

Make sure your `.env.local` file has the correct values:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

You can find these in: Supabase Dashboard → Project Settings → API

### 6. Test the Connection

1. Go to the admin page (`/admin`)
2. Log in with credentials: `chitu2025` / `1234567890`
3. Click **生成測試資料** to generate test data
4. You should see 5 test entries appear

### Troubleshooting

If you still see timeout errors:

1. **Check table exists**: In SQL Editor, run `SELECT * FROM entries LIMIT 1;`
2. **Check indexes**: Run `SELECT * FROM pg_indexes WHERE tablename = 'entries';`
3. **Clear old data**: If table is very large, consider archiving old entries
4. **Upgrade plan**: Free tier has query limits; consider upgrading if needed

### Common Error Codes

- `57014` - Statement timeout (query took too long)
- `PGRST116` - No rows returned (table is empty, this is OK)
- `42P01` - Table doesn't exist
