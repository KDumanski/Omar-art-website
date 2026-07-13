// Curated Egypt photography — Unsplash CDN (free, commercial use, no attribution
// required). Hotlinked; params force a sensible width/quality/crop.
// Every ID below was verified to resolve (HTTP 200) to a real Egypt photo.
// If you ever want guaranteed permanence, download these into /public and swap paths.

const U = (id, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const IMG = {
  // Hero / Giza
  gizaPyramids: U('1539768942893-daf53e448371', 2400), // pyramids of Giza, golden light + camels
  sphinx: U('1738580426685-f8f0d34291dc'),             // the Sphinx & pyramids of Giza
  pyramidDusk: U('1503177119275-0aa32b3a9368'),        // pyramid silhouette dusk
  camelGiza: U('1568322445389-f64ac2515020'),          // camel + pyramids

  // Nile / feluccas / Aswan
  nileFelucca: U('1680356217112-dad9300ce49d', 2000),  // felucca sailboat on the Nile
  nileSunset: U('1600520611035-84157ad4084d'),         // Nile / Aswan golden hour
  aswan: U('1562679299-266edbefd6d7'),                 // Aswan on the Nile

  // Luxor / Karnak / temples
  karnak: U('1584719763904-2799b453ba8d', 2000),       // Karnak temple columns
  luxorTemple: U('1710886324980-997f7742f16c'),        // Luxor temple
  abuSimbel: U('1633163893862-4cdc62de7d82'),          // Abu Simbel colossal statues
  hieroglyphs: U('1581248736814-67c28a550ca6', 2000),  // carved Egyptian hieroglyphics wall
  templeColumns: U('1626436819821-d2855be474c1'),      // temple / hieroglyph columns

  // Red Sea / diving / Hurghada
  redSea: U('1589308945435-38c3f99b3824', 2000),       // Red Sea, Egypt coast
  diving: U('1544551763-46a013bb70d5'),                // underwater diver
  dolphins: U('1607153333879-c174d265f1d2'),           // dolphins
  coral: U('1546026423-cc4642628d2b'),                 // coral reef

  // Cairo / culture / desert
  cairoBazaar: U('1608546043931-6c9678ea9feb'),        // egyptian papyrus / hieroglyph detail
  egyptDesert: U('1547234935-80c7145ec969', 2000),     // desert dunes
  scarab: U('1600860675013-5846fb4f1fc1'),             // Tutankhamun golden mask / artifact
  goldMask: U('1600860675013-5846fb4f1fc1'),           // Tutankhamun golden funerary mask

  // Texture / portrait
  desertCaravan: U('1559738933-d69ac3ff674b', 2000),   // camel caravan + pyramid
  starsDesert: U('1577085375786-edb0f45560aa', 2000),  // Egypt desert / night
};

// Ordered gallery used on the home marquee / experiences strip
export const GALLERY = [
  IMG.gizaPyramids, IMG.nileFelucca, IMG.karnak, IMG.redSea,
  IMG.hieroglyphs, IMG.abuSimbel, IMG.starsDesert, IMG.diving,
];
