-- ========================================
-- Supabase Timeout Fix Script
-- ========================================
-- Run this in Supabase SQL Editor to fix timeout issues

-- Step 1: Check if table exists
SELECT EXISTS (
   SELECT FROM information_schema.tables
   WHERE table_schema = 'public'
   AND table_name = 'entries'
);

-- Step 2: Create table if it doesn't exist
CREATE TABLE IF NOT EXISTS entries (
  id TEXT PRIMARY KEY,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  username TEXT NOT NULL,
  amount TEXT NOT NULL,
  image TEXT,
  prize INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 3: Drop old inefficient indexes if they exist
DROP INDEX IF EXISTS idx_entries_timestamp;
DROP INDEX IF EXISTS idx_entries_created_at;

-- Step 4: Create optimized indexes
CREATE INDEX IF NOT EXISTS entries_timestamp_idx
  ON entries(timestamp DESC)
  WHERE timestamp IS NOT NULL;

CREATE INDEX IF NOT EXISTS entries_created_at_idx
  ON entries(created_at DESC)
  WHERE created_at IS NOT NULL;

-- Step 5: Create a composite index for common queries
CREATE INDEX IF NOT EXISTS entries_timestamp_id_idx
  ON entries(timestamp DESC, id);

-- Step 6: Enable Row Level Security
ALTER TABLE entries ENABLE ROW LEVEL SECURITY;

-- Step 7: Drop old policies if they exist
DROP POLICY IF EXISTS "Allow all operations" ON entries;
DROP POLICY IF EXISTS "Allow all operations on entries" ON entries;

-- Step 8: Create new policy for all operations
CREATE POLICY "Allow all operations" ON entries
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Step 9: Analyze table for query optimization
ANALYZE entries;

-- Step 10: Verify setup
SELECT
  'Table exists' as status,
  COUNT(*) as total_rows
FROM entries;

-- Check indexes
SELECT
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'entries'
ORDER BY indexname;
