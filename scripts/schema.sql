-- Omar Chacón site schema. Paintings (works) and exhibitions (shows) are connected:
-- a work optionally belongs to a show (works.show_id), and a show owns its installation
-- shots. Re-runnable: tables are created IF NOT EXISTS; seed.mjs upserts/refills.

CREATE TABLE IF NOT EXISTS shows (
  id          SERIAL PRIMARY KEY,
  slug        TEXT UNIQUE NOT NULL,
  title       TEXT NOT NULL,
  gallery     TEXT,
  city        TEXT,
  year        INT,
  blurb       TEXT,
  press_url   TEXT,
  sort_order  INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS works (
  id          SERIAL PRIMARY KEY,
  slug        TEXT UNIQUE NOT NULL,
  title       TEXT NOT NULL,
  year        INT,
  medium      TEXT,
  dimensions  TEXT,
  image       TEXT,
  status      TEXT,                         -- Available | Sold | Commissioned
  surface     TEXT,                         -- Canvas | Paper | Wood panel
  tier        TEXT,                         -- pequeno | mediano | grande
  show_id     INT REFERENCES shows(id) ON DELETE SET NULL,
  is_hero     BOOLEAN DEFAULT false,         -- shown in the homepage crossfade
  sort_order  INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS works_show_id_idx ON works(show_id);

CREATE TABLE IF NOT EXISTS installations (
  id          SERIAL PRIMARY KEY,
  show_id     INT REFERENCES shows(id) ON DELETE CASCADE,
  image       TEXT NOT NULL,
  caption     TEXT,
  sort_order  INT DEFAULT 0
);
CREATE INDEX IF NOT EXISTS installations_show_id_idx ON installations(show_id);

CREATE TABLE IF NOT EXISTS press (
  id          SERIAL PRIMARY KEY,
  publication TEXT,
  title       TEXT,
  year        INT,
  image       TEXT,
  pdf_url     TEXT,
  quote       TEXT,
  sort_order  INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS cv_entries (
  id          SERIAL PRIMARY KEY,
  year        INT,
  kind        TEXT,                         -- solo | group | award | press | education | commission | represented
  title       TEXT NOT NULL,
  venue       TEXT,
  sort_order  INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS news (
  id          SERIAL PRIMARY KEY,
  title       TEXT NOT NULL,
  date        TEXT,
  body        TEXT,
  link        TEXT,
  sort_order  INT DEFAULT 0
);

-- single-row JSON blobs: bio, contact
CREATE TABLE IF NOT EXISTS content (
  key   TEXT PRIMARY KEY,
  value JSONB NOT NULL
);
