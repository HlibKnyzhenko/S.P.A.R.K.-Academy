// --------------------
// script.js
// --------------------

// Импортируем Appwrite SDK
const { Client, Account, ID } = require('appwrite');

// --------------------
// Настраиваем клиент
// --------------------
const client = new Client();

client
  .setEndpoint('https://fra.cloud.appwrite.io/v1') // твой API endpoint
  .setProject('6919bd9c00395c67f284');             // твой Project ID

const account = new Account(client);

// --------------------
// Функция регистрации
// --------------------
async function registerUser(email, password, name) {
  try {
    const response = await account.create(ID.unique(), email, password, name);
    console.log('Регистрация успешна:', response);
    return response;
  } catch (error) {
    console.error('Ошибка при регистрации:', error.message);
  }
}

// --------------------
// Функция входа
// --------------------
async function loginUser(email, password) {
  try {
    // Создаём сессию
    const session = await account.createSession(email, password);
    console.log('Вход успешен! Сессия:', session);

    // Получаем данные пользователя (личный кабинет)
    const user = await account.get();
    console.log('Личный кабинет:', user);

    return user;
  } catch (error) {
    console.error('Ошибка при входе:', error.message);
  }
}

// --------------------
// Примеры использования
// --------------------

// 1️⃣ Зарегистрировать нового пользователя
// Разкомментируй, если нужно создать нового
// registerUser('user@example.com', 'password123', 'Gleb');

// 2️⃣ Войти пользователю
loginUser('user@example.com', 'password123');
