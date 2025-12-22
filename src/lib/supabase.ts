import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
// Hỗ trợ cả publishable key và anon key
const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY

// Debug: Log environment variables (remove in production)
if (import.meta.env.DEV) {
  console.log('Supabase URL:', supabaseUrl ? 'Found' : 'Missing')
  console.log('Supabase Key:', supabaseKey ? 'Found' : 'Missing')
}

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file.\n' +
    `VITE_SUPABASE_URL: ${supabaseUrl ? 'Found' : 'Missing'}\n` +
    `VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY: ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY ? 'Found' : 'Missing'}\n` +
    `VITE_SUPABASE_ANON_KEY: ${import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Found' : 'Missing'}\n` +
    'Required: VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY (or VITE_SUPABASE_ANON_KEY)'
  )
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

// Type helper để sử dụng với TypeScript
export type Database = any // Sẽ được thay thế bằng types tự động generate từ Supabase

