module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password } = req.body || {};
  const adminPassword = process.env.ADMIN_PANEL_PASSWORD || 'spark-admin-2026';

  if (!password || password !== adminPassword) {
    return res.status(401).json({ error: 'Неверный админ пароль.' });
  }

  return res.status(200).json({ ok: true });
};
