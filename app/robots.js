const BASE = process.env.SITE_URL || 'https://omarchaconart.com';

export const dynamic = 'force-static';

export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/admin/' },
    sitemap: `${BASE}/sitemap.xml`,
  };
}
