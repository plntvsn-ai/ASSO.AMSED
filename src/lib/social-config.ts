export const SOCIAL_PLATFORMS = {
  facebook: { enabled: true, token: process.env.FB_PAGE_ACCESS_TOKEN || process.env.FB_TOKEN, pageId: process.env.FB_PAGE_ID, name: 'Facebook' },
  instagram: { enabled: false, token: process.env.IG_TOKEN, name: 'Instagram' },
  tiktok: { enabled: false, token: process.env.TIKTOK_TOKEN, name: 'TikTok' },
} as const;
