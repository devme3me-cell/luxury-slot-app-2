# Luxury Slot App - Configuration Files

This folder contains helpful guides and scripts for configuring your luxury slot app.

## 📚 Documentation

- **[supabase-setup-guide.md](./supabase-setup-guide.md)** - Complete step-by-step guide for setting up Supabase
- **[supabase-schema.sql](./supabase-schema.sql)** - SQL schema to copy and run in Supabase
- **[test-results.md](./test-results.md)** - Prize distribution test results
- **[changes-summary.md](./changes-summary.md)** - Summary of all recent changes

## 🚀 Quick Start - Supabase Setup

### 1. Create Supabase Project
1. Go to https://supabase.com
2. Create a new project (free tier is fine)
3. Wait ~2 minutes for setup

### 2. Get Credentials
1. Go to Project Settings → API
2. Copy:
   - Project URL
   - `anon` `public` API key

### 3. Configure App
Edit `.env.local` in project root:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

### 4. Create Database
1. In Supabase, go to SQL Editor
2. Copy all SQL from `supabase-schema.sql`
3. Run it

### 5. Test Connection
```bash
bun run test-supabase-connection.ts
```

If successful, restart your dev server and go to `/admin`!

## 🧪 Testing Tools

### Test Supabase Connection
```bash
cd /home/project/luxury-slot-app-2
bun run test-supabase-connection.ts
```

This will:
- ✅ Verify credentials are configured
- ✅ Test connection to Supabase
- ✅ Check if table exists
- ✅ Test insert/delete operations

### Test Prize Distribution
See `test-results.md` for comprehensive test results showing all prize tiers work correctly.

## 📊 Current Prize Configuration

### 今日$1,000
- 💰 58獎金 - 80%
- 💎 168獎金 - 10%
- 🏀 精準體育單 - 9%
- 🎰 388獎金 - 1%

### 今日$5,000
- 💰 188獎金 - 80%
- 💎 388獎金 - 10%
- 🏀 精準體育單 - 9%
- 🎰 888獎金 - 1%

### 今日$10,000
- 💰 388獎金 - 80%
- 💎 666獎金 - 10%
- 🏀 精準體育單 - 9%
- 🎰 1888獎金 - 1%

## 🔐 Admin Panel Access

**URL:** `/admin`

**Login:**
- Username: `chitu2025`
- Password: `1234567890`

**Features:**
- View all entries
- Filter by date/user/amount
- Delete entries
- Export to CSV
- Generate test data
- View statistics

## 📝 Notes

- The `.env.local` file is gitignored for security
- Supabase free tier is sufficient for development and small-scale production
- Free tier projects pause after 7 days of inactivity (just click "Resume")
- All database functions gracefully handle missing Supabase configuration

## 🆘 Troubleshooting

See `supabase-setup-guide.md` for detailed troubleshooting steps.

Common issues:
- **"Failed to fetch"** → Project might be paused
- **"Table doesn't exist"** → Run the SQL schema
- **"Invalid API key"** → Check credentials in `.env.local`
