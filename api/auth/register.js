const { getState, saveState } = require('../_lib/store');
const { hashPassword } = require('../_lib/security');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, password } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Заполните все поля.' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const normalizedName = String(name).trim();

    if (!normalizedEmail.includes('@')) {
      return res.status(400).json({ error: 'Некорректный email.' });
    }

    if (String(password).length < 6) {
      return res.status(400).json({ error: 'Пароль должен быть минимум 6 символов.' });
    }

    const state = await getState();

    if (state.users.some((user) => user.email === normalizedEmail)) {
      return res.status(409).json({ error: 'Такой аккаунт уже существует.' });
    }

    const user = {
      id: `u_${Date.now()}`,
      name: normalizedName,
      email: normalizedEmail,
      passwordHash: hashPassword(password),
      createdAt: new Date().toISOString()
    };

    state.users.push(user);
    await saveState(state);

    return res.status(201).json({
      ok: true,
      user: {
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    return res.status(500).json({ error: 'Ошибка сервера при регистрации.' });
  }
};
