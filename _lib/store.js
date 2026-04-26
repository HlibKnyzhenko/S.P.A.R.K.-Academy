const { kv } = require('@vercel/kv');

const DATA_KEY = 'spark_global_data_v1';
const CERTIFICATE_MAX_SIZE = 2_000_000;
const ALLOWED_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'NOT SURE'];
const DEFAULT_ENGLISH_PROGRESS_MAP = {
  A1: 18,
  A2: 36,
  B1: 64,
  B2: 100,
  C1: 100,
  C2: 100,
  'NOT SURE': 26
};

const defaultAchievementsCatalog = [
  {
    id: 'interview-applicant',
    title: 'Interview Applicant',
    description: 'Заявка подана, а профиль активирован в системе.'
  },
  {
    id: 'homework-hero',
    title: 'Homework Hero',
    description: 'Домашние задания стабильно закрываются и двигают ученика вперед.'
  },
  {
    id: 'perfect-speaking-session',
    title: 'Perfect Speaking Session',
    description: 'Сильное speaking-выступление и уверенная академическая коммуникация.'
  },
  {
    id: 'portfolio-architect',
    title: 'Portfolio Architect',
    description: 'Портфолио собрано в сильную историю кандидата.'
  }
];

const defaultAcademyData = {
  intake: {
    cohortLabel: 'весенний поток',
    remainingSeats: 4,
    totalSeats: 15
  },
  webinarLink: '',
  achievementsCatalog: defaultAchievementsCatalog,
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

function slugify(value, fallback) {
  const slug = String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50);

  return slug || fallback;
}

function normalizeLevel(value) {
  const normalized = String(value || 'B1').trim().toUpperCase();
  if (normalized === 'НЕ ЗНАЮ ТОЧНО') {
    return 'NOT SURE';
  }

  return ALLOWED_LEVELS.includes(normalized) ? normalized : 'B1';
}

function clampProgress(value, fallback) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return Math.max(0, Math.min(100, Math.round(fallback)));
  }

  return Math.max(0, Math.min(100, Math.round(numeric)));
}

function buildDefaultPortfolioProgress(englishProgress, motivation) {
  const motivationLength = String(motivation || '').trim().length;
  return Math.min(100, Math.max(36, Math.round((englishProgress * 0.72) + Math.min(16, Math.floor(motivationLength / 16)) + 12)));
}

function buildDefaultMilestone(englishProgress, portfolioProgress) {
  if (englishProgress < 100) {
    return 'Пройти интервью уровня и войти в интенсив по English & Soft Skills.';
  }

  if (portfolioProgress < 85) {
    return 'Собрать 3 сильных кейса и оформить академическую историю для портфолио.';
  }

  return 'Подготовить shortlist колледжей или стажировок и выйти на подачу.';
}

function sanitizeAchievement(input, index) {
  if (!input || typeof input !== 'object') {
    return null;
  }

  const title = String(input.title || '').trim();
  const description = String(input.description || '').trim();
  const fallbackId = `achievement-${index + 1}`;
  const id = slugify(input.id || title, fallbackId);

  if (!title) {
    return null;
  }

  return {
    id,
    title,
    description
  };
}

function sanitizeAchievementsCatalog(input) {
  const source = Array.isArray(input)
    ? input.map((item, index) => sanitizeAchievement(item, index)).filter(Boolean)
    : defaultAchievementsCatalog.map((item, index) => sanitizeAchievement(item, index)).filter(Boolean);

  const result = [];
  const usedIds = new Set();

  for (const item of source) {
    if (!item || usedIds.has(item.id)) {
      continue;
    }

    usedIds.add(item.id);
    result.push(item);
  }

  return result;
}

function sanitizeCertificate(input, index) {
  if (!input || typeof input !== 'object') {
    return null;
  }

  const dataUrl = String(input.dataUrl || '').trim();
  if (!dataUrl.startsWith('data:') || dataUrl.length > CERTIFICATE_MAX_SIZE) {
    return null;
  }

  const name = String(input.name || '').trim() || `certificate-${index + 1}`;
  const type = String(input.type || 'application/octet-stream').trim() || 'application/octet-stream';
  const uploadedAt = String(input.uploadedAt || new Date().toISOString()).trim() || new Date().toISOString();
  const id = String(input.id || `${slugify(name, `certificate-${index + 1}`)}-${index + 1}`).trim();

  return {
    id,
    name,
    type,
    dataUrl,
    uploadedAt
  };
}

