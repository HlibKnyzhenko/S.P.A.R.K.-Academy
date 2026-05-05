"use client";

import { useEffect, useMemo, useState } from "react";

export const languages = [
  { code: "ru", label: "Русский", shortLabel: "RU" },
  { code: "en", label: "English", shortLabel: "EN" },
  { code: "uk", label: "Українська", shortLabel: "UA" },
];

const fallbackLanguage = "ru";

const ui = {
  ru: {
    adminPanel: "Админ панель",
    openAdminPanel: "Открыть админ панель",
    openCabinet: "Открыть личный кабинет",
    signIn: "Войти",
    applyForInterview: "Подать заявку на интервью",
    founderKicker: "Основатель",
    founderName: "Глеб Кныженко",
    founderRole: "Founder of S.P.A.R.K. Academy",
    founderPhotoAlt: "Глеб Кныженко, основатель S.P.A.R.K. Academy",
    openFounderPortfolio: "Открыть портфолио",
    strategicForm: "Стратегическая заявка",
    formDescription:
      "Это отборочный маршрут. Расскажи, почему твоя амбиция, дисциплина и потенциал портфолио заслуживают одно из оставшихся мест.",
    fullName: "Твоё полное имя",
    email: "Email",
    motivation: "Почему мы должны выбрать тебя?",
    formError: "Заполни все поля и опиши мотивацию подробнее.",
    draftNote: "После отправки ты перейдёшь на безопасную регистрацию. Черновик ответа сохранится в этом браузере.",
    roadmap: "Интерактивная дорожная карта",
    routeTitle: "Маршрут от интервью до поступления.",
    teachers: "Преподаватели",
    webinarWorkshops: "Вебинар и воркшопы",
    openWebinar: "Открыть ссылку вебинара",
    webinarMissing: "Админ панель добавит ссылку на эфир здесь.",
    join: "Присоединиться",
    seats: "Набор на {cohort}: осталось {remaining} места из {total}",
    cabinetBadge: "Личный кабинет 2.0",
    welcome: "Добро пожаловать, {name}",
    dashboardIntro:
      "Отслеживай готовность портфолио, открывай достижения, следи за воркшопами и оставайся в ритме интервью-маршрута.",
    nextMilestone: "Следующий шаг:",
    syncError: "Не удалось синхронизировать профиль. Обнови страницу.",
    englishProgress: "Прогресс английского до целевого уровня",
    portfolioReadiness: "Готовность портфолио",
    achievementsSystem: "Система достижений",
    unlockedBadges: "Открытые бейджи",
    unlocked: "Открыто",
    locked: "Закрыто",
    certificates: "Сертификаты",
    proofProgress: "Твои подтверждения прогресса",
    uploaded: "Загружено",
    openOnSite: "Открыть на сайте",
    download: "Скачать",
    certificatesMissing: "Сертификаты, добавленные в админ панели, появятся здесь.",
    webinar: "Вебинар",
    openWorkshop: "Присоединиться к воркшопу",
    previewNote: "Предпросмотр сертификата с праздничной анимацией.",
    close: "Закрыть",
    downloadCertificate: "Скачать сертификат",
  },
  en: {
    adminPanel: "Admin panel",
    openAdminPanel: "Open admin panel",
    openCabinet: "Open personal cabinet",
    signIn: "Sign in",
    applyForInterview: "Apply for interview",
    founderKicker: "Founder",
    founderName: "Hlib Knyzhenko",
    founderRole: "Founder of S.P.A.R.K. Academy",
    founderPhotoAlt: "Hlib Knyzhenko, founder of S.P.A.R.K. Academy",
    openFounderPortfolio: "Open portfolio",
    strategicForm: "Strategic application form",
    formDescription:
      "This is a selective route. Tell us why your ambition, discipline, and portfolio potential deserve one of the remaining seats.",
    fullName: "Your full name",
    email: "Email address",
    motivation: "Why should we choose you?",
    formError: "Please answer every field and make your motivation more detailed.",
    draftNote: "After submission you will move to a secure sign-up flow. Your draft will stay in this browser.",
    roadmap: "Interactive roadmap",
    routeTitle: "The route from interview to admission.",
    teachers: "Teachers",
    webinarWorkshops: "Webinar & Workshops",
    openWebinar: "Open webinar link",
    webinarMissing: "The admin panel will add the live link here.",
    join: "Join",
    seats: "Enrollment for {cohort}: {remaining} of {total} seats left",
    cabinetBadge: "Personal cabinet 2.0",
    welcome: "Welcome, {name}",
    dashboardIntro:
      "Track portfolio readiness, unlock achievements, follow workshops, and stay close to the interview route without losing momentum.",
    nextMilestone: "Next milestone:",
    syncError: "Profile sync failed. Try refreshing the page.",
    englishProgress: "English progress to target level",
    portfolioReadiness: "Portfolio readiness",
    achievementsSystem: "Achievement system",
    unlockedBadges: "Unlocked badges",
    unlocked: "Unlocked",
    locked: "Locked",
    certificates: "Certificates",
    proofProgress: "Your proof of progress",
    uploaded: "Uploaded",
    openOnSite: "Open on site",
    download: "Download",
    certificatesMissing: "Certificates added by the admin panel will appear here.",
    webinar: "Webinar",
    openWorkshop: "Join workshop",
    previewNote: "Certificate preview with celebration animation.",
    close: "Close",
    downloadCertificate: "Download certificate",
  },
  uk: {
    adminPanel: "Адмін панель",
    openAdminPanel: "Відкрити адмін панель",
    openCabinet: "Відкрити особистий кабінет",
    signIn: "Увійти",
    applyForInterview: "Подати заявку на інтерв'ю",
    founderKicker: "Засновник",
    founderName: "Гліб Книженко",
    founderRole: "Founder of S.P.A.R.K. Academy",
    founderPhotoAlt: "Гліб Книженко, засновник S.P.A.R.K. Academy",
    openFounderPortfolio: "Відкрити портфоліо",
    strategicForm: "Стратегічна заявка",
    formDescription:
      "Це відбірковий маршрут. Розкажи, чому твої амбіції, дисципліна та потенціал портфоліо заслуговують одне з місць, що залишилися.",
    fullName: "Твоє повне ім'я",
    email: "Email",
    motivation: "Чому ми маємо обрати тебе?",
    formError: "Заповни всі поля та опиши мотивацію детальніше.",
    draftNote: "Після відправлення ти перейдеш до безпечної реєстрації. Чернетка відповіді збережеться в цьому браузері.",
    roadmap: "Інтерактивна дорожня карта",
    routeTitle: "Маршрут від інтерв'ю до вступу.",
    teachers: "Викладачі",
    webinarWorkshops: "Вебінар і воркшопи",
    openWebinar: "Відкрити посилання вебінару",
    webinarMissing: "Адмін панель додасть посилання на ефір тут.",
    join: "Приєднатися",
    seats: "Набір на {cohort}: залишилося {remaining} місця з {total}",
    cabinetBadge: "Особистий кабінет 2.0",
    welcome: "Вітаємо, {name}",
    dashboardIntro:
      "Відстежуй готовність портфоліо, відкривай досягнення, стеж за воркшопами та тримай темп інтерв'ю-маршруту.",
    nextMilestone: "Наступний крок:",
    syncError: "Не вдалося синхронізувати профіль. Онови сторінку.",
    englishProgress: "Прогрес англійської до цільового рівня",
    portfolioReadiness: "Готовність портфоліо",
    achievementsSystem: "Система досягнень",
    unlockedBadges: "Відкриті бейджі",
    unlocked: "Відкрито",
    locked: "Закрито",
    certificates: "Сертифікати",
    proofProgress: "Твої підтвердження прогресу",
    uploaded: "Завантажено",
    openOnSite: "Відкрити на сайті",
    download: "Завантажити",
    certificatesMissing: "Сертифікати, додані в адмін панелі, з'являться тут.",
    webinar: "Вебінар",
    openWorkshop: "Приєднатися до воркшопу",
    previewNote: "Попередній перегляд сертифіката зі святковою анімацією.",
    close: "Закрити",
    downloadCertificate: "Завантажити сертифікат",
  },
};

