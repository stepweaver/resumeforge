import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create a safe client that handles missing environment variables
let supabase = null;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.warn('Supabase environment variables are not set. Please check your .env.local file.');
  // Create a mock client for development
  supabase = {
    from: () => ({
      select: () => ({
        limit: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } })
      })
    })
  };
}

export { supabase }; 