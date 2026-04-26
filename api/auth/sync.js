const {
  DEFAULT_ENGLISH_PROGRESS_MAP,
  buildDefaultMilestone,
  buildDefaultPortfolioProgress,
  getState,
  saveState,
  toPublicUser
} = require('../_lib/store');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, name } = req.body || {};
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const normalizedName = String(name || '').trim() || 'Student';

    if (!normalizedEmail || !normalizedEmail.includes('@')) {
      return res.status(400).json({ error: 'Некорректный email.' });
    }

    const state = await getState();
    const existingUser = state.users.find((user) => user.email === normalizedEmail);

    if (existingUser) {
      return res.status(200).json({ ok: true, user: toPublicUser(existingUser) });
    }

    const englishProgress = DEFAULT_ENGLISH_PROGRESS_MAP['NOT SURE'];
    const motivation = 'Clerk account synced for dashboard access.';
    const portfolioProgress = buildDefaultPortfolioProgress(englishProgress, motivation);
    const newUser = {
      id: `u_${Date.now()}`,
      name: normalizedName,
      email: normalizedEmail,
      passwordHash: '',
      adminVisiblePassword: '',
      englishLevel: 'NOT SURE',
      motivation,
      englishProgress,
      portfolioProgress,
      nextMilestone: buildDefaultMilestone(englishProgress, portfolioProgress),
      achievementIds: [],
      certificates: [],
      createdAt: new Date().toISOString()
    };

    state.users.push(newUser);
    await saveState(state);

    return res.status(201).json({ ok: true, user: toPublicUser(newUser) });
  } catch (error) {
    return res.status(500).json({ error: 'Ошибка сервера при синхронизации профиля.' });
  }
};
