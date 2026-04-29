import store from "../../../lib/server/store.js";
import security from "../../../lib/server/security.js";

const {
  DEFAULT_ADMIN_PASSWORD,
  DEFAULT_ENGLISH_PROGRESS_MAP,
  buildDefaultMilestone,
  buildDefaultPortfolioProgress,
  defaultAcademyData,
  getState,
  sanitizeAcademyData,
  sanitizeUserRecord,
  toAdminUser,
  toPublicUser,
  saveState,
} = store;
const { hashPassword } = security;

const ADMIN_TIMEZONE = "Europe/Kyiv";

function json(payload, status = 200) {
  return Response.json(payload, { status });
}

async function readBody(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

function isAdminPasswordValid(password) {
  const adminPassword = process.env.ADMIN_PANEL_PASSWORD || DEFAULT_ADMIN_PASSWORD;
  return Boolean(password) && password === adminPassword;
}

function formatDayKey(value) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: ADMIN_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(value);
}

async function handleSyncProfile(body) {
  const normalizedEmail = String(body.email || "").trim().toLowerCase();
  const normalizedName = String(body.name || "").trim() || "Student";

  if (!normalizedEmail || !normalizedEmail.includes("@")) {
    return json({ error: "Некорректный email." }, 400);
  }

  const state = await getState();
  const existingUser = state.users.find((user) => user.email === normalizedEmail);

  if (existingUser) {
    return json({ ok: true, user: toPublicUser(existingUser) });
  }

  const englishProgress = DEFAULT_ENGLISH_PROGRESS_MAP["NOT SURE"];
  const motivation = "Clerk account synced for dashboard access.";
  const portfolioProgress = buildDefaultPortfolioProgress(englishProgress, motivation);
  const newUser = {
    id: `u_${Date.now()}`,
    name: normalizedName,
    email: normalizedEmail,
    passwordHash: "",
    adminVisiblePassword: "",
    englishLevel: "NOT SURE",
    motivation,
    englishProgress,
    portfolioProgress,
    nextMilestone: buildDefaultMilestone(englishProgress, portfolioProgress),
    achievementIds: [],
    certificates: [],
    createdAt: new Date().toISOString(),
  };

  state.users.push(newUser);
  await saveState(state);

  return json({ ok: true, user: toPublicUser(newUser) }, 201);
}

async function handleLogin(body) {
  if (!isAdminPasswordValid(body.password)) {
    return json({ error: "Неверный админ пароль." }, 401);
  }

  return json({ ok: true });
}

async function handleStats(body) {
  if (!isAdminPasswordValid(body.adminPassword)) {
    return json({ error: "Неверный админ пароль." }, 401);
  }

  const state = await getState();
  const todayKey = formatDayKey(new Date());
  const users = Array.isArray(state.users) ? state.users : [];
  const registeredToday = users.filter((user) => {
    if (!user?.createdAt) {
      return false;
    }

    const createdAt = new Date(user.createdAt);
    return !Number.isNaN(createdAt.getTime()) && formatDayKey(createdAt) === todayKey;
  }).length;

  return json({
    ok: true,
    stats: {
      totalStudents: users.length,
      registeredToday,
    },
  });
}

async function handleStudents(body) {
  if (!isAdminPasswordValid(body.adminPassword)) {
    return json({ error: "Неверный админ пароль." }, 401);
  }

  const state = await getState();
  return json({
    ok: true,
    users: state.users.map((user) => toAdminUser(user)).filter(Boolean),
  });
}

async function handleUpdateStudent(body) {
  if (!isAdminPasswordValid(body.adminPassword)) {
    return json({ error: "Неверный админ пароль." }, 401);
  }

  const state = await getState();
  const normalizedUserId = String(body.userId || "").trim();
  const userIndex = state.users.findIndex((user) => user.id === normalizedUserId);

  if (userIndex === -1) {
    return json({ error: "Ученик не найден." }, 404);
  }

  const existingUser = state.users[userIndex];
  const payload = body.updates && typeof body.updates === "object" ? body.updates : {};
  const nextPassword = String(payload.newPassword || "").trim();

  if (nextPassword && nextPassword.length < 6) {
    return json({ error: "Новый пароль должен быть минимум 6 символов." }, 400);
  }

  const sanitizedUser = sanitizeUserRecord({
    ...existingUser,
    ...payload,
    passwordHash: nextPassword ? hashPassword(nextPassword) : existingUser.passwordHash,
    adminVisiblePassword: nextPassword || payload.adminVisiblePassword || existingUser.adminVisiblePassword,
  });

  if (!sanitizedUser) {
    return json({ error: "Некорректные данные ученика." }, 400);
  }

  state.users[userIndex] = sanitizedUser;
  await saveState(state);

  return json({
    ok: true,
    user: toAdminUser(sanitizedUser),
    users: state.users.map((user) => toAdminUser(user)).filter(Boolean),
  });
}

async function handleAcademyData(request, body) {
  if (request.method === "GET") {
    const state = await getState();
    return json({ ok: true, academyData: state.academyData });
  }

  if (!isAdminPasswordValid(body.adminPassword)) {
    return json({ error: "Неверный админ пароль." }, 401);
  }

  if (body.action === "resetAcademyData") {
    const state = await getState();
    state.academyData = defaultAcademyData;
    await saveState(state);
    return json({ ok: true, academyData: defaultAcademyData });
  }

  const academyData = sanitizeAcademyData({
    hero: body.hero,
    intake: body.intake,
    roadmap: body.roadmap,
    webinar: body.webinar,
    webinarLink: body.webinarLink,
    achievementsCatalog: body.achievementsCatalog,
    lessons: body.lessons,
    teachers: body.teachers,
    workshops: body.workshops,
    homework: body.homework,
  });
  const state = await getState();
  state.academyData = academyData;
  await saveState(state);

  return json({ ok: true, academyData });
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  try {
    if (action === "academyData") {
      return handleAcademyData(request, {});
    }

    return json({ error: "Unknown action." }, 404);
  } catch {
    return json({ error: "Ошибка сервера при работе с данными." }, 500);
  }
}

export async function POST(request) {
  const body = await readBody(request);

  try {
    switch (body.action) {
      case "syncProfile":
        return handleSyncProfile(body);
      case "login":
        return handleLogin(body);
      case "stats":
        return handleStats(body);
      case "students":
        return handleStudents(body);
      case "updateStudent":
        return handleUpdateStudent(body);
      case "saveAcademyData":
      case "resetAcademyData":
        return handleAcademyData(request, body);
      default:
        return json({ error: "Unknown action." }, 404);
    }
  } catch {
    return json({ error: "Ошибка сервера при работе с данными." }, 500);
  }
}
