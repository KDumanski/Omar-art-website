// Real video testimonials from oceanicventures.co/testimonials — the three YouTube
// Shorts Fabian asked us to pull in ("why didn't u pull the video testimonials? I
// think they are great!"). These are click-to-play (privacy-enhanced nocookie embeds,
// lazy thumbnails) so they don't slow the page until a visitor opts in.

export const VIDEO_TESTIMONIALS = [
  {
    id: 'ye27cV8erLY',
    caption: 'A traveler shares the journey, in their own words.',
  },
  {
    id: 'DL_xDzdgj7U',
    caption: 'What the retreat felt like, from someone who lived it.',
  },
  {
    id: 'ksTRnq-idz0',
    caption: 'Reflections from the water and the temples.',
  },
];

// YouTube ships a high-quality thumbnail for every video at this path — no API needed.
export const ytThumb = (id) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
export const ytEmbed = (id) =>
  `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1`;
export const ytWatch = (id) => `https://youtube.com/shorts/${id}`;
