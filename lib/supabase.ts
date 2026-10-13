import { createClient } from '@supabase/supabase-js';

export function getSupabaseConfig() {
  let url = '';
  let key = '';

  // 1. Check localStorage if available in browser
  if (typeof window !== 'undefined') {
    try {
      url = localStorage.getItem('supabase_url') || '';
      key = localStorage.getItem('supabase_anon_key') || '';
    } catch {}
  }

  // 2. Check Vite / Next environment variables
  if (!url) {
    url = (typeof import.meta !== 'undefined' && (import.meta.env?.VITE_SUPABASE_URL || import.meta.env?.NEXT_PUBLIC_SUPABASE_URL)) ||
          (typeof process !== 'undefined' && (process.env?.VITE_SUPABASE_URL || process.env?.NEXT_PUBLIC_SUPABASE_URL || process.env?.SUPABASE_URL)) ||
          '';
  }

  if (!key) {
    key = (typeof import.meta !== 'undefined' && (import.meta.env?.VITE_SUPABASE_ANON_KEY || import.meta.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY)) ||
          (typeof process !== 'undefined' && (process.env?.VITE_SUPABASE_ANON_KEY || process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env?.SUPABASE_ANON_KEY)) ||
          '';
  }

  url = (url || '').trim().replace(/\/+$/, '').replace(/\n/g, '');
  key = (key || '').trim().replace(/\n/g, '');

  return { url, key };
}

export function isSupabaseConfigured(): boolean {
  const { url, key } = getSupabaseConfig();
  return Boolean(
    url &&
    url.startsWith('http') &&
    !url.includes('xyzcompany') &&
    !url.includes('placeholder') &&
    key &&
    key !== 'dummy_key' &&
    key !== 'placeholder-anon-key'
  );
}

export function saveSupabaseCredentials(newUrl: string, newKey: string) {
  if (typeof window !== 'undefined') {
    try {
      if (newUrl) localStorage.setItem('supabase_url', newUrl.trim());
      else localStorage.removeItem('supabase_url');

      if (newKey) localStorage.setItem('supabase_anon_key', newKey.trim());
      else localStorage.removeItem('supabase_anon_key');
    } catch {}
  }
}

const { url, key } = getSupabaseConfig();

// Safe fallback URL that won't throw invalid URL errors during createClient initialization
const clientUrl = (url && url.startsWith('http')) ? url : 'https://placeholder.supabase.co';
const clientKey = key || 'placeholder-anon-key';

export const supabase = createClient(clientUrl, clientKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  db: {
    schema: 'public',
  }
});

export default supabase;
