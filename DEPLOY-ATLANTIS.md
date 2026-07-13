# Deploy Oceanic Ventures to `atlantis.thehappyendings.org`

This is the generic `DEPLOY-VERCEL.md` runbook, pinned to the actual values for the
**`atlantis.thehappyendings.org`** subdomain. Same app, full backend: Google login,
Postgres, the `/admin` editor, and Blob image uploads.

**Hosting decision:** the site runs on **Vercel** (a real server — GitHub Pages can't run
login/DB). It's exposed at the subdomain `atlantis.thehappyendings.org`, which leaves the
existing `thehappyendings.org/yoga` (GitHub Pages) completely untouched.

Steps marked **[Keith — browser]** can only be done by a human in a browser. Steps marked
**[CLI]** Claude can run for you once you've completed the Vercel login.

---

## The exact values for this deploy

| Thing | Value |
|-------|-------|
| Public URL | `https://atlantis.thehappyendings.org` |
| Admin URL | `https://atlantis.thehappyendings.org/admin` |
| Google OAuth redirect URI | `https://atlantis.thehappyendings.org/api/auth/callback/google` |
| (also add, for local dev) | `http://localhost:3000/api/auth/callback/google` |
| DNS record at OnlyDomains | `CNAME` · host `atlantis` · target `cname.vercel-dns.com` |

### Environment variables to set in Vercel (all environments)

| Name | Value / source |
|------|----------------|
| `POSTGRES_URL` | auto-added when you create Vercel Postgres |
| `BLOB_READ_WRITE_TOKEN` | auto-added when you create Vercel Blob |
| `AUTH_SECRET` | `npx auth secret` (or any 32+ random chars) |
| `AUTH_GOOGLE_ID` | Google OAuth **Client ID** (step 4) |
| `AUTH_GOOGLE_SECRET` | Google OAuth **Client secret** (step 4) |
| `SITE_URL` | `https://atlantis.thehappyendings.org` |
| `AUTH_URL` | `https://atlantis.thehappyendings.org` |
| `ADMIN_EMAILS` *(optional)* | extra admin emails, comma-separated (Keith + Fabian are already built in) |

> `SITE_URL` drives canonical/OG tags, `robots.txt`, and `sitemap.xml`. `AUTH_URL` pins
> the NextAuth callback base to the custom domain so Google sign-in resolves correctly.

---

## Step 1 — Put the site on Vercel

**[Keith — browser]** Run `npx vercel login` and authorize in the browser (or sign in at
vercel.com with GitHub). Once you're logged in, the rest of Step 1 is **[CLI]**:

```bash
# From c:/Propcheck Git/clone/Fabians Tours
npx vercel link          # create/link the fabians-tours project
npx vercel                # first preview deploy (will error until DB+env set — expected)
```

## Step 2 — Database

**[Keith — browser]** Vercel project → **Storage → Create Database → Postgres** → Create.
`POSTGRES_URL` is added automatically.

Then seed it **[CLI]**:

```bash
npx vercel env pull .env.local
node --env-file=.env.local scripts/seed.mjs
# expect: ✓ Done. tours=5 crew=12 testimonials=9
```

## Step 3 — Image uploads

**[Keith — browser]** Storage → **Create → Blob → Create**. `BLOB_READ_WRITE_TOKEN` is
added automatically.

## Step 4 — Google login

**[Keith — browser]** In https://console.cloud.google.com (signed in as
`keith.dumanski@gmail.com`):

1. New project `Oceanic Ventures`.
2. **APIs & Services → OAuth consent screen** → External → fill name/emails →
   add **Test users**: `keith.dumanski@gmail.com`, `fabianguhl@gmail.com`.
   *(Testing mode = only these two can sign in, which is exactly the restriction we want.)*
3. **Credentials → Create Credentials → OAuth client ID → Web application.**
   Authorized redirect URIs — add BOTH:
   - `https://atlantis.thehappyendings.org/api/auth/callback/google`
   - `http://localhost:3000/api/auth/callback/google`
4. Copy the **Client ID** and **Client secret**.

Then set the env vars **[CLI or browser]** — Claude can run these once you have the values:

```bash
printf '%s' 'https://atlantis.thehappyendings.org' | npx vercel env add SITE_URL production
printf '%s' 'https://atlantis.thehappyendings.org' | npx vercel env add AUTH_URL production
npx auth secret           # or generate any 32+ char secret, then:
# npx vercel env add AUTH_SECRET production   (paste the value)
# npx vercel env add AUTH_GOOGLE_ID production
# npx vercel env add AUTH_GOOGLE_SECRET production
```

(Repeat for `preview`/`development` environments if you want local + preview login too.)

## Step 5 — Custom domain

**[CLI]** Add the domain to the project:

```bash
npx vercel domains add atlantis.thehappyendings.org
# or: Vercel → Settings → Domains → Add → atlantis.thehappyendings.org
```

**[Keith — browser]** At **OnlyDomains** (login `Keithonbomb`), add to the
`thehappyendings.org` zone:

```
Type: CNAME   Host: atlantis   Target: cname.vercel-dns.com   TTL: default
```

(Vercel shows the exact target after you add the domain — use whatever it shows; it's
normally `cname.vercel-dns.com`.) DNS propagates in minutes; Vercel auto-issues HTTPS.

## Step 6 — Redeploy to production

**[CLI]**

```bash
npx vercel --prod
```

## Step 7 — Verify

- `https://atlantis.thehappyendings.org` — public site loads, content from the DB.
- `https://atlantis.thehappyendings.org/admin` — redirects to Google sign-in → sign in
  with `keith.dumanski@gmail.com` → dashboard loads.
- Edit a tour/crew/testimonial → Save → refresh the public page → change is live.

---

## Known follow-ups (not blockers for login/backend)

- **Apply form** (`components/ApplyForm.jsx`) posts to a Formspree **placeholder**
  (`https://formspree.io/f/PLACEHOLDER`). Submissions won't be delivered until a real
  Formspree form ID (or another endpoint) is wired in.
- **Contact email / WhatsApp / Mailchimp** in `lib/copy.js` are still placeholders pending
  Fabian's real details.
