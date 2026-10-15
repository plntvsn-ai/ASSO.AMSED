/**
 * Unified Site Settings Service for AMSED
 * Provides resilient, permanent persistence across:
 * 1. LocalStorage (instant cache, protected against default resets)
 * 2. Firebase Firestore ('siteSettings/main' & 'settings/cmsConfig')
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
  association_name_style: 'royal_3d_red_gold',
  address: 'SAKNIA 30 LOT EL HIZAM LOTISSEMENT EL HIZAM KENITRA',
  address_ar: 'SAKNIA 30 LOT EL HIZAM LOTISSEMENT EL HIZAM KENITRA',
  city: 'Kenitra',
  email: 'asso.amsed@gmail.com',
  phone1: '06 54 24 05 23',
  phone2: '06 63 78 01 07',
  phone3: '',
  phone: '06 54 24 05 23',
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

    const addr = parsed.address || parsed.address_ar || DEFAULT_SITE_SETTINGS.address;
    const ph1 = parsed.phone1 || parsed.phone || DEFAULT_SITE_SETTINGS.phone1;

    return {
      ...DEFAULT_SITE_SETTINGS,
      ...parsed,
      address: addr,
      address_ar: addr,
      phone: ph1,
      phone1: ph1,
      association_full_display: parsed.association_full_name || DEFAULT_SITE_SETTINGS.association_full_name,
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
          // If Firestore data is marked as user saved, or if local has no saved edits
          if (fsData._user_saved || !hasUserSaved) {
            settings = { ...settings, ...fsData };
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
            } catch {}
          }
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
        if (data._user_saved || !hasUserSaved) {
          settings = { ...settings, ...data };
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
          } catch {}
        }
      }
    } catch (sbErr) {
      console.warn('Supabase load siteSettings notice:', sbErr);
    }
  }

  // 3. Try /api/settings ONLY if source === 'supabase'
  try {
    const apiRes = await fetch('/api/settings');
    if (apiRes.ok) {
      const apiJson = await apiRes.json();
      if (apiJson?.source === 'supabase' && apiJson?.data) {
        if (apiJson.data._user_saved || !hasUserSaved) {
          settings = { ...settings, ...apiJson.data };
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
          } catch {}
        }
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
  const addr = formValues.address || formValues.address_ar || DEFAULT_SITE_SETTINGS.address;
  const ph1 = formValues.phone1 || formValues.phone || DEFAULT_SITE_SETTINGS.phone1;

  const cleanPayload = {
    ...DEFAULT_SITE_SETTINGS,
    ...formValues,
    address: addr,
    address_ar: addr,
    phone: ph1,
    phone1: ph1,
    association_full_display: formValues.association_full_name || DEFAULT_SITE_SETTINGS.association_full_name,
    _user_saved: true,
    saved_at: Date.now(),
    updated_at: new Date().toISOString()
  };

  // Strip id and created_at for db compatibility
  const { id, created_at, ...dataToSave } = cleanPayload;

  // 1. Save to LocalStorage 'site_settings' immediately
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanPayload));

    // 2. Sync to CMS database (amsed_cms_database_v3)
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
    cmsObj.contact.address = cleanPayload.address;
    cmsObj.contact.phone1 = cleanPayload.phone1;
    cmsObj.contact.phone2 = cleanPayload.phone2;
    cmsObj.contact.phone3 = cleanPayload.phone3;
    cmsObj.contact.email = cleanPayload.email;
    cmsObj.contact.working_hours = cleanPayload.working_hours;
    cmsObj.contact.lat = cleanPayload.lat;
    cmsObj.contact.lng = cleanPayload.lng;
    cmsObj.contact.mapUrl = `https://www.google.com/maps?q=${cleanPayload.lat || '34.250676'},${cleanPayload.lng || '-6.540316'}`;

    localStorage.setItem('amsed_cms_database_v3', JSON.stringify(cmsObj));

    // 3. Sync to DataContext database (amsed_association_database_v2)
    const rawData = localStorage.getItem('amsed_association_database_v2');
    const dataObj = rawData ? JSON.parse(rawData) : {};
    if (!dataObj.association) dataObj.association = {};
    dataObj.association.name = cleanPayload.association_full_name;
    dataObj.association.title = cleanPayload.association_full_name;
    dataObj.association.subtitle = cleanPayload.association_subtitle;
    dataObj.association.address = cleanPayload.address;
    dataObj.association.phone1 = cleanPayload.phone1;
    dataObj.association.phone2 = cleanPayload.phone2;
    dataObj.association.phone3 = cleanPayload.phone3;
    dataObj.association.email = cleanPayload.email;
    dataObj.association.working_hours = cleanPayload.working_hours;
    dataObj.association.lat = cleanPayload.lat;
    dataObj.association.lng = cleanPayload.lng;
    localStorage.setItem('amsed_association_database_v2', JSON.stringify(dataObj));

    // Broadcast change to all active components
    window.dispatchEvent(new Event('cms-update'));
    window.dispatchEvent(new Event('storage'));
  } catch (e) {
    console.warn('LocalStorage save error:', e);
  }

  // 4. Save to Firestore siteSettings/main & settings/cmsConfig
  if (db) {
    try {
      await setDoc(doc(db, 'siteSettings', 'main'), {
        ...cleanPayload,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      await setDoc(doc(db, 'settings', 'cmsConfig'), {
        association_full_name: cleanPayload.association_full_name,
        association_subtitle: cleanPayload.association_subtitle,
        top_bar_title: cleanPayload.top_bar_title,
        contact: {
          address: cleanPayload.address,
          phone1: cleanPayload.phone1,
          phone2: cleanPayload.phone2,
          phone3: cleanPayload.phone3,
          email: cleanPayload.email,
          working_hours: cleanPayload.working_hours,
          lat: cleanPayload.lat,
          lng: cleanPayload.lng
        }
      }, { merge: true });
    } catch (fsErr) {
      console.warn('Firestore setDoc notice:', fsErr);
    }
  }

  // 5. Save via Serverless API
  try {
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataToSave)
    });
  } catch (apiErr) {
    console.warn('API save notice:', apiErr);
  }

  // 6. Save to Supabase direct if configured (using UPSERT to create row if missing)
  if (isSupabaseConfigured()) {
    try {
      await supabase.from('site_settings').upsert({ id: 1, ...dataToSave });
    } catch (sbErr) {
      console.warn('Supabase direct upsert notice:', sbErr);
    }
  }

  return cleanPayload;
}
