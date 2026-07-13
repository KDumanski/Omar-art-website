import { getContact } from '@/lib/data';
import InquiryForm from '@/components/InquiryForm';

export const metadata = {
  title: 'Contact',
  description: 'For studio visits, acquisitions, and exhibition inquiries.',
};

// Make sure a bare domain (robischongallery.com) still becomes a clickable link.
const href = (v) => (v && /^https?:\/\//i.test(v) ? v : v ? `https://${v}` : null);

// CONTACT — contact info from getContact + a simple inquiry form.
export default async function ContactPage() {
  const contact = await getContact();
  const igHref = href(contact.instagram) || 'https://www.instagram.com/omarchaconjr/';
  const galleryHref = href(contact.gallery);
  const artnetHref = href(contact.artnet);

  return (
    <div className="page">
      <div className="page__chrome">
        <p className="page__eyebrow">Contact</p>
      </div>
      <div className="page__body">
        <div className="contact">
          <header className="page__head">
            <h1 className="page__title">Let&rsquo;s gather.</h1>
            <p className="page__intro">{contact.blurb || 'For studio visits, acquisitions, and exhibition inquiries.'}</p>
          </header>

          {contact.email && (
            <p style={{ marginBottom: 'var(--s4)' }}>
              <a className="contact__link" href={`mailto:${contact.email}`}>{contact.email}</a>
            </p>
          )}

          <InquiryForm email={contact.email} />

          <div className="contact__links">
            <a className="contact__link" href={igHref} target="_blank" rel="noopener noreferrer">Instagram&nbsp;↗</a>
            {galleryHref && <a className="contact__link" href={galleryHref} target="_blank" rel="noopener noreferrer">Gallery&nbsp;↗</a>}
            {artnetHref && <a className="contact__link" href={artnetHref} target="_blank" rel="noopener noreferrer">Artnet&nbsp;↗</a>}
          </div>
        </div>
      </div>
    </div>
  );
}
