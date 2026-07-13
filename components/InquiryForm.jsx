'use client';
import { useState } from 'react';

// Simple inquiry form. Posts to a placeholder endpoint (Web3Forms-style) — wire a
// real access key before launch. Until then it shows a friendly notice and never
// silently fails. Matches the static site's contact form behavior.
const ACCESS_KEY = 'YOUR_WEB3FORMS_ACCESS_KEY';

export default function InquiryForm({ email = '' }) {
  const [status, setStatus] = useState({ text: '', cls: '' });
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!ACCESS_KEY || ACCESS_KEY === 'YOUR_WEB3FORMS_ACCESS_KEY') {
      setStatus({
        text: email ? `Form not connected yet — please email ${email} directly.` : 'Form not connected yet.',
        cls: 'is-err',
      });
      return;
    }
    setBusy(true);
    setStatus({ text: '', cls: '' });
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) throw new Error('bad response');
      setStatus({ text: 'Thank you — your inquiry has been sent.', cls: 'is-ok' });
      form.reset();
    } catch {
      setStatus({ text: 'Something went wrong. Please email directly instead.', cls: 'is-err' });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="contact__form" onSubmit={onSubmit}>
      <input type="hidden" name="access_key" value={ACCESS_KEY} />
      <input type="hidden" name="subject" value="New inquiry from omarchaconart.com" />
      <input type="checkbox" name="botcheck" className="hp" tabIndex={-1} autoComplete="off" />

      <div className="contact__row">
        <label className="field"><span>Name</span><input type="text" name="name" required autoComplete="name" /></label>
        <label className="field"><span>Email</span><input type="email" name="email" required autoComplete="email" /></label>
      </div>
      <label className="field">
        <span>Message</span>
        <textarea name="message" rows={4} required placeholder="Tell me about the inquiry…" />
      </label>
      <button type="submit" className="btn btn--solid" disabled={busy}>
        {busy ? 'Sending…' : 'Send inquiry'}
      </button>
      <p className={`contact__status ${status.cls}`} role="status" aria-live="polite">{status.text}</p>
    </form>
  );
}
