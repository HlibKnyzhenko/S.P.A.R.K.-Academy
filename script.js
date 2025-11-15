// Подключаемся к Supabase
const supabaseUrl = 'https://bsurvnbwztedrtsvafoh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzdXJ2bmJ3enRlZHRTdmFmT2giLCJyb2xlIjoiYW5vbiIsImlhdCI6MTc2MzIyNDY3NSwiZXhwIjoyMDc4ODAwNjc1fQ.AhuOEVer2A9Baj56pzblu8p7D4_sS4ZdgpdiVCjC-Ko';

const supabase = Supabase.createClient(supabaseUrl, supabaseKey);

// Регистрация
async function register() {
  const fullName = document.getElementById('regName').value;
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;
  const role = document.getElementById('regRole').value;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName, role } }
  });

  if (error) alert(error.message);
  else {
    // Добавляем в таблицу profiles
    await supabase.from('profiles').insert([
      { id: data.user.id, full_name: fullName, role }
    ]);
    alert('Пользователь зарегистрирован!');
  }
}

// Вход
async function login() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return alert(error.message);

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .single();

  alert(`Вход выполнен! Роль: ${profile.role}`);
}
