export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://www.thesomaticanxietyreset.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email and message are required' });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'The Somatic Anxiety Reset <hello@thesomaticanxietyreset.com>',
        to: ['happymollah008@gmail.com'],
        reply_to: email,
        subject: `[Contact] ${subject || 'New message'} — ${name}`,
        html: `
          <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:40px;background:#F5F0E4;">
            <p style="font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#5B7B6F;margin-bottom:8px;">THE SOMATIC ANXIETY RESET</p>
            <div style="width:40px;height:1px;background:#C4973A;margin-bottom:24px;"></div>
            <h2 style="font-size:22px;color:#2C3428;font-weight:400;margin-bottom:24px;">New Contact Form Submission</h2>
            <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #C8D5BF;font-size:12px;color:#5B7B6F;letter-spacing:1px;text-transform:uppercase;width:100px;">Name</td>
                <td style="padding:10px 0;border-bottom:1px solid #C8D5BF;font-size:14px;color:#2C3428;">${name}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #C8D5BF;font-size:12px;color:#5B7B6F;letter-spacing:1px;text-transform:uppercase;">Email</td>
                <td style="padding:10px 0;border-bottom:1px solid #C8D5BF;font-size:14px;color:#2C3428;"><a href="mailto:${email}" style="color:#C4973A;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid #C8D5BF;font-size:12px;color:#5B7B6F;letter-spacing:1px;text-transform:uppercase;">Subject</td>
                <td style="padding:10px 0;border-bottom:1px solid #C8D5BF;font-size:14px;color:#2C3428;">${subject || 'General Question'}</td>
              </tr>
            </table>
            <div style="background:#EDE5D0;padding:20px 24px;border-left:3px solid #C4973A;">
              <p style="font-size:12px;color:#5B7B6F;letter-spacing:1px;text-transform:uppercase;margin-bottom:10px;">Message</p>
              <p style="font-size:15px;color:#3D4038;line-height:1.8;margin:0;">${message.replace(/\n/g, '<br>')}</p>
            </div>
            <p style="font-size:12px;color:#8B9E7E;margin-top:24px;">Reply directly to this email to respond to ${name}.</p>
          </div>
        `
      })
    });

    const data = await response.json();

    if (response.ok) {
      return res.status(200).json({ success: true });
    }

    return res.status(400).json({ error: data.message || 'Failed to send' });

  } catch (err) {
    console.error('Resend error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
