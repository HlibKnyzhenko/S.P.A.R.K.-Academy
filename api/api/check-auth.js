export default function handler(req, res) {
  // 1. Проверяем, что это POST запрос (отправка данных)
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Только POST запросы' });
  }

  // 2. Достаем пароль, который ты ввел на сайте
  const { password } = req.body;

  // 3. Берем правильный пароль из настроек Vercel
  const correctPassword = process.env.ADMIN_PANEL_PASSWORD;

  // 4. Сравниваем их
  if (password === correctPassword) {
    // Если совпало — успех!
    return res.status(200).json({ success: true });
  } else {
    // Если нет — ошибка
    return res.status(401).json({ success: false, message: 'Неверный пароль' });
  }
}