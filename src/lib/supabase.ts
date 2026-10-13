import { createClient } from '@supabase/supabase-js'

function getEnv(key: string): string {
  try {
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta?.env && import.meta.env[key]) {
      // @ts-ignore
      return import.meta.env[key]
    }
  } catch {}
  try {
    if (typeof process !== 'undefined' && process?.env && process.env[key]) {
      return process.env[key] || ''
    }
  } catch {}
  return ''
}

const supabaseUrl = getEnv('NEXT_PUBLIC_SUPABASE_URL') || getEnv('VITE_SUPABASE_URL') || getEnv('SUPABASE_URL') || 'https://xyzcompany.supabase.co'
const supabaseAnonKey = getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY') || getEnv('VITE_SUPABASE_ANON_KEY') || getEnv('SUPABASE_ANON_KEY') || getEnv('SUPABASE_SERVICE_ROLE_KEY') || 'dummy_key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default supabase