const contentTranslations = {
  "Academy with international recognition": {
    ru: "Академия с международным признанием",
    en: "Academy with international recognition",
    uk: "Академія з міжнародним визнанням",
  },
  "Твой путь в топовые колледжи США начинается здесь. Академия с международным признанием.": {
    ru: "Твой путь в топовые колледжи США начинается здесь. Академия с международным признанием.",
    en: "Your path to top U.S. colleges starts here. An academy with international recognition.",
    uk: "Твій шлях до топових коледжів США починається тут. Академія з міжнародним визнанням.",
  },
  "S.P.A.R.K. Academy combines English, soft skills, portfolio strategy, and interview preparation into one selective route for ambitious students.": {
    ru: "S.P.A.R.K. Academy объединяет английский, soft skills, стратегию портфолио и подготовку к интервью в один отборочный маршрут для амбициозных учеников.",
    en: "S.P.A.R.K. Academy combines English, soft skills, portfolio strategy, and interview preparation into one selective route for ambitious students.",
    uk: "S.P.A.R.K. Academy поєднує англійську, soft skills, стратегію портфоліо та підготовку до інтерв'ю в один відбірковий маршрут для амбітних учнів.",
  },
  "Apply for an interview": {
    ru: "Подать заявку на интервью",
    en: "Apply for an interview",
    uk: "Подати заявку на інтерв'ю",
  },
  "весенний поток": { ru: "весенний поток", en: "spring cohort", uk: "весняний потік" },
  "Шаг 1: Тестирование уровня и интервью": {
    ru: "Шаг 1: Тестирование уровня и интервью",
    en: "Step 1: Level test and interview",
    uk: "Крок 1: Тестування рівня та інтерв'ю",
  },
  "Определяем стартовую точку, амбиции и готовность к интенсивному маршруту.": {
    ru: "Определяем стартовую точку, амбиции и готовность к интенсивному маршруту.",
    en: "We define the starting point, ambitions, and readiness for an intensive route.",
    uk: "Визначаємо стартову точку, амбіції та готовність до інтенсивного маршруту.",
  },
  "Шаг 2: Интенсив по English & Soft Skills": {
    ru: "Шаг 2: Интенсив по English & Soft Skills",
    en: "Step 2: English & Soft Skills intensive",
    uk: "Крок 2: Інтенсив з English & Soft Skills",
  },
  "Выравниваем язык, speaking-ритм, академическую коммуникацию и уверенность.": {
    ru: "Выравниваем язык, speaking-ритм, академическую коммуникацию и уверенность.",
    en: "We strengthen language, speaking rhythm, academic communication, and confidence.",
    uk: "Підсилюємо мову, speaking-ритм, академічну комунікацію та впевненість.",
  },
  "Шаг 3: Формирование портфолио": {
    ru: "Шаг 3: Формирование портфолио",
    en: "Step 3: Portfolio building",
    uk: "Крок 3: Формування портфоліо",
  },
  "Собираем сильную историю кандидата, кейсы, волонтерство и achievements.": {
    ru: "Собираем сильную историю кандидата, кейсы, волонтерство и достижения.",
    en: "We build a strong candidate story with cases, volunteering, and achievements.",
    uk: "Збираємо сильну історію кандидата, кейси, волонтерство та досягнення.",
  },
  "Шаг 4: Подача в колледж / стажировку": {
    ru: "Шаг 4: Подача в колледж / стажировку",
    en: "Step 4: College or internship application",
    uk: "Крок 4: Подача до коледжу або на стажування",
  },
  "Выходим на shortlist, application-пакет и финальные интервью.": {
    ru: "Выходим на shortlist, application-пакет и финальные интервью.",
    en: "We prepare the shortlist, application package, and final interviews.",
    uk: "Готуємо shortlist, application-пакет і фінальні інтерв'ю.",
  },
  "Application Strategy Webinar": {
    ru: "Вебинар по стратегии поступления",
    en: "Application Strategy Webinar",
    uk: "Вебінар зі стратегії вступу",
  },
  "Каждую субботу, 18:00 Kyiv / 17:00 CET": {
    ru: "Каждую субботу, 18:00 Киев / 17:00 CET",
    en: "Every Saturday, 18:00 Kyiv / 17:00 CET",
    uk: "Щосуботи, 18:00 Київ / 17:00 CET",
  },
  "Interview Applicant": { ru: "Кандидат на интервью", en: "Interview Applicant", uk: "Кандидат на інтерв'ю" },
  "Заявка подана, а профиль активирован в системе.": {
    ru: "Заявка подана, а профиль активирован в системе.",
    en: "The application is submitted and the profile is active in the system.",
    uk: "Заявку подано, а профіль активовано в системі.",
  },
  "Homework Hero": { ru: "Герой домашних заданий", en: "Homework Hero", uk: "Герой домашніх завдань" },
  "Домашние задания стабильно закрываются и двигают ученика вперед.": {
    ru: "Домашние задания стабильно закрываются и двигают ученика вперёд.",
    en: "Homework is completed consistently and moves the student forward.",
    uk: "Домашні завдання виконуються стабільно й рухають учня вперед.",
  },
  "Perfect Speaking Session": {
    ru: "Идеальная speaking-сессия",
    en: "Perfect Speaking Session",
    uk: "Ідеальна speaking-сесія",
  },
  "Сильное speaking-выступление и уверенная академическая коммуникация.": {
    ru: "Сильное speaking-выступление и уверенная академическая коммуникация.",
    en: "A strong speaking performance and confident academic communication.",
    uk: "Сильний speaking-виступ і впевнена академічна комунікація.",
  },
  "Portfolio Architect": { ru: "Архитектор портфолио", en: "Portfolio Architect", uk: "Архітектор портфоліо" },
  "Портфолио собрано в сильную историю кандидата.": {
    ru: "Портфолио собрано в сильную историю кандидата.",
    en: "The portfolio is shaped into a strong candidate story.",
    uk: "Портфоліо зібрано в сильну історію кандидата.",
  },
  "Пройти интервью уровня и войти в интенсив по English & Soft Skills.": {
    ru: "Пройти интервью уровня и войти в интенсив по English & Soft Skills.",
    en: "Pass the level interview and enter the English & Soft Skills intensive.",
    uk: "Пройти інтерв'ю рівня та увійти в інтенсив з English & Soft Skills.",
  },
  "Собрать 3 сильных кейса и оформить академическую историю для портфолио.": {
    ru: "Собрать 3 сильных кейса и оформить академическую историю для портфолио.",
    en: "Collect 3 strong cases and shape an academic story for the portfolio.",
    uk: "Зібрати 3 сильні кейси та оформити академічну історію для портфоліо.",
  },
  "Подготовить shortlist колледжей или стажировок и выйти на подачу.": {
    ru: "Подготовить shortlist колледжей или стажировок и выйти на подачу.",
    en: "Prepare a college or internship shortlist and move into applications.",
    uk: "Підготувати shortlist коледжів або стажувань і перейти до подачі.",
  },
  "Speaking & Pronunciation Mentor": {
    ru: "Ментор по speaking и произношению",
    en: "Speaking & Pronunciation Mentor",
    uk: "Ментор зі speaking та вимови",
  },
  "Уверенное speaking, interview drills, articulation.": {
    ru: "Уверенное speaking, тренировки интервью, артикуляция.",
    en: "Confident speaking, interview drills, and articulation.",
    uk: "Впевнене speaking, тренування інтерв'ю, артикуляція.",
  },
  "Grammar Strategist": {
    ru: "Стратег по грамматике",
    en: "Grammar Strategist",
    uk: "Стратег із граматики",
  },
  "Системный English foundation и academic writing.": {
    ru: "Системная база English и academic writing.",
    en: "A structured English foundation and academic writing.",
    uk: "Системна база English та academic writing.",
  },
  "IELTS Coach": { ru: "IELTS тренер", en: "IELTS Coach", uk: "IELTS тренер" },
  "Band growth, application readiness, mock sessions.": {
    ru: "Рост band score, готовность к подаче, пробные сессии.",
    en: "Band growth, application readiness, mock sessions.",
    uk: "Зростання band score, готовність до подачі, пробні сесії.",
  },
  "Essay Storytelling Lab": {
    ru: "Лаборатория эссе и сторителлинга",
    en: "Essay Storytelling Lab",
    uk: "Лабораторія есе та сторітелінгу",
  },
  "Вторник, 19:00 Kyiv": {
    ru: "Вторник, 19:00 Киев",
    en: "Tuesday, 19:00 Kyiv",
    uk: "Вівторок, 19:00 Київ",
  },
  "Собираем personal statement, который звучит как сильная история кандидата.": {
    ru: "Собираем personal statement, который звучит как сильная история кандидата.",
    en: "We build a personal statement that sounds like a strong candidate story.",
    uk: "Збираємо personal statement, який звучить як сильна історія кандидата.",
  },
  "Interview Sprint": { ru: "Интервью-спринт", en: "Interview Sprint", uk: "Інтерв'ю-спринт" },
  "Четверг, 18:30 Kyiv": {
    ru: "Четверг, 18:30 Киев",
    en: "Thursday, 18:30 Kyiv",
    uk: "Четвер, 18:30 Київ",
  },
  "Живая практика ответов для колледжей, стажировок и scholarship interviews.": {
    ru: "Живая практика ответов для колледжей, стажировок и scholarship interviews.",
    en: "Live answer practice for colleges, internships, and scholarship interviews.",
    uk: "Жива практика відповідей для коледжів, стажувань і scholarship interviews.",
  },
};