function sanitizeUserRecord(input) {
  if (!input || typeof input !== 'object') {
    return null;
  }

  const email = String(input.email || '').trim().toLowerCase();
  if (!email || !email.includes('@')) {
    return null;
  }

  const name = String(input.name || '').trim() || 'Student';
  const englishLevel = normalizeLevel(input.englishLevel);
  const motivation = String(input.motivation || '').trim();
  const englishProgress = clampProgress(input.englishProgress, DEFAULT_ENGLISH_PROGRESS_MAP[englishLevel] || DEFAULT_ENGLISH_PROGRESS_MAP.B1);
  const portfolioProgress = clampProgress(
    input.portfolioProgress,
    buildDefaultPortfolioProgress(englishProgress, motivation)
  );
  const nextMilestone = String(input.nextMilestone || buildDefaultMilestone(englishProgress, portfolioProgress)).trim()
    || buildDefaultMilestone(englishProgress, portfolioProgress);
  const achievementIds = Array.isArray(input.achievementIds)
    ? Array.from(new Set(input.achievementIds.map((item) => String(item || '').trim()).filter(Boolean)))
    : [];
  const certificates = Array.isArray(input.certificates)
    ? input.certificates.map((item, index) => sanitizeCertificate(item, index)).filter(Boolean)
    : [];

  return {
    id: String(input.id || `u_${slugify(email, 'student')}`).trim(),
    name,
    email,
    passwordHash: String(input.passwordHash || '').trim(),
    adminVisiblePassword: String(input.adminVisiblePassword || input.passwordPlain || '').trim(),
    englishLevel,
    motivation,
    englishProgress,
    portfolioProgress,
    nextMilestone,
    achievementIds,
    certificates,
    createdAt: String(input.createdAt || new Date().toISOString()).trim() || new Date().toISOString()
  };
}

function toPublicUser(user) {
  const sanitized = sanitizeUserRecord(user);
  if (!sanitized) {
    return null;
  }

  return {
    id: sanitized.id,
    name: sanitized.name,
    email: sanitized.email,
    englishLevel: sanitized.englishLevel,
    motivation: sanitized.motivation,
    englishProgress: sanitized.englishProgress,
    portfolioProgress: sanitized.portfolioProgress,
    nextMilestone: sanitized.nextMilestone,
    achievementIds: sanitized.achievementIds,
    certificates: sanitized.certificates
  };
}

function toAdminUser(user) {
  const sanitized = sanitizeUserRecord(user);
  if (!sanitized) {
    return null;
  }

  return {
    ...toPublicUser(sanitized),
    adminVisiblePassword: sanitized.adminVisiblePassword,
    createdAt: sanitized.createdAt
  };
}

function sanitizeAcademyData(input) {
  if (!input || typeof input !== 'object') {
    return {
      ...defaultAcademyData,
      achievementsCatalog: sanitizeAchievementsCatalog(defaultAcademyData.achievementsCatalog)
    };
  }

  const intakeInput = input.intake && typeof input.intake === 'object' ? input.intake : {};
  const remainingSeats = Number.isFinite(Number(intakeInput.remainingSeats))
    ? Math.max(0, Number(intakeInput.remainingSeats))
    : defaultAcademyData.intake.remainingSeats;
  const totalSeats = Number.isFinite(Number(intakeInput.totalSeats))
    ? Math.max(1, Number(intakeInput.totalSeats))
    : defaultAcademyData.intake.totalSeats;
  const intake = {
    cohortLabel: String(intakeInput.cohortLabel || defaultAcademyData.intake.cohortLabel).trim() || defaultAcademyData.intake.cohortLabel,
    remainingSeats: Math.min(remainingSeats, totalSeats),
    totalSeats
  };
  const lessons = Array.isArray(input.lessons) && input.lessons.length ? input.lessons : defaultAcademyData.lessons;
  const teachers = Array.isArray(input.teachers) && input.teachers.length ? input.teachers : defaultAcademyData.teachers;
  const homework = Array.isArray(input.homework) && input.homework.length ? input.homework : defaultAcademyData.homework;
  const webinarLink = String(input.webinarLink || '').trim();
  const achievementsCatalog = Array.isArray(input.achievementsCatalog)
    ? sanitizeAchievementsCatalog(input.achievementsCatalog)
    : sanitizeAchievementsCatalog(defaultAcademyData.achievementsCatalog);

  return {
    intake,
    webinarLink,
    achievementsCatalog,
    lessons,
    teachers,
    homework
  };
}

async function getState() {
  const saved = await kv.get(DATA_KEY);
  if (!saved || typeof saved !== 'object') {
    return {
      ...defaultState,
      academyData: sanitizeAcademyData(defaultState.academyData)
    };
  }

  const academyData = sanitizeAcademyData(saved.academyData);
  const allowedAchievementIds = new Set(academyData.achievementsCatalog.map((item) => item.id));
  const users = Array.isArray(saved.users)
    ? saved.users
        .map((item) => sanitizeUserRecord(item))
        .filter(Boolean)
        .map((item) => ({
          ...item,
          achievementIds: item.achievementIds.filter((id) => allowedAchievementIds.has(id))
        }))
    : [];

  return { users, academyData };
}

async function saveState(state) {
  await kv.set(DATA_KEY, state);
}

module.exports = {
  ALLOWED_LEVELS,
  DEFAULT_ENGLISH_PROGRESS_MAP,
  buildDefaultMilestone,
  buildDefaultPortfolioProgress,
  defaultAchievementsCatalog,
  defaultAcademyData,
  sanitizeAcademyData,
  sanitizeAchievementsCatalog,
  sanitizeUserRecord,
  getState,
  saveState,
  toAdminUser,
  toPublicUser
};
