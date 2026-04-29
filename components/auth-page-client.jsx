"use client";

import { SignIn, SignUp } from "@clerk/nextjs";
import { useLanguage } from "./i18n";

const copy = {
  signIn: {
    eyebrow: {
      ru: "S.P.A.R.K. Academy",
      en: "S.P.A.R.K. Academy",
      uk: "S.P.A.R.K. Academy",
    },
    title: {
      ru: "С возвращением в твоё учебное пространство.",
      en: "Welcome back to your learning space.",
      uk: "З поверненням у твій навчальний простір.",
    },
    description: {
      ru: "Войди, чтобы открыть кабинет, следить за обновлениями курса и держать профиль академии в одном месте.",
      en: "Sign in to open your dashboard, follow course updates, and keep your academy profile in one place.",
      uk: "Увійди, щоб відкрити кабінет, стежити за оновленнями курсу та тримати профіль академії в одному місці.",
    },
    cards: {
      ru: ["Защищённый личный кабинет", "Переход в кабинет после входа"],
      en: ["Protected dashboard routes", "Redirect to personal cabinet after login"],
      uk: ["Захищений особистий кабінет", "Перехід у кабінет після входу"],
    },
  },
  signUp: {
    eyebrow: {
      ru: "Вступить в академию",
      en: "Join the academy",
      uk: "Долучитися до академії",
    },
    title: {
      ru: "Создай аккаунт S.P.A.R.K. и подтверди email кодом.",
      en: "Create your S.P.A.R.K. account and verify email by code.",
      uk: "Створи акаунт S.P.A.R.K. і підтверди email кодом.",
    },
    description: {
      ru: "Регистрация подключена к Clerk email verification, поэтому ученик вводит код подтверждения перед активацией сессии.",
      en: "The registration flow is wired for Clerk email verification, so students enter a confirmation code before the session is activated.",
      uk: "Реєстрація підключена до Clerk email verification, тому учень вводить код підтвердження перед активацією сесії.",
    },
    note: {
      ru: "Чтобы OTP-шаг появился автоматически, включи email sign-up и verification by code в Clerk Dashboard.",
      en: "To make the OTP step appear automatically, enable email sign-up and select verification by code in the Clerk Dashboard.",
      uk: "Щоб OTP-крок з'явився автоматично, увімкни email sign-up і verification by code у Clerk Dashboard.",
    },
  },
};

export default function AuthPageClient({ mode }) {
  const { language } = useLanguage();
  const isSignIn = mode === "signIn";
  const pageCopy = isSignIn ? copy.signIn : copy.signUp;
  const ClerkComponent = isSignIn ? SignIn : SignUp;
  const clerkProps = isSignIn
    ? { path: "/sign-in", routing: "path", signUpUrl: "/sign-up", fallbackRedirectUrl: "/dashboard" }
    : { path: "/sign-up", routing: "path", signInUrl: "/sign-in", fallbackRedirectUrl: "/dashboard" };

  return (
    <main className="spark-shell flex min-h-screen items-center justify-center px-4 py-6 sm:px-6 sm:py-10">
      <div className="spark-grid absolute inset-0" />
      <section className="relative z-10 flex w-full max-w-6xl flex-col items-stretch gap-5 lg:grid lg:grid-cols-[minmax(320px,0.95fr)_minmax(360px,460px)] lg:items-center lg:gap-8">
        <div className="order-2 spark-glass w-full rounded-[28px] p-6 text-left sm:p-8 lg:order-1 lg:p-10">
          <div className="spark-badge inline-flex rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.22em]">
            {pageCopy.eyebrow[language]}
          </div>
          <h1 className="mt-5 max-w-[12ch] text-3xl font-extrabold leading-[1.05] text-white sm:text-4xl lg:mt-6 lg:text-5xl">
            {pageCopy.title[language]}
          </h1>
          <p className="spark-muted mt-4 max-w-xl text-sm leading-6 sm:text-base sm:leading-7 lg:mt-5 lg:text-lg">
            {pageCopy.description[language]}
          </p>
          {isSignIn ? (
            <div className="mt-6 grid gap-3 text-sm text-white/72 sm:grid-cols-2 lg:mt-8">
              {pageCopy.cards[language].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/6 p-4">
                  {item}
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-[24px] border border-white/10 bg-white/6 p-5 text-sm leading-6 text-white/72 lg:mt-8">
              {pageCopy.note[language]}
            </div>
          )}
        </div>

        <div className="order-1 flex w-full justify-center lg:order-2">
          <ClerkComponent {...clerkProps} />
        </div>
      </section>
    </main>
  );
}