function format(value, params = {}) {
  return Object.entries(params).reduce(
    (result, [key, paramValue]) => result.replaceAll(`{${key}}`, paramValue),
    value
  );
}

export function useLanguage() {
  const [language, setLanguageState] = useState(fallbackLanguage);

  useEffect(() => {
    const saved = window.localStorage.getItem("sparkLanguage");
    if (languages.some((item) => item.code === saved)) {
      setLanguageState(saved);
      document.documentElement.lang = saved;
    }
  }, []);

  function setLanguage(nextLanguage) {
    const normalized = languages.some((item) => item.code === nextLanguage) ? nextLanguage : fallbackLanguage;
    setLanguageState(normalized);
    window.localStorage.setItem("sparkLanguage", normalized);
    document.documentElement.lang = normalized;
  }

  const t = useMemo(() => {
    return (key, params) => format(ui[language]?.[key] || ui[fallbackLanguage][key] || key, params);
  }, [language]);

  return { language, setLanguage, t };
}

export function translateContent(value, language) {
  const source = String(value || "");
  return contentTranslations[source]?.[language] || source;
}

export function translateAcademyData(data, language) {
  return {
    ...data,
    hero: {
      ...data.hero,
      eyebrow: translateContent(data.hero?.eyebrow, language),
      headline: translateContent(data.hero?.headline, language),
      subheadline: translateContent(data.hero?.subheadline, language),
      interviewCtaLabel: translateContent(data.hero?.interviewCtaLabel, language),
    },
    intake: {
      ...data.intake,
      cohortLabel: translateContent(data.intake?.cohortLabel, language),
    },
    roadmap: (data.roadmap || []).map((step) => ({
      ...step,
      title: translateContent(step.title, language),
      description: translateContent(step.description, language),
    })),
    webinar: {
      ...data.webinar,
      title: translateContent(data.webinar?.title, language),
      time: translateContent(data.webinar?.time, language),
    },
    achievementsCatalog: (data.achievementsCatalog || []).map((item) => ({
      ...item,
      title: translateContent(item.title, language),
      description: translateContent(item.description, language),
    })),
    teachers: (data.teachers || []).map((teacher) => ({
      ...teacher,
      role: translateContent(teacher.role, language),
      focus: translateContent(teacher.focus, language),
    })),
    workshops: (data.workshops || []).map((workshop) => ({
      ...workshop,
      title: translateContent(workshop.title, language),
      time: translateContent(workshop.time, language),
      description: translateContent(workshop.description, language),
    })),
  };
}

export function LanguageSwitcher({ language, setLanguage }) {
  return (
    <label className="spark-language">
      <span className="sr-only">Language</span>
      <select
        className="spark-language-select"
        value={language}
        onChange={(event) => setLanguage(event.target.value)}
      >
        {languages.map((item) => (
          <option key={item.code} value={item.code} className="bg-[#111]">
            {item.label}
          </option>
        ))}
      </select>
    </label>
  );
}
