'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';

export default function SupabaseTest() {
  const [status, setStatus] = useState('Testing connection...');
  const [error, setError] = useState(null);

  useEffect(() => {
    async function testConnection() {
      try {
        // Test basic connection
        const { data, error } = await supabase.from('profiles').select('*').limit(1);

        if (error) {
          setError(`Connection error: ${error.message}`);
          setStatus('❌ Connection failed');
        } else {
          setStatus('✅ Supabase connection successful!');
          console.log('Supabase test successful:', data);
        }
      } catch (err) {
        setError(`Unexpected error: ${err.message}`);
        setStatus('❌ Connection failed');
        console.error('Connection error:', err);
      }
    }

    testConnection();
  }, []);

  return (
    <div className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
      <h3 className="font-semibold mb-2">Supabase Connection Test</h3>
      <p className="text-sm">{status}</p>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 mt-2">
          {error}
        </p>
      )}
    </div>
  );
}