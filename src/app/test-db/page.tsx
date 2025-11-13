'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestDB() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setResult('Testing connection...\n');
    
    try {
      setResult(prev => prev + '\n[Test 1] Checking if table exists...\n');
      const { data: tableCheck, error: tableError } = await supabase
        .from('entries')
        .select('id')
        .limit(1);
      
      if (tableError) {
        setResult(prev => prev + `❌ Error: ${tableError.message}\nCode: ${tableError.code}\n`);
      } else {
        setResult(prev => prev + `✅ Table exists! Found ${tableCheck?.length || 0} rows\n`);
      }

      setResult(prev => prev + '\n[Test 2] Counting total rows...\n');
      const { count, error: countError } = await supabase
        .from('entries')
        .select('*', { count: 'exact', head: true });
      
      if (countError) {
        setResult(prev => prev + `❌ Count error: ${countError.message}\n`);
      } else {
        setResult(prev => prev + `✅ Total rows: ${count}\n`);
      }

      setResult(prev => prev + '\n[Test 3] Fetching latest entry...\n');
      const { data: latest, error: latestError } = await supabase
        .from('entries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (latestError) {
        setResult(prev => prev + `❌ Query error: ${latestError.message}\n`);
      } else if (latest && latest.length > 0) {
        setResult(prev => prev + `✅ Latest entry:\n${JSON.stringify(latest[0], null, 2)}\n`);
      } else {
        setResult(prev => prev + `⚠️ No entries found (table is empty)\n`);
      }

      setResult(prev => prev + '\n[Test 4] Connection info...\n');
      setResult(prev => prev + `Supabase URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL}\n`);

    } catch (error) {
      setResult(prev => prev + `\n❌ Exception: ${error}\n`);
    }
    
    setLoading(false);
  };

  const insertTestEntry = async () => {
    setLoading(true);
    setResult('Inserting test entry...\n');
    
    try {
      const testEntry = {
        id: `test_${Date.now()}`,
        timestamp: new Date().toISOString(),
        username: 'test_user',
        amount: '1000',
        image: '',
        prize: 58
      };

      const { data, error } = await supabase
        .from('entries')
        .insert([testEntry])
        .select();

      if (error) {
        setResult(prev => prev + `❌ Insert error: ${error.message}\nCode: ${error.code}\n`);
      } else {
        setResult(prev => prev + `✅ Entry inserted successfully!\n${JSON.stringify(data, null, 2)}\n`);
      }
    } catch (error) {
      setResult(prev => prev + `❌ Exception: ${error}\n`);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-yellow-500 mb-6">Database Connection Test</h1>
        
        <div className="flex gap-4 mb-6">
          <button
            onClick={testConnection}
            disabled={loading}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition"
          >
            {loading ? 'Testing...' : 'Run Connection Test'}
          </button>
          
          <button
            onClick={insertTestEntry}
            disabled={loading}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition"
          >
            Insert Test Entry
          </button>
        </div>

        <div className="bg-black/50 rounded-lg p-6 font-mono text-sm text-green-400 whitespace-pre-wrap min-h-96 border border-green-500/30">
          {result || 'Click "Run Connection Test" to start...'}
        </div>
      </div>
    </div>
  );
}
