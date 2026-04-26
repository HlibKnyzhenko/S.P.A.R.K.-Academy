const {
  DEFAULT_ENGLISH_PROGRESS_MAP,
  buildDefaultMilestone,
  buildDefaultPortfolioProgress,
  getState,
  saveState,
  toPublicUser
} = require('../_lib/store');
const { hashPassword } = require('../_lib/security');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, password, englishLevel, motivation } = req.body || {};

    if (!name || !email || !password || !englishLevel || !motivation) {
      return res.status(400).json({ error: 'Заполните все поля.' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const normalizedName = String(name).trim();
    const normalizedEnglishLevel = String(englishLevel).trim().toUpperCase();
    const normalizedMotivation = String(motivation).trim();
    const allowedLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'NOT SURE'];

    if (!normalizedEmail.includes('@')) {
      return res.status(400).json({ error: 'Некорректный email.' });
    }

    if (!normalizedName) {
      return res.status(400).json({ error: 'Введите имя.' });
    }

    if (String(password).length < 6) {
      return res.status(400).json({ error: 'Пароль должен быть минимум 6 символов.' });
    }

    if (!allowedLevels.includes(normalizedEnglishLevel)) {
      return res.status(400).json({ error: 'Выберите уровень английского.' });
    }

    if (normalizedMotivation.length < 20) {
      return res.status(400).json({ error: 'Ответьте подробнее, почему мы должны выбрать именно вас.' });
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
      adminVisiblePassword: String(password),
      englishLevel: normalizedEnglishLevel,
      motivation: normalizedMotivation,
      englishProgress: DEFAULT_ENGLISH_PROGRESS_MAP[normalizedEnglishLevel] || DEFAULT_ENGLISH_PROGRESS_MAP.B1,
      portfolioProgress: buildDefaultPortfolioProgress(
        DEFAULT_ENGLISH_PROGRESS_MAP[normalizedEnglishLevel] || DEFAULT_ENGLISH_PROGRESS_MAP.B1,
        normalizedMotivation
      ),
      nextMilestone: buildDefaultMilestone(
        DEFAULT_ENGLISH_PROGRESS_MAP[normalizedEnglishLevel] || DEFAULT_ENGLISH_PROGRESS_MAP.B1,
        buildDefaultPortfolioProgress(
          DEFAULT_ENGLISH_PROGRESS_MAP[normalizedEnglishLevel] || DEFAULT_ENGLISH_PROGRESS_MAP.B1,
          normalizedMotivation
        )
      ),
      achievementIds: [],
      certificates: [],
      createdAt: new Date().toISOString()
    };

    state.users.push(user);
    await saveState(state);

    return res.status(201).json({
      ok: true,
      user: toPublicUser(user)
    });
  } catch (error) {
    return res.status(500).json({ error: 'Ошибка сервера при регистрации.' });
  }
};
