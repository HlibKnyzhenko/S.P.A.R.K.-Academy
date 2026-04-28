export default function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { password } = req.body;
    
    // Vercel подставит сюда значение из твоих настроек Settings -> Environment Variables
    const correctPassword = process.env.ADMIN_PANEL_PASSWORD;

    if (password === correctPassword) {
        // В реальности здесь лучше генерировать настоящий токен
        return res.status(200).json({ success: true, token: 'secret-admin-session' });
    } else {
        return res.status(401).json({ success: false, message: 'Invalid password' });
    }
}