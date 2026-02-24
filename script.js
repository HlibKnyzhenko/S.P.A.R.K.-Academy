async function loginToAdmin() {
    const passwordInput = document.getElementById('adminPasswordInput'); // Убедись, что ID совпадает с твоим HTML
    const password = passwordInput.value;
    const errorText = document.querySelector('.error-message'); // Твой элемент для вывода ошибки

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            // Если пароль верный, сохраняем токен и переходим в админку
            localStorage.setItem('adminToken', data.token);
            window.location.href = '/admin-panel.html'; 
        } else {
            errorText.textContent = 'Неверный пароль';
            errorText.style.display = 'block';
        }
    } catch (error) {
        console.error('Ошибка:', error);
        errorText.textContent = 'Ошибка запроса к серверу';
        errorText.style.display = 'block';
    }
}