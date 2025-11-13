import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'x-client-info': 'supabase-js-web',
    },
  },
});

export interface Entry {
  id: string;
  timestamp: string;
  username: string;
  amount: string;
  image: string;
  prize: number;
  created_at?: string;
}

// Connection test
export async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('entries')
      .select('id')
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      console.error('Connection test error:', error);
      return { success: false, message: error.message };
    }

    return { success: true, message: 'Connected successfully' };
  } catch (error) {
    console.error('Connection test exception:', error);
    return { success: false, message: String(error) };
  }
}

// Entry operations
export async function saveEntry(entry: Omit<Entry, 'created_at'>) {
  const { data, error } = await supabase
    .from('entries')
    .insert([entry])
    .select();

  if (error) {
    console.error('Error saving entry:', error);
    throw error;
  }

  return data;
}

export async function getEntries(limit = 100) {
  try {
    const { data, error } = await supabase
      .from('entries')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching entries:', error);
      return [];
    }

    return data as Entry[];
  } catch (error) {
    console.error('Error in getEntries:', error);
    return [];
  }
}

export async function deleteEntry(id: string) {
  const { error } = await supabase
    .from('entries')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting entry:', error);
    throw error;
  }

  return true;
}

export async function clearAllEntries() {
  const { error } = await supabase
    .from('entries')
    .delete()
    .neq('id', '');

  if (error) {
    console.error('Error clearing entries:', error);
    throw error;
  }

  return true;
}

export async function getTodayEntries() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString();

  try {
    const { data, error } = await supabase
      .from('entries')
      .select('*')
      .gte('timestamp', todayStr)
      .order('timestamp', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching today entries:', error);
      return [];
    }

    return data as Entry[];
  } catch (error) {
    console.error('Error in getTodayEntries:', error);
    return [];
  }
}
