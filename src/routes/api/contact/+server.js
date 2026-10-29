import { contact } from '$lib/server/contact.js';

// Honeypot, token, fill time and rate limit, then validation and the email,
// all in @profullstack/contact-form (see src/lib/server/contact.js).
/** @type {import('./$types').RequestHandler} */
export const POST = ({ request }) => contact.POST(request);
