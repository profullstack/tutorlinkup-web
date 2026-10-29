// @vitest-environment node
import { describe, it, expect, vi } from 'vitest';

// The route's instance reads its secret from the environment when the module loads.
const SECRET = vi.hoisted(() => {
  const secret = 'test-secret-that-is-long-enough-0123456789';
  process.env.FORM_GUARD_SECRET = secret;
  return secret;
});

import { createSiteContact } from '../../src/lib/server/contact.js';
import { POST } from '../../src/routes/api/contact/+server.js';

function setup() {
  const sent = [];
  const contact = createSiteContact({
    guard: { secret: SECRET, minAgeMs: 0 },
    send: async (mail) => {
      sent.push(mail);
      return { sent: true, id: 'msg_1' };
    }
  });
  return { contact, sent };
}

const form = (fields) =>
  new Request('https://tutorlinkup.com/api/contact', {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      referer: 'https://tutorlinkup.com/contact',
      'x-forwarded-for': '203.0.113.7'
    },
    body: new URLSearchParams(fields).toString()
  });

const tokenFrom = (html) => html.match(/name="fg_token" value="([^"]+)"/)[1];

const filled = {
  name: 'Ada Lovelace',
  email: 'ada@example.test',
  subject: 'Tutor for calculus',
  message: 'Do you offer two hour sessions?'
};

describe('contact form', () => {
  it('carries a token and a hidden honeypot', async () => {
    const html = await setup().contact.guardHtml();
    expect(html).toMatch(/name="fg_token"/);
    expect(html).toMatch(/class="cf-hp"/);
  });

  it('answers a tokenless post like a success and delivers nothing', async () => {
    const { contact, sent } = setup();
    const res = await contact.POST(form(filled));
    expect(res.status).toBe(303);
    expect(res.headers.get('location')).toBe('/contact?sent=1');
    expect(sent).toHaveLength(0);
  });

  it('the route drops a tokenless post', async () => {
    const res = await POST({ request: form(filled) });
    expect(res.status).toBe(303);
    expect(res.headers.get('location')).toBe('/contact?sent=1');
  });

  it('delivers a post from the rendered form', async () => {
    const { contact, sent } = setup();
    const fg_token = tokenFrom(await contact.guardHtml());
    const res = await contact.POST(form({ ...filled, fg_token }));
    expect(res.status).toBe(303);
    expect(res.headers.get('location')).toBe('/contact?sent=1');
    expect(sent).toHaveLength(1);
    expect(sent[0].to).toBe('support@tutorlinkup.com');
    expect(sent[0].replyTo).toBe('ada@example.test');
    expect(sent[0].subject).toMatch(/^Contact: Tutor for calculus \(from Ada Lovelace\)/);
    expect(sent[0].text).toContain('two hour sessions');
  });

  it('sends a missing subject back as an error code the page turns into a message', async () => {
    const { contact, sent } = setup();
    const fg_token = tokenFrom(await contact.guardHtml());
    const res = await contact.POST(form({ ...filled, subject: '', fg_token }));
    const location = new URL(res.headers.get('location'), 'https://tutorlinkup.com');
    expect(location.searchParams.get('error')).toBe('invalid');
    expect(contact.errorMessage(location.searchParams)).toMatch(/Subject/);
    expect(sent).toHaveLength(0);
  });
});
