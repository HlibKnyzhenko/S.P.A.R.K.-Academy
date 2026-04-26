const { hashPassword } = require('../_lib/security');
const { getState, saveState, sanitizeUserRecord, toAdminUser } = require('../_lib/store');

function isAdminPasswordValid(password) {
  const adminPassword = process.env.ADMIN_PANEL_PASSWORD || 'spark-admin-2026';
  return password && password === adminPassword;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { adminPassword } = req.body || {};

    if (!isAdminPasswordValid(adminPassword)) {
      return res.status(401).json({ error: 'Неверный админ пароль.' });
    }

    const state = await getState();

    if (req.method === 'POST') {
      return res.status(200).json({
        ok: true,
        users: state.users.map((user) => toAdminUser(user)).filter(Boolean)
      });
    }

    const { userId, updates } = req.body || {};
    const normalizedUserId = String(userId || '').trim();
    const userIndex = state.users.findIndex((user) => user.id === normalizedUserId);

    if (userIndex === -1) {
      return res.status(404).json({ error: 'Ученик не найден.' });
    }

    const existingUser = state.users[userIndex];
    const payload = updates && typeof updates === 'object' ? updates : {};
    const nextPassword = String(payload.newPassword || '').trim();

    if (nextPassword && nextPassword.length < 6) {
      return res.status(400).json({ error: 'Новый пароль должен быть минимум 6 символов.' });
    }

    const sanitizedUser = sanitizeUserRecord({
      ...existingUser,
      ...payload,
      passwordHash: nextPassword ? hashPassword(nextPassword) : existingUser.passwordHash,
      adminVisiblePassword: nextPassword || payload.adminVisiblePassword || existingUser.adminVisiblePassword
    });

    if (!sanitizedUser) {
      return res.status(400).json({ error: 'Некорректные данные ученика.' });
    }

    state.users[userIndex] = sanitizedUser;
    await saveState(state);

    return res.status(200).json({
      ok: true,
      user: toAdminUser(sanitizedUser),
      users: state.users.map((user) => toAdminUser(user)).filter(Boolean)
    });
  } catch (error) {
    return res.status(500).json({ error: 'Ошибка сервера при работе с учениками.' });
  }
};
