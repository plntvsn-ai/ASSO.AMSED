import { createClient } from '@supabase/supabase-js'

let url = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
          (typeof import.meta !== 'undefined' && import.meta.env?.NEXT_PUBLIC_SUPABASE_URL) ||
          (typeof process !== 'undefined' && (process.env?.VITE_SUPABASE_URL || process.env?.NEXT_PUBLIC_SUPABASE_URL || process.env?.SUPABASE_URL)) ||
          ''

let key = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
          (typeof import.meta !== 'undefined' && import.meta.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
          (typeof process !== 'undefined' && (process.env?.VITE_SUPABASE_ANON_KEY || process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env?.SUPABASE_ANON_KEY)) ||
          ''

// كنحيدو أي مسافة و أي / فالآخر - هادا هو اللي كيدير PGRST125
url = url.trim().replace(/\/+$/, '').replace(/\n/g, '')
key = key.trim().replace(/\n/g, '')

console.log('Supabase URL used:', url)

if (!url) {
  console.error('VITE_SUPABASE_URL خاوي!')
}

export const supabase = createClient(url || 'https://xyzcompany.supabase.co', key || 'dummy_key', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  db: {
    schema: 'public',
  }
})

export default supabase
