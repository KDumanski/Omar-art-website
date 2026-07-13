// Who may access the admin. Google login only succeeds for these emails. Add more by
// setting ADMIN_EMAILS in the environment (comma-separated) — it's merged with this
// default list. Keeping a code default means the allowlist works even before env setup.
const DEFAULT_ADMINS = [
  'keith.dumanski@gmail.com',
  'fabianguhl@gmail.com',
];

export function adminEmails() {
  const fromEnv = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return new Set([...DEFAULT_ADMINS.map((e) => e.toLowerCase()), ...fromEnv]);
}

export function isAllowed(email) {
  if (!email) return false;
  return adminEmails().has(email.toLowerCase());
}
