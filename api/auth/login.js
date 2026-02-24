const { getState } = require('../_lib/store');
const { verifyPassword } = require('../_lib/security');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error: 'Введите email и пароль.' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const state = await getState();
    const user = state.users.find((item) => item.email === normalizedEmail);

    if (!user || !verifyPassword(password, user.passwordHash)) {
      return res.status(401).json({ error: 'Неверный email или пароль.' });
    }

    return res.status(200).json({
      ok: true,
      user: {
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    return res.status(500).json({ error: 'Ошибка сервера при входе.' });
  }
};
