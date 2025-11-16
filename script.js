// Подключаем Appwrite
const client = new Appwrite.Client();
const account = new Appwrite.Account(client);
const database = new Appwrite.Databases(client);

// Настройки Appwrite
client
  .setEndpoint('https://fra.cloud.appwrite.io/v1') // твой endpoint
  .setProject('6919bd9c00395c67f284'); // ID проекта

const DATABASE_ID = 'default'; // или ID базы данных
const USERS_COLLECTION_ID = 'users'; // ID коллекции "users"

// Регистрация пользователя
async function register() {
  const fullName = document.getElementById('regName').value;
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;
  const role = document.getElementById('regRole').value;

  try {
    // Создаём аккаунт
    const user = await account.create(email, password, fullName);

    // Сохраняем дополнительные данные в коллекцию users
    await database.createDocument(DATABASE_ID, USERS_COLLECTION_ID, user.$id, {
      fullName,
      email,
      role,
      createdOn: new Date().toISOString(),
    });

    alert('Пользователь зарегистрирован!');
  } catch (error) {
    alert('Ошибка: ' + error.message);
  }
}

// Вход пользователя
async function login() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    // Вход
    const session = await account.createSession(email, password);

    // Получаем данные пользователя из коллекции
    const docs = await database.listDocuments(DATABASE_ID, USERS_COLLECTION_ID, [
      Appwrite.Query.equal('email', email),
    ]);

    if (docs.documents.length === 0) throw new Error('Пользователь не найден');

    const profile = docs.documents[0];
    alert(`Вход выполнен! Роль: ${profile.role}`);
  } catch (error) {
    alert('Ошибка: ' + error.message);
  }
}

// Выход
async function logout() {
  try {
    await account.deleteSession('current');
    alert('Вы вышли из аккаунта!');
  } catch (error) {
    console.log(error);
  }
}
