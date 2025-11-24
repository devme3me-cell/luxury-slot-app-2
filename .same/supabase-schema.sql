-- Luxury Slot App - Database Schema
-- Run this in your Supabase SQL Editor

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
-- ⚠️ For production, consider more restrictive policies
CREATE POLICY "Allow all operations" ON entries
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Verify table was created
SELECT
  table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_name = 'entries'
ORDER BY ordinal_position;
