// Central brand voice. Heavy ancient-Egyptian mythology and evocative, layered
// allusion throughout. Adapted in structure from the Oceanic Ventures site.

export const BRAND = {
  name: 'Oceanic Ventures',
  short: 'Oceanic Ventures',
  tagline: 'The Atlantis Call · Transformational Retreats',
  whatsapp: '15551234567', // PLACEHOLDER — awaiting real number from Fabian (no +/spaces)
  email: 'hello@oceanicventures.co', // PLACEHOLDER — confirm with Fabian
  // Real Oceanic Ventures social links (from oceanicventures.co)
  instagram: 'https://www.instagram.com/oceanicventures.co/',
  facebook: 'https://www.facebook.com/oceanicventures.co',
  youtube: 'https://www.youtube.com/channel/UC1ndLMifht-GD4oEyEV_ofw',
  // The real logo, self-hosted from his WordPress media library.
  logo: '/logo-atlantis.png',
};

// Mailchimp newsletter — wired to the popup + footer.
// PLACEHOLDER: paste Fabian's real Mailchimp embedded-form ACTION URL here.
// In Mailchimp: Audience → Signup forms → Embedded form → copy the <form action="...">
// URL (looks like https://oceanicventures.us21.list-manage.com/subscribe/post?u=XXXX&id=YYYY).
// Until it's set, the popup shows but submitting opens his Mailchimp-hosted form instead
// of failing silently.
export const MAILCHIMP = {
  action: '', // e.g. 'https://oceanicventures.us21.list-manage.com/subscribe/post?u=XXXX&id=YYYY'
  // The hidden anti-bot field Mailchimp requires; its name is unique per audience.
  // Found in the same embed snippet (an input whose name starts with b_). Leave as-is
  // if you paste the full action URL — it still works without this for hosted fallback.
  botField: '', // e.g. 'b_XXXX_YYYY'
};

export const NEWSLETTER = {
  kicker: 'The Atlantis Call',
  title: 'Hear the call before anyone else',
  body: 'Join our circle for new retreat dates, stories from the water, and quiet invitations we share with no one else.',
  cta: 'Join the Circle',
  placeholder: 'Your email',
};

export const HERO = {
  kicker: 'Oceanic Ventures · The Atlantis Call',
  // Brand tagline from oceanicventures.co
  title: 'The Atlantis Call — Sacred Water Journeys',
  // Verbatim hero line from oceanicventures.co
  sub: 'Connect with marine life in a respectful manner discovering the depths of the sea and yourself.',
  ctaPrimary: 'Explore the Retreats',
  ctaSecondary: 'Apply Now',
};

// The real practices, verbatim from oceanicventures.co. NOTE: the old
// IMMERSE / RELEASE / CREATE / INTEGRATE labels were WordPress-template filler that
// Fabian asked us to drop — these are the genuine practices woven into the retreats.
// `glyph` is an SVG glyph name (see components/Glyph.jsx).
export const PILLARS = [
  {
    glyph: 'water',
    title: 'Freediving',
    body: 'A connection with your own soul, where you learn to trust and surrender.',
  },
  {
    glyph: 'lotus',
    title: 'Somatics',
    body: 'Deep-relaxation warm-water therapy that helps you release trauma, gently and effectively.',
  },
  {
    glyph: 'sun',
    title: 'Shamanism',
    body: 'Enter deep inner states without all the ‘noise’ — held in nature, guided with care.',
  },
  {
    glyph: 'circle',
    title: 'Sharing Circles',
    body: 'Deepen your connection with nature and with one another in a held, intimate space.',
  },
];

// About-page narrative — verbatim copy from oceanicventures.co/about-us
export const ABOUT = {
  intro: {
    kicker: 'A Call from the Waters',
    title: 'Water is both a mirror and a medicine.',
    body: [
      'Oceanic Ventures creates transformational journeys rooted in the wisdom of water — inviting deep inner cleansing, clarity, and remembrance through embodied experience.',
      'As within, so without. Healing the self and healing the planet are inseparable.',
    ],
  },
  atlantis: {
    kicker: 'The Mystery of Atlantis',
    title: 'A golden age of balance.',
    body: [
      'Atlantis has come to symbolize a golden age of balance between human consciousness, wisdom, and reverence for the natural world.',
      'The Atlantis Call is not about recreating a lost civilization, but about embodying its essence — through integrity, coherence, and conscious stewardship today.',
    ],
  },
  community: {
    kicker: 'Community',
    title: 'For those who feel the call.',
    body: [
      'Our community includes meditators, healers, facilitators, and space-holders who are already engaged in deep inner work.',
      'Those who feel drawn to The Atlantis Call are not looking for a first step, but for resonance.',
    ],
  },
  founder: {
    kicker: 'Founder',
    name: 'Fabian',
    title: 'Fabian',
    body: [
      'Raised in Berlin and shaped by a life of exploration, inner inquiry, and lived experience, his path led him from the corporate world into a deep relationship with the sea.',
      'His approach is grounded not in ideology, but in presence, discernment, and integrity. Fabian devotes his work to creating intimate, well-held containers where people can reconnect.',
    ],
  },
};

// Social Impact funds (reference: Mother Fund / Marine Conservation / Oshun Water)
export const IMPACT = {
  kicker: 'Spirit in Action',
  title: 'We give back to the land that gives us everything.',
  intro:
    'Authentic reverence asks for more than admiration — it asks for action. A portion of every journey funds regeneration along the Nile and the Red Sea. We partner only with integrity-driven projects on the ground.',
  funds: [
    {
      glyph: 'lotus',
      name: 'The Lotus Fund',
      where: 'Cairo · Aswan',
      body: 'Restoring the Nile through cultivation of the sacred blue lotus, water purification, healing circles, and community programs that return wealth to Indigenous river communities.',
    },
    {
      glyph: 'water',
      name: 'Red Sea Guardians',
      where: 'Hurghada · Red Sea',
      body: 'Funding coral-reef restoration, marine research, and local conservation teams — empowering coastal communities as stewards of the sea they have always loved.',
    },
    {
      glyph: 'feather',
      name: 'Living Water Fund',
      where: 'Upper Egypt',
      body: 'Solar-powered clean-water systems, river restoration in mining-affected regions, and the training of community guardians to protect the water for generations.',
    },
  ],
};

// Footer link groups (reference structure)
export const FOOTER_LINKS = {
  explore: [
    { label: 'The Retreats', href: '/journeys/' },
    { label: 'Signature Experiences', href: '/experiences/' },
    { label: 'Apply / Reserve', href: '/apply/' },
  ],
  about: [
    { label: 'About Us', href: '/about/' },
    { label: 'Our Crew', href: '/crew/' },
    { label: 'Testimonials', href: '/testimonials/' },
    { label: 'Social Impact', href: '/social-impact/' },
  ],
  legal: [
    { label: 'Refer a Friend', href: '/apply/' },
    { label: 'Terms & Conditions', href: '/terms/' },
    { label: 'Contact', href: '/apply/' },
  ],
};
