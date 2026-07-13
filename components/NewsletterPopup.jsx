'use client';
import { useEffect, useRef, useState } from 'react';
import { MAILCHIMP, NEWSLETTER, BRAND } from '@/lib/copy';
import styles from './NewsletterPopup.module.css';

const SEEN_KEY = 'ov_nl_seen_v1';
const SHOW_DELAY = 12000; // give visitors time to look around first

// Newsletter popup wired to Mailchimp (Fabian's request: "need a NL popup connected to
// my Mailchimp"). Appears once per visitor after a short delay, dismissible, and never
// shown again once seen or subscribed (localStorage). If the Mailchimp action URL isn't
// set yet, the form still works the moment Fabian pastes his URL into lib/copy.js — no
// code change needed.
export default function NewsletterPopup() {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const dialogRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    let seen;
    try { seen = localStorage.getItem(SEEN_KEY); } catch { seen = '1'; }
    if (seen) return;
    const t = setTimeout(() => setOpen(true), SHOW_DELAY);
    return () => clearTimeout(t);
  }, []);

  const dismiss = () => {
    setOpen(false);
    try { localStorage.setItem(SEEN_KEY, '1'); } catch {}
  };

  // Escape to close + focus the close button when it opens.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') dismiss(); };
    document.addEventListener('keydown', onKey);
    closeRef.current?.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const onSubmit = (e) => {
    // If no Mailchimp action is configured yet, don't post to a broken endpoint —
    // just thank them. Once Fabian pastes his action URL, the form posts to Mailchimp
    // in a hidden iframe (no page redirect).
    if (!MAILCHIMP.action) e.preventDefault();
    setSubmitted(true);
    try { localStorage.setItem(SEEN_KEY, '1'); } catch {}
  };

  if (!open) return null;

  return (
    <div className={styles.overlay} role="presentation" onClick={dismiss}>
      <div
        ref={dialogRef}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="nl-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button ref={closeRef} className={styles.close} onClick={dismiss} aria-label="Close">
          &times;
        </button>

        {submitted ? (
          <div className={styles.done}>
            <p className={styles.kicker}>{NEWSLETTER.kicker}</p>
            <h2 id="nl-title" className={styles.title}>The circle has your name.</h2>
            <p className={styles.body}>
              Thank you. Keep an eye on your inbox — the next call won’t be far.
            </p>
            <button className="btn btn-primary" onClick={dismiss}>Close</button>
          </div>
        ) : (
          <>
            <p className={styles.kicker}>{NEWSLETTER.kicker}</p>
            <h2 id="nl-title" className={styles.title}>{NEWSLETTER.title}</h2>
            <p className={styles.body}>{NEWSLETTER.body}</p>

            <form
              className={styles.form}
              action={MAILCHIMP.action || undefined}
              method="post"
              target="ov_mc_iframe"
              onSubmit={onSubmit}
              noValidate
            >
              <label htmlFor="nl-email" className="sr-only">Email address</label>
              <input
                id="nl-email"
                type="email"
                name="EMAIL"
                required
                placeholder={NEWSLETTER.placeholder}
                className={styles.input}
                autoComplete="email"
              />
              {/* Mailchimp anti-bot honeypot — must stay visually hidden, not display:none */}
              {MAILCHIMP.botField ? (
                <div aria-hidden="true" className={styles.hp}>
                  <input type="text" name={MAILCHIMP.botField} tabIndex={-1} defaultValue="" />
                </div>
              ) : null}
              <button type="submit" className={`btn btn-primary ${styles.submit}`}>
                {NEWSLETTER.cta}
              </button>
            </form>

            <p className={styles.fine}>
              We’ll only ever email you about {BRAND.short}. Unsubscribe anytime.
            </p>
          </>
        )}

        {/* Hidden target so a real Mailchimp post doesn't navigate the page away. */}
        <iframe name="ov_mc_iframe" title="newsletter" className={styles.hpFrame} />
      </div>
    </div>
  );
}
