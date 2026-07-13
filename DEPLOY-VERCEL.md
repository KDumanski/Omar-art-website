# Deploying Oceanic Ventures to Vercel (with the admin login)

This site now runs as a real Next.js app on **Vercel**, with:

- **Google login** for the admin (restricted to an allowlist of emails)
- A **Postgres database** holding all tours, crew, and testimonials
- An **admin dashboard at `/admin`** to add / edit / remove that content — changes go
  live instantly, no code or rebuild needed
- **Image uploads** (for crew/tour photos) stored in Vercel Blob

You only have to do the setup below **once**. After that, you and Fabian just log in at
`yoursite.vercel.app/admin` and edit. None of these steps need a paid plan — the free
tiers cover everything.

> **Where things live:** the login allowlist is in `lib/allowlist.js`
> (`keith.dumanski@gmail.com` + `fabianguhl@gmail.com` by default). Add more by setting
> the `ADMIN_EMAILS` env var, comma-separated.

---

## Step 1 — Put the site on Vercel (5 min)

1. Go to **https://vercel.com** and sign in with GitHub.
2. Click **Add New… → Project**, then **Import** the `KDumanski/fabians-tours` repo.
3. Framework preset will auto-detect **Next.js**. Leave the defaults. Click **Deploy**.
4. It will build and give you a URL like **`https://fabians-tours.vercel.app`**.
   (It'll error on the first load until the database + env vars below are set — that's
   expected. Finish the steps, then redeploy.)

---

## Step 2 — Add the database (3 min)

1. In your Vercel project, open the **Storage** tab.
2. Click **Create Database → Postgres**, accept the defaults, **Create**.
3. Vercel automatically adds the `POSTGRES_URL` (and friends) to the project's env vars —
   nothing to copy.

### Load the starting content into the database

Run the seed once, from your computer, pointed at the new database:

```bash
# From the project folder (c:/Propcheck Git/clone/Fabians Tours):
npm i -g vercel        # if you don't have the Vercel CLI yet
vercel link            # pick the fabians-tours project
vercel env pull .env.local      # downloads POSTGRES_URL etc. into .env.local
node --env-file=.env.local scripts/seed.mjs
```

You should see `✓ Done. tours=5 crew=12 testimonials=9`. That loads all the current
content (the 5 retreats/training, 12 crew, 3 videos + 6 written testimonials) into the
database as the starting point. After this, all edits happen in the admin — `lib/*.js`
is no longer the source of truth (it's only the one-time seed).

---

## Step 3 — Add image uploads (1 min)

1. **Storage** tab again → **Create → Blob** → **Create**.
2. Vercel auto-adds `BLOB_READ_WRITE_TOKEN`. Done — the admin's photo upload now works.

---

## Step 4 — Turn on Google login (the only slightly fiddly part, ~8 min)

You need a Google "OAuth client" so people can sign in with Google. One-time setup.

### 4a. Make the OAuth client in Google Cloud

1. Go to **https://console.cloud.google.com** (sign in with `keith.dumanski@gmail.com`).
2. Top bar → **Select a project → New Project** → name it `Oceanic Ventures` → **Create**,
   then make sure it's selected.
3. Left menu → **APIs & Services → OAuth consent screen**:
   - User type: **External** → **Create**.
   - App name: `Oceanic Ventures Admin`. User support email: your email. Developer email:
     your email. **Save and continue** through the rest (you can skip scopes/test users).
   - Back on the consent screen, under **Test users**, click **Add users** and add
     `keith.dumanski@gmail.com` and `fabianguhl@gmail.com`. **Save.**
     *(While the app is in "Testing" mode, only these test users can sign in — which is
     exactly the restriction we want.)*
4. Left menu → **APIs & Services → Credentials → Create Credentials → OAuth client ID**:
   - Application type: **Web application**. Name: `Oceanic Ventures Web`.
   - **Authorized redirect URIs → Add URI**, add BOTH:
     - `https://fabians-tours.vercel.app/api/auth/callback/google`
       *(use your real Vercel URL if it differs)*
     - `http://localhost:3000/api/auth/callback/google`  *(for local testing)*
   - **Create.** Google shows you a **Client ID** and **Client secret** — keep them open.

### 4b. Put the credentials into Vercel

In the Vercel project → **Settings → Environment Variables**, add these three (for all
environments):

| Name | Value |
|------|-------|
| `AUTH_SECRET` | a long random string — generate with `npx auth secret`, or any 32+ random chars |
| `AUTH_GOOGLE_ID` | the **Client ID** from step 4a |
| `AUTH_GOOGLE_SECRET` | the **Client secret** from step 4a |

(Optional) add `ADMIN_EMAILS` if you want to allow more people than the built-in two.

---

## Step 5 — Redeploy

In Vercel → **Deployments → … → Redeploy** (or just push any commit). Now:

- The public site reads everything from the database.
- Go to **`https://fabians-tours.vercel.app/admin`** → it sends you to **Sign in with
  Google** → sign in with an allowed account → you're in the dashboard.
- Add / edit / remove tours, crew, and testimonials. Hit **Save** — refresh the public
  page and the change is already there.

---

## Using the admin day-to-day

- **URL:** `yoursite.vercel.app/admin`  → Sign in with Google (allowed accounts only).
- **Three tabs:** Retreats & Trainings · Crew · Testimonials.
- Each tab: a list with **Edit** / **Delete** on every item, and **+ Add new** at the top.
- **Photos:** in any image field you can paste a URL *or* click **Choose file** to upload
  (it goes to Vercel Blob and the URL fills in automatically).
- **Itinerary** for a tour is one line per day in the form: `Day 1–3 | Luxor | Temples at first light`.
- Lists (highlights, includes, overview paragraphs) are one item per line.

## Giving Fabian access

He's already on the allowlist (`fabianguhl@gmail.com`) and added as a Google "test user"
in step 4a. Send him the `/admin` link — he signs in with that Google account and he's in.

## Local development

```bash
vercel env pull .env.local     # once, to get the env vars locally
npm run dev                    # http://localhost:3000  (and /admin)
```

## Custom domain (optional, later)

If Fabian wants `oceanicventures.co` (or any domain) to point here: Vercel → **Settings →
Domains → Add**, then follow the DNS instructions. Also add that domain's
`/api/auth/callback/google` URL to the Google OAuth redirect URIs (step 4a) and set
`SITE_URL` to the new domain.
