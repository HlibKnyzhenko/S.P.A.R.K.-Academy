"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { LanguageSwitcher, translateAcademyData, useLanguage } from "./i18n";

const englishLevels = ["A1", "A2", "B1", "B2", "C1", "C2", "NOT SURE"];
const founderPortfolioUrl = "https://hlib-knyzhenko-portfolio.vercel.app/";
const founderAvatarUrl = "https://avatars.githubusercontent.com/u/121054442?v=4";

export default function HomePageClient({ academyData, userId }) {
  const { language, setLanguage, t } = useLanguage();
  const translatedAcademyData = useMemo(
    () => translateAcademyData(academyData, language),
    [academyData, language]
  );
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    englishLevel: "B1",
    ambition: "",
  });
  const [formError, setFormError] = useState("");

  const intakeLabel = useMemo(() => {
    return t("seats", {
      cohort: translatedAcademyData.intake.cohortLabel,
      remaining: translatedAcademyData.intake.remainingSeats,
      total: translatedAcademyData.intake.totalSeats,
    });
  }, [t, translatedAcademyData]);

  function updateField(field, value) {
    setFormError("");
    setFormState((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (
      !formState.name.trim() ||
      !formState.email.trim() ||
      !formState.ambition.trim() ||
      formState.ambition.trim().length < 20
    ) {
      setFormError(t("formError"));
      return;
    }

    if (typeof window !== "undefined") {
      window.sessionStorage.setItem("sparkInterviewDraft", JSON.stringify(formState));
      window.location.href = "/sign-up";
    }
  }

  return (
    <main className="spark-shell min-h-screen px-4 py-6 sm:px-6 sm:py-8">
      <div className="spark-grid absolute inset-0" />
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-6">
        <div className="flex justify-end gap-3">
          <LanguageSwitcher language={language} setLanguage={setLanguage} />
          <Link href="/admin" className="spark-button-ghost w-auto px-4 py-2 text-sm">
            {t("adminPanel")}
          </Link>
        </div>
        <section className="spark-glass spark-section overflow-hidden rounded-[30px] px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.85fr)] lg:items-start">
            <div>
              <div className="spark-badge inline-flex rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em]">
                {translatedAcademyData.hero.eyebrow}
              </div>
              <div className="mt-5 inline-flex items-center gap-3 rounded-full border border-emerald-300/25 bg-emerald-300/10 px-4 py-2 text-sm font-semibold text-emerald-100 shadow-[0_0_30px_rgba(125,246,176,0.18)]">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(125,246,176,0.85)]" />
                {intakeLabel}
              </div>
              <h1 className="mt-6 max-w-4xl text-4xl font-extrabold leading-[1.02] text-white sm:text-5xl lg:text-6xl">
                {translatedAcademyData.hero.headline}
              </h1>
              <p className="spark-muted mt-5 max-w-3xl text-base leading-7 sm:text-lg">
                {translatedAcademyData.hero.subheadline}
              </p>

              <a
                href={founderPortfolioUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-6 flex max-w-xl items-center gap-4 rounded-[24px] border border-white/10 bg-white/[0.055] p-3 pr-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition hover:border-cyan-200/35 hover:bg-white/[0.08] sm:pr-5"
              >
                <img
                  src={founderAvatarUrl}
                  alt={t("founderPhotoAlt")}
                  className="h-20 w-20 shrink-0 rounded-[20px] border border-white/15 object-cover shadow-[0_18px_40px_rgba(0,0,0,0.35)] sm:h-24 sm:w-24"
                />
                <span className="min-w-0">
                  <span className="block text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-200/75">
                    {t("founderKicker")}
                  </span>
                  <span className="mt-1 block text-xl font-bold leading-tight text-white sm:text-2xl">
                    {t("founderName")}
                  </span>
                  <span className="spark-muted mt-1 block text-sm leading-5">
                    {t("founderRole")}
                  </span>
                  <span className="mt-3 inline-flex text-sm font-semibold text-cyan-200">
                    {t("openFounderPortfolio")}
                  </span>
                </span>
              </a>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/sign-up"
                  className="spark-button-primary text-center"
                >
                  {translatedAcademyData.hero.interviewCtaLabel || t("applyForInterview")}
                </Link>
                <Link
                  href={userId ? "/dashboard" : "/sign-in"}
                  className="spark-button-secondary text-center"
                >
                  {userId ? t("openCabinet") : t("signIn")}
                </Link>
              </div>
            </div>

            <div className="spark-panel rounded-[26px] p-5 sm:p-6">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/55">
                {t("strategicForm")}
              </p>
              <h2 className="mt-3 text-2xl font-bold text-white sm:text-[28px]">
                {t("applyForInterview")}
              </h2>
              <p className="spark-muted mt-2 text-sm leading-6">
                {t("formDescription")}
              </p>

              <form className="mt-5 grid gap-3" onSubmit={handleSubmit}>
                <input
                  className="spark-input"
                  placeholder={t("fullName")}
                  value={formState.name}
                  onChange={(event) => updateField("name", event.target.value)}
                />
                <input
                  className="spark-input"
                  placeholder={t("email")}
                  type="email"
                  value={formState.email}
                  onChange={(event) => updateField("email", event.target.value)}
                />
                <select
                  className="spark-input"
                  value={formState.englishLevel}
                  onChange={(event) => updateField("englishLevel", event.target.value)}
                >
                  {englishLevels.map((level) => (
                    <option key={level} value={level} className="bg-[#0f0f0f]">
                      {level}
                    </option>
                  ))}
                </select>
                <textarea
                  className="spark-input min-h-32 resize-y py-3"
                  placeholder={t("motivation")}
                  value={formState.ambition}
                  onChange={(event) => updateField("ambition", event.target.value)}
                />
                <button className="spark-button-primary w-full" type="submit">
                  {t("applyForInterview")}
                </button>
                {formError ? <p className="text-sm text-rose-300">{formError}</p> : null}
                <p className="text-xs leading-5 text-white/50">
                  {t("draftNote")}
                </p>
              </form>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
          <div className="spark-glass spark-section rounded-[28px] p-5 sm:p-8">
            <div className="section-heading">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/55">
                {t("roadmap")}
              </p>
              <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
                {t("routeTitle")}
              </h2>
            </div>
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {translatedAcademyData.roadmap.map((step, index) => (
                <article key={step.id} className="spark-card spark-roadmap-card">
                  <div className="spark-step-index">{String(index + 1).padStart(2, "0")}</div>
                  <h3 className="mt-4 text-xl font-semibold text-white">{step.title}</h3>
                  <p className="spark-muted mt-3 text-sm leading-6">{step.description}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <section className="spark-glass spark-section rounded-[28px] p-5 sm:p-6">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/55">
                {t("teachers")}
              </p>
              <div className="mt-4 grid gap-3">
                {translatedAcademyData.teachers.map((teacher) => (
                  <article key={teacher.id} className="spark-card">
                    <h3 className="text-lg font-semibold text-white">{teacher.name}</h3>
                    <p className="mt-1 text-sm font-medium text-cyan-200">{teacher.role}</p>
                    <p className="spark-muted mt-2 text-sm leading-6">{teacher.focus}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="spark-glass spark-section rounded-[28px] p-5 sm:p-6">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/55">
                {t("webinarWorkshops")}
              </p>
              <div className="spark-card mt-4">
                <h3 className="text-lg font-semibold text-white">{translatedAcademyData.webinar.title}</h3>
                <p className="mt-2 text-sm text-white/72">{translatedAcademyData.webinar.time}</p>
                {translatedAcademyData.webinar.link ? (
                  <a
                    href={translatedAcademyData.webinar.link}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex text-sm font-semibold text-cyan-200 hover:text-white"
                  >
                    {t("openWebinar")}
                  </a>
                ) : (
                  <p className="mt-4 text-sm text-white/45">{t("webinarMissing")}</p>
                )}
              </div>
              <div className="mt-4 grid gap-3">
                {translatedAcademyData.workshops.map((workshop) => (
                  <article key={workshop.id} className="spark-card">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{workshop.title}</h3>
                        <p className="mt-1 text-sm text-white/65">{workshop.time}</p>
                      </div>
                      {workshop.link ? (
                        <a
                          href={workshop.link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm font-semibold text-cyan-200 hover:text-white"
                        >
                          {t("join")}
                        </a>
                      ) : null}
                    </div>
                    <p className="spark-muted mt-3 text-sm leading-6">{workshop.description}</p>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
