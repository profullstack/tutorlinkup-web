import { createContactForm, withQuestions } from '@profullstack/contact-form';

/**
 * The contact form on /contact, on @profullstack/contact-form.
 *
 * The page (src/routes/contact/+page.server.js mints the token) and the
 * handler (src/routes/api/contact/+server.js) share this one instance, so
 * the token a page carries is the one the handler checks.
 *
 * The questions are the ones the page asks: the defaults plus a subject,
 * all required, labelled as the page labels them.
 */
export const QUESTIONS = withQuestions({
  add: [{ name: 'subject', label: 'Subject', required: true, maxLength: 200 }],
  override: {
    name: { label: 'Name' },
    message: { label: 'Message', rows: 6 }
  }
});

export function createSiteContact(overrides = {}) {
  return createContactForm({
    site: 'tutorlinkup',
    brandTerms: ['tutorlinkup', 'tutor linkup'],
    // The address the page lists.
    to: 'support@tutorlinkup.com',
    from: 'TutorLinkup <support@tutorlinkup.com>',
    subject: (s) => `Contact: ${s.fields.subject ?? 'TutorLinkup'} (from ${s.name})`,
    questions: QUESTIONS,
    // Without JavaScript the form is a plain post; it comes back with ?sent=1 or ?error=<code>.
    redirect: '/contact',
    ...overrides
  });
}

export const contact = createSiteContact();
