const { getState, saveState, sanitizeAcademyData, defaultAcademyData } = require('./_lib/store');

module.exports = async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const state = await getState();
      return res.status(200).json({ ok: true, academyData: state.academyData });
    }

    if (req.method === 'POST') {
      const { lessons, teachers, homework, adminPassword } = req.body || {};
      const serverAdminPassword = process.env.ADMIN_PANEL_PASSWORD || 'spark-admin-2026';

      if (adminPassword !== serverAdminPassword) {
        return res.status(401).json({ error: 'Неверный админ пароль.' });
      }

      const academyData = sanitizeAcademyData({ lessons, teachers, homework });
      const state = await getState();
      state.academyData = academyData;
      await saveState(state);

      return res.status(200).json({ ok: true, academyData });
    }

    if (req.method === 'DELETE') {
      const { adminPassword } = req.body || {};
      const serverAdminPassword = process.env.ADMIN_PANEL_PASSWORD || 'spark-admin-2026';

      if (adminPassword !== serverAdminPassword) {
        return res.status(401).json({ error: 'Неверный админ пароль.' });
      }

      const state = await getState();
      state.academyData = defaultAcademyData;
      await saveState(state);

      return res.status(200).json({ ok: true, academyData: defaultAcademyData });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ error: 'Ошибка сервера при работе с данными.' });
  }
};
