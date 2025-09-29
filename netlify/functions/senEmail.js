// netlify/functions/sendEmail.js
// Node 18+ environment assumed (Netlify supports fetch in Node 18)
const SENDGRID_API = process.env.SENDGRID_API_KEY;
const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL; // where to send notifications
const FROM_EMAIL = process.env.FROM_EMAIL || 'no-reply@yourdomain.com';

exports.handler = async function(event) {
  try {
    if (!SENDGRID_API) {
      return { statusCode: 500, body: 'Missing SENDGRID_API_KEY' };
    }
    if (!NOTIFY_EMAIL) {
      return { statusCode: 500, body: 'Missing NOTIFY_EMAIL' };
    }

    // Accept JSON body (from our frontend). If Netlify webhook posts a different shape,
    // you can adapt to parse it; this function expects { name, email, message }.
    const data = event.body ? JSON.parse(event.body) : {};
    const name = data.name || '—';
    const email = data.email || '—';
    const message = data.message || '—';

    const emailBody = {
      personalizations: [
        {
          to: [{ email: NOTIFY_EMAIL }],
          subject: `Website message from ${name}`
        }
      ],
      content: [
        {
          type: 'text/plain',
          value:
            `New contact form submission\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
        }
      ],
      from: { email: FROM_EMAIL }
    };

    const resp = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SENDGRID_API}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailBody)
    });

    if (resp.status >= 200 && resp.status < 300) {
      return { statusCode: 200, body: 'Email sent' };
    } else {
      const text = await resp.text();
      console.error('SendGrid error', resp.status, text);
      return { statusCode: resp.status, body: text };
    }
  } catch (err) {
    console.error('sendEmail error', err);
    return { statusCode: 500, body: 'Internal error' };
  }
};
