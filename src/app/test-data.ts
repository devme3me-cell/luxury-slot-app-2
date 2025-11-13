import { supabase } from '@/lib/supabase';

// Test data generator for admin panel demonstration
export const generateTestData = async () => {
  const testEntries = [
    {
      id: 'entry_test_001',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      username: 'player001',
      amount: '1000',
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzMzMyIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iI2ZmZDcwMCIgZm9udC1zaXplPSIyMCI+U2FtcGxlIFJlY2VpcHQ8L3RleHQ+Cjwvc3ZnPg==',
      prize: 58
    },
    {
      id: 'entry_test_002',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      username: 'luckystar88',
      amount: '5000',
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzQ0NCIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iI2ZmYTUwMCIgZm9udC1zaXplPSIyMCI+RGVwb3NpdCBQcm9vZjwvdGV4dD4KPC9zdmc+',
      prize: 168
    },
    {
      id: 'entry_test_003',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
      username: 'winner2025',
      amount: '10000',
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzU1NSIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iI2ZmNjM0NyIgZm9udC1zaXplPSIyMCI+VHJhbnNhY3Rpb248L3RleHQ+Cjwvc3ZnPg==',
      prize: 666
    },
    {
      id: 'entry_test_004',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // Yesterday
      username: 'testuser123',
      amount: '1000',
      image: '',
      prize: 58
    },
    {
      id: 'entry_test_005',
      timestamp: new Date().toISOString(), // Just now
      username: 'newplayer',
      amount: '5000',
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzY2NiIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iI2ZmZDcwMCIgZm9udC1zaXplPSIyMCI+UGF5bWVudDwvdGV4dD4KPC9zdmc+',
      prize: 58
    }
  ];

  try {
    // Check if entries already exist
    const { data: existingEntries } = await supabase
      .from('entries')
      .select('id')
      .limit(1);

    if (!existingEntries || existingEntries.length === 0) {
      // Only add test data if no entries exist
      const { error } = await supabase
        .from('entries')
        .insert(testEntries);

      if (error) {
        console.error('Error generating test data:', error);
        return false;
      }

      console.log('Test data generated successfully!');
      return true;
    }
    console.log('Entries already exist, skipping test data generation.');
    return false;
  } catch (error) {
    console.error('Error in generateTestData:', error);
    return false;
  }
};
