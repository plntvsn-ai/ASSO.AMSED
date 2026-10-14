/**
 * Unified Site Settings Service for AMSED
 * Provides resilient, permanent persistence across:
 * 1. LocalStorage (instant cache, protected against default resets)
 * 2. Firebase Firestore ('siteSettings/main')
 * 3. Supabase Database ('site_settings' table)
 * 4. Serverless API ('/api/settings')
 */

import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export const DEFAULT_SITE_SETTINGS = {
  id: 1,
  association_full_name: 'جمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة',
  association_short_name: 'AMSED',
  site_title: 'جمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة - AMSED',
  association_subtitle: 'لرعاية أطفال التوحد وفي وضعية صعبة • القنيطرة',
  association_name_style: 'andalusian',
  address: 'SAKNIA 30 LOT EL HIZAM LOTISSEMENT EL HIZAM KENITRA',
  city: 'Kenitra',
  email: 'asso.amsed@gmail.com',
  phone1: '06 54 24 05 23',
  phone2: '06 63 78 01 07',
  phone3: '',
  working_hours: 'الإثنين - الجمعة: 08:30 إلى 17:00 | السبت: 09:00 إلى 13:00',
  lat: '34.250676',
  lng: '-6.540316',
  top_bar_title: 'مصلحة عمومية وطنية ذات أهداف إنسانية وتضامنية',
  show_donations: false,
  show_bank: false,
  show_stats: true,
  logo_url: '/logo_amesd_original_transparent.png'
};

const STORAGE_KEY = 'site_settings';

/**
 * Synchronously retrieves current site settings from localStorage
 * Unwraps nested responses and merges with defaults.
 */
export function getLocalSiteSettings() {
  if (typeof window === 'undefined') return DEFAULT_SITE_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SITE_SETTINGS;
    
    let parsed = JSON.parse(raw);
    // Unwrap if wrapped in api response { success: true, data: { ... } }
    if (parsed && parsed.data && typeof parsed.data === 'object') {
      parsed = parsed.data;
    }

    return {
      ...DEFAULT_SITE_SETTINGS,
      ...parsed,
      show_donations: parsed.show_donations !== undefined ? Boolean(parsed.show_donations) : (parsed.show_donation !== undefined ? Boolean(parsed.show_donation) : DEFAULT_SITE_SETTINGS.show_donations),
      show_bank: parsed.show_bank !== undefined ? Boolean(parsed.show_bank) : DEFAULT_SITE_SETTINGS.show_bank,
      show_stats: parsed.show_stats !== undefined ? Boolean(parsed.show_stats) : DEFAULT_SITE_SETTINGS.show_stats
    };
  } catch (err) {
    console.warn('Failed to parse local site_settings:', err);
    return DEFAULT_SITE_SETTINGS;
  }
}

/**
 * Loads settings asynchronously from Firestore -> Supabase -> API
 * Crucially: NEVER lets fallback default settings overwrite existing user saved settings!
 */
export async function loadSiteSettingsAsync() {
  let settings = getLocalSiteSettings();
  const hasUserSaved = Boolean(settings?._user_saved);

  // 1. Try Firestore siteSettings/main
  if (db) {
    try {
      const snap = await getDoc(doc(db, 'siteSettings', 'main'));
      if (snap && snap.exists()) {
        const fsData = snap.data();
        if (fsData && typeof fsData === 'object') {
          settings = { ...settings, ...fsData };
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
          } catch {}
        }
      }
    } catch (fsErr) {
      console.warn('Firestore load siteSettings notice:', fsErr);
    }
  }

  // 2. Try Supabase direct if configured
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.from('site_settings').select('*').eq('id', 1).single();
      if (!error && data) {
        settings = { ...settings, ...data };
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        } catch {}
      }
    } catch (sbErr) {
      console.warn('Supabase load siteSettings notice:', sbErr);
    }
  }

  // 3. Try /api/settings ONLY if source === 'supabase' or if user never saved custom settings
  try {
    const apiRes = await fetch('/api/settings');
    if (apiRes.ok) {
      const apiJson = await apiRes.json();
      // If server has real database connection (source === 'supabase')
      if (apiJson?.source === 'supabase' && apiJson?.data) {
        settings = { ...settings, ...apiJson.data };
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        } catch {}
      } else if (!hasUserSaved && apiJson?.data) {
        // Only if user never saved custom settings, accept default api response
        settings = { ...DEFAULT_SITE_SETTINGS, ...apiJson.data };
      }
    }
  } catch (apiErr) {
    console.warn('API /api/settings notice:', apiErr);
  }

  return settings;
}

/**
 * Saves site settings permanently across all layers
 */
export async function saveSiteSettingsAsync(formValues) {
  const cleanPayload = {
    ...DEFAULT_SITE_SETTINGS,
    ...formValues,
    _user_saved: true,
    updated_at: new Date().toISOString()
  };

  // Strip id and created_at for db compatibility
  const { id, created_at, ...dataToSave } = cleanPayload;

  // 1. Save to LocalStorage immediately
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanPayload));

    // Also sync to CMS database
    const rawCms = localStorage.getItem('amsed_cms_database_v3');
    const cmsObj = rawCms ? JSON.parse(rawCms) : {};
    if (!cmsObj.contact) cmsObj.contact = {};
    if (!cmsObj.logo) cmsObj.logo = {};

    cmsObj.association_full_name = cleanPayload.association_full_name;
    cmsObj.association_subtitle = cleanPayload.association_subtitle;
    cmsObj.top_bar_title = cleanPayload.top_bar_title;
    cmsObj.logo.name = cleanPayload.association_full_name;
    cmsObj.logo.motto = cleanPayload.top_bar_title || "الله • الوطن • الملك";
    if (cleanPayload.logo_url) cmsObj.logo.url = cleanPayload.logo_url;
    cmsObj.contact.phone1 = cleanPayload.phone1 || cleanPayload.phone;
    cmsObj.contact.phone2 = cleanPayload.phone2;
    cmsObj.contact.phone3 = cleanPayload.phone3;
    cmsObj.contact.lat = cleanPayload.lat;
    cmsObj.contact.lng = cleanPayload.lng;
    cmsObj.contact.mapUrl = `https://www.google.com/maps?q=${cleanPayload.lat || '34.250676'},${cleanPayload.lng || '-6.540316'}`;

    localStorage.setItem('amsed_cms_database_v3', JSON.stringify(cmsObj));

    // Broadcast change
    window.dispatchEvent(new Event('cms-update'));
    window.dispatchEvent(new Event('storage'));
  } catch (e) {
    console.warn('LocalStorage save error:', e);
  }

  // 2. Save to Firestore
  if (db) {
    try {
      await setDoc(doc(db, 'siteSettings', 'main'), {
        ...cleanPayload,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (fsErr) {
      console.warn('Firestore setDoc notice:', fsErr);
    }
  }

  // 3. Save via Serverless API
  try {
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataToSave)
    });
  } catch (apiErr) {
    console.warn('API save notice:', apiErr);
  }

  // 4. Save to Supabase direct if configured
  if (isSupabaseConfigured()) {
    try {
      await supabase.from('site_settings').update(dataToSave).eq('id', 1);
    } catch (sbErr) {
      console.warn('Supabase direct update notice:', sbErr);
    }
  }

  return cleanPayload;
}
