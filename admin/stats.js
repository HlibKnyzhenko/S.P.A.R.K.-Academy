const { getState } = require('../_lib/store');

const ADMIN_TIMEZONE = 'Europe/Kyiv';

function formatDayKey(value) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: ADMIN_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(value);
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { adminPassword } = req.body || {};
    const serverAdminPassword = process.env.ADMIN_PANEL_PASSWORD || 'spark-admin-2026';

    if (!adminPassword || adminPassword !== serverAdminPassword) {
      return res.status(401).json({ error: 'Неверный админ пароль.' });
    }

    const state = await getState();
    const todayKey = formatDayKey(new Date());
    const users = Array.isArray(state.users) ? state.users : [];
    const registeredToday = users.filter((user) => {
      if (!user || !user.createdAt) {
        return false;
      }

      const createdAt = new Date(user.createdAt);
      if (Number.isNaN(createdAt.getTime())) {
        return false;
      }

      return formatDayKey(createdAt) === todayKey;
    }).length;

    return res.status(200).json({
      ok: true,
      stats: {
        totalStudents: users.length,
        registeredToday
      }
    });
  } catch (error) {
    return res.status(500).json({ error: 'Ошибка сервера при получении статистики.' });
  }
};
