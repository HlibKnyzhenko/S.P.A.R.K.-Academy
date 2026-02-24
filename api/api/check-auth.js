export default async function handler(req, res) {
  // Разрешаем только POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // В Vercel req.body для JSON объектов обычно уже распарсен,
    // но на всякий случай проверяем наличие данных
    const { password } = req.body;

    const correctPassword = process.env.ADMIN_PANEL_PASSWORD;

    if (!correctPassword) {
      console.error("Критическая ошибка: ADMIN_PANEL_PASSWORD не задан в настройках Vercel!");
      return res.status(500).json({ success: false, error: "Server config error" });
    }

    if (password === correctPassword) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(401).json({ success: false, message: "Wrong password" });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}