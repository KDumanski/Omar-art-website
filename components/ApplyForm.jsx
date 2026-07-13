'use client';
import { useState } from 'react';
import styles from './ApplyForm.module.css';

// Formspree endpoint — swap PLACEHOLDER for your real form id (see README).
const FORMSPREE = 'https://formspree.io/f/PLACEHOLDER';

// `tours` (list of {slug, name}) comes from the server page that reads the DB.
export default function ApplyForm({ tours = [] }) {
  const [status, setStatus] = useState('idle'); // idle | sending | ok | error

  async function onSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    // Honeypot: real users never fill this hidden field
    if (form.elements.company && form.elements.company.value) return;

    setStatus('sending');
    try {
      const data = new FormData(form);
      const res = await fetch(FORMSPREE, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        setStatus('ok');
        form.reset();
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  if (status === 'ok') {
    return (
      <div className={styles.success} role="status">
        <span className={styles.successGlyph} aria-hidden="true">&#x2625;</span>
        <h2>Your call has been heard.</h2>
        <p>Thank you. Fabian or a member of the crew will be in touch shortly to begin your passage. Watch your inbox (and your spam folder, just in case the desert winds blew it there).</p>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      {/* Honeypot */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className={styles.hp} aria-hidden="true" />

      <div className={styles.grid}>
        <Field label="Full name" name="name" required>
          <input type="text" id="name" name="name" required autoComplete="name" />
        </Field>
        <Field label="Email" name="email" required>
          <input type="email" id="email" name="email" required autoComplete="email" />
        </Field>
        <Field label="Phone / WhatsApp" name="phone">
          <input type="tel" id="phone" name="phone" autoComplete="tel" />
        </Field>
        <Field label="Which journey calls you?" name="journey">
          <select id="journey" name="journey" defaultValue="">
            <option value="">I&rsquo;m still deciding</option>
            {tours.map((t) => (
              <option key={t.slug} value={t.name}>{t.name}</option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Tell us what you're seeking" name="message" required full>
        <textarea id="message" name="message" rows={5} required
          placeholder="What's drawing you to Egypt? Travel dates, group size, anything we should know..." />
      </Field>

      <div className={styles.actions}>
        <button type="submit" className="btn btn-primary" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Submit Application'}
        </button>
        {status === 'error' && (
          <p className={styles.err} role="alert">
            Something went wrong sending your application. Please email us directly or message on WhatsApp.
          </p>
        )}
      </div>
      <p className={styles.fine}>Granted by application. We reply to every enquiry personally.</p>
    </form>
  );
}

function Field({ label, name, required, full, children }) {
  return (
    <label className={`${styles.field} ${full ? styles.full : ''}`} htmlFor={name}>
      <span className={styles.label}>
        {label} {required && <em aria-hidden="true">*</em>}
      </span>
      {children}
    </label>
  );
}
