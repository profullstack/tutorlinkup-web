import { contact } from '$lib/server/contact.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ url, setHeaders }) {
  // The token is minted per render: a cached page would hand every visitor
  // the same one.
  setHeaders({ 'cache-control': 'no-store' });
  return {
    guardHtml: await contact.guardHtml(),
    // POST /api/contact sends the form back here with ?sent=1 or
    // ?error=<code>; the module turns those into this form's own messages
    // (never text from the URL).
    sent: contact.sentMessage(url.searchParams),
    error: contact.errorMessage(url.searchParams)
  };
}
