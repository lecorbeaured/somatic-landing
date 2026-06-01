export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://www.thesomaticanxietyreset.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, name } = req.body;

  if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MAILERLITE_API_KEY}`
      },
      body: JSON.stringify({
        email,
        fields: { name: name || '' },
        groups: [process.env.MAILERLITE_GROUP_ID]
      })
    });

    const data = await response.json();

    if (response.ok || response.status === 201 || response.status === 200) {
      return res.status(200).json({ success: true });
    }

    // Already subscribed is fine
    if (response.status === 409) {
      return res.status(200).json({ success: true });
    }

    return res.status(400).json({ error: data.message || 'Subscription failed' });

  } catch (err) {
    console.error('MailerLite error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
