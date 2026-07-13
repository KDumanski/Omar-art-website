import { getShowSlugs } from '@/lib/data';

const BASE = process.env.SITE_URL || 'https://omarchaconart.com';

// Content is baked into the build (site-data.json), so emit at build time.
export const dynamic = 'force-static';

export default async function sitemap() {
  const routes = ['', '/shows', '/resume', '/contact'];
  const staticPages = routes.map((r) => ({
    url: `${BASE}${r}/`,
    changeFrequency: 'monthly',
    priority: r === '' ? 1 : 0.7,
  }));

  let slugs = [];
  try {
    slugs = await getShowSlugs();
  } catch {
    slugs = []; // DB unavailable at build — sitemap still emits static routes
  }
  const showPages = slugs.map((slug) => ({
    url: `${BASE}/shows/${slug}/`,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));
  return [...staticPages, ...showPages];
}