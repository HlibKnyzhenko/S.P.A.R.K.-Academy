const { kv } = require('@vercel/kv');

const DATA_KEY = 'spark_global_data_v1';

const defaultAcademyData = {
  lessons: [
    'Понедельник, 17:00 - Grammar Boost',
    'Среда, 18:00 - Speaking Club',
    'Пятница, 16:30 - IELTS Practice'
  ],
  teachers: [
    'Анна Коваленко - Speaking & Pronunciation',
    'Максим Петренко - Grammar',
    'Olivia Brown - IELTS Coach'
  ],
  homework: [
    'До среды: выучить 20 новых слов по теме Education.',
    'До пятницы: эссе 120-150 слов на тему My future studies.',
    'Перед следующим уроком: пройти Listening Set 3.'
  ]
};

const defaultState = {
  users: [],
  academyData: defaultAcademyData
};

function sanitizeAcademyData(input) {
  if (!input || typeof input !== 'object') {
    return defaultAcademyData;
  }

  const lessons = Array.isArray(input.lessons) && input.lessons.length ? input.lessons : defaultAcademyData.lessons;
  const teachers = Array.isArray(input.teachers) && input.teachers.length ? input.teachers : defaultAcademyData.teachers;
  const homework = Array.isArray(input.homework) && input.homework.length ? input.homework : defaultAcademyData.homework;

  return {
    lessons,
    teachers,
    homework
  };
}

async function getState() {
  const saved = await kv.get(DATA_KEY);
  if (!saved || typeof saved !== 'object') {
    return defaultState;
  }

  const users = Array.isArray(saved.users) ? saved.users : [];
  const academyData = sanitizeAcademyData(saved.academyData);

  return { users, academyData };
}

async function saveState(state) {
  await kv.set(DATA_KEY, state);
}

module.exports = {
  defaultAcademyData,
  sanitizeAcademyData,
  getState,
  saveState
};
