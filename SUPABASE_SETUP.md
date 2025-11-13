# Supabase Setup Instructions

## 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com)
2. Sign in and create a new project
3. Note down your project URL and anon key

## 2. Create the Database Table

Go to the SQL Editor in your Supabase dashboard and run this SQL:

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

-- Create index for faster queries
CREATE INDEX idx_entries_timestamp ON entries(timestamp DESC);
CREATE INDEX idx_entries_created_at ON entries(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE entries ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (you can customize this for production)
CREATE POLICY "Allow all operations on entries" ON entries
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

## 3. Configure Environment Variables

Update the `.env.local` file with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 4. Test the Connection

After setting up, run the app locally to test:

```bash
bun run dev
```

## 5. Deploy to Zeabur

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Go to [Zeabur](https://zeabur.com)
3. Create a new project
4. Connect your Git repository
5. Add environment variables in Zeabur dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Deploy!

## Database Schema

### entries table

| Column | Type | Description |
|--------|------|-------------|
| id | TEXT | Unique identifier (PRIMARY KEY) |
| timestamp | TEXT | ISO timestamp of the entry |
| username | TEXT | User's account name |
| amount | TEXT | Deposit amount (1000, 5000, or 10000) |
| image | TEXT | Base64 encoded image or URL |
| prize | INTEGER | Prize won (0 for signature, or prize amount) |
| created_at | TIMESTAMP | Auto-generated timestamp |
