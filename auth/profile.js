const { getState, toPublicUser } = require('../_lib/store');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id, email } = req.body || {};
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const normalizedId = String(id || '').trim();

    if (!normalizedEmail || !normalizedId) {
      return res.status(400).json({ error: 'Недостаточно данных для профиля.' });
    }

    const state = await getState();
    const user = state.users.find((item) => item.id === normalizedId && item.email === normalizedEmail);

    if (!user) {
      return res.status(404).json({ error: 'Профиль не найден.' });
    }

    return res.status(200).json({
      ok: true,
      user: toPublicUser(user)
    });
  } catch (error) {
    return res.status(500).json({ error: 'Ошибка сервера при получении профиля.' });
  }
};
