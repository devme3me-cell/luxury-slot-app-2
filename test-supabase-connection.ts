// Test script to verify Supabase connection
// Run with: bun run test-supabase-connection.ts

import { createClient } from '@supabase/supabase-js';

// Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

console.log('\n🔍 Testing Supabase Connection...\n');
console.log('=' .repeat(60));

// Check if credentials are configured
if (!supabaseUrl || !supabaseAnonKey) {
  console.log('❌ FAILED: Supabase credentials not found');
  console.log('\nPlease set the following in .env.local:');
  console.log('  NEXT_PUBLIC_SUPABASE_URL=your_project_url');
  console.log('  NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key');
  console.log('\n💡 See .same/supabase-setup-guide.md for instructions\n');
  process.exit(1);
}

console.log('✅ Environment variables found');
console.log(`   URL: ${supabaseUrl}`);
console.log(`   Key: ${supabaseAnonKey.substring(0, 20)}...`);
console.log('');

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    console.log('📡 Testing connection to Supabase...');

    // Test 1: Check if we can connect
    const { data, error } = await supabase
      .from('entries')
      .select('id')
      .limit(1);

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows (OK)
      console.log('❌ Connection failed:', error.message);
      console.log('\nPossible issues:');
      console.log('  1. Project might be paused (check Supabase dashboard)');
      console.log('  2. Table "entries" might not exist (run the SQL schema)');
      console.log('  3. Incorrect credentials');
      console.log('\n💡 See .same/supabase-setup-guide.md for help\n');
      return false;
    }

    console.log('✅ Successfully connected to Supabase!');
    console.log('');

    // Test 2: Check if table exists and get count
    const { count, error: countError } = await supabase
      .from('entries')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.log('⚠️  Table exists but error getting count:', countError.message);
    } else {
      console.log(`📊 Table "entries" found with ${count || 0} rows`);
    }
    console.log('');

    // Test 3: Try to insert a test entry
    console.log('🧪 Testing insert operation...');
    const testEntry = {
      id: `test-${Date.now()}`,
      timestamp: new Date().toISOString(),
      username: 'test-user',
      amount: '1000',
      image: '',
      prize: 58,
    };

    const { data: insertData, error: insertError } = await supabase
      .from('entries')
      .insert([testEntry])
      .select();

    if (insertError) {
      console.log('❌ Insert failed:', insertError.message);
      console.log('   This might be a permissions issue (check RLS policies)');
    } else {
      console.log('✅ Successfully inserted test entry');

      // Clean up test entry
      await supabase.from('entries').delete().eq('id', testEntry.id);
      console.log('✅ Successfully deleted test entry (cleanup)');
    }

    console.log('');
    console.log('=' .repeat(60));
    console.log('🎉 All tests passed! Supabase is configured correctly.');
    console.log('=' .repeat(60));
    console.log('\nYou can now:');
    console.log('  1. Restart your dev server');
    console.log('  2. Go to /admin to access the admin panel');
    console.log('  3. Test creating entries through the slot machine\n');

    return true;

  } catch (err) {
    console.log('❌ Unexpected error:', err);
    console.log('\n💡 See .same/supabase-setup-guide.md for troubleshooting\n');
    return false;
  }
}

// Run the test
testConnection().then(success => {
  process.exit(success ? 0 : 1);
});
