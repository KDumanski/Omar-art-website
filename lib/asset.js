// Prefix a public-folder asset path with the deploy base path so local images resolve
// correctly under GitHub Pages project sites (e.g. /fabians-tours/logo-atlantis.png).
// Unsplash/CDN URLs are absolute and pass through untouched. next/font and _next assets
// are already prefixed by Next automatically — this is only for raw <img src> to /public.
const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';

export const asset = (path) => {
  if (!path) return path;
  if (/^https?:\/\//.test(path)) return path; // already absolute
  return `${BASE}${path.startsWith('/') ? '' : '/'}${path}`;
};
