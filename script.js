async function loginAdmin() {
    const passwordInput = document.getElementById('admin-password'); // Убедись, что ID совпадает с твоим input
    const password = passwordInput.value;
    const errorText = document.querySelector('.error-message');

    try {
        const response = await fetch('/api/check-auth', {
            method: 'POST', // Обязательно POST, как мы указали в check-auth.js
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: password }) // Отправляем пароль в теле запроса
        });

        const data = await response.json();

        if (response.ok && data.success) {
            // Если всё верно, переходим в админку
            window.location.href = 'admin.html'; 
        } else {
            // Если пароль неверный
            alert('Неверный пароль!');
        }
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Ошибка запроса. Проверь консоль (F12).');
    }
}