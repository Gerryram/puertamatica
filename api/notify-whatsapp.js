module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Missing message' });

  const recipients = [
    { phone: process.env.WA_PHONE_1, apikey: process.env.WA_APIKEY_1 },
    { phone: process.env.WA_PHONE_2, apikey: process.env.WA_APIKEY_2 },
  ];

  const results = await Promise.all(
    recipients.map(async ({ phone, apikey }) => {
      const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodeURIComponent(message)}&apikey=${apikey}`;
      const r = await fetch(url);
      return { phone, ok: r.ok, status: r.status };
    })
  );

  return res.status(200).json({ sent: results });
};
