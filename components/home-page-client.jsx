"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

const englishLevels = ["A1", "A2", "B1", "B2", "C1", "C2", "NOT SURE"];

export default function HomePageClient({ academyData, userId }) {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    englishLevel: "B1",
    ambition: "",
  });
  const [formError, setFormError] = useState("");

  const intakeLabel = useMemo(() => {
    return `Набор на ${academyData.intake.cohortLabel}: осталось ${academyData.intake.remainingSeats} места из ${academyData.intake.totalSeats}`;
  }, [academyData]);

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
      setFormError("Please answer every field and make your motivation more detailed.");
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
        <div className="flex justify-end">
          <Link href="/admin" className="spark-button-ghost w-auto px-4 py-2 text-sm">
            Admin panel
          </Link>
        </div>
        <section className="spark-glass spark-section overflow-hidden rounded-[30px] px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.85fr)] lg:items-start">
            <div>
              <div className="spark-badge inline-flex rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em]">
                {academyData.hero.eyebrow}
              </div>
              <div className="mt-5 inline-flex items-center gap-3 rounded-full border border-emerald-300/25 bg-emerald-300/10 px-4 py-2 text-sm font-semibold text-emerald-100 shadow-[0_0_30px_rgba(125,246,176,0.18)]">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(125,246,176,0.85)]" />
                {intakeLabel}
              </div>
              <h1 className="mt-6 max-w-4xl text-4xl font-extrabold leading-[1.02] text-white sm:text-5xl lg:text-6xl">
                {academyData.hero.headline}
              </h1>
              <p className="spark-muted mt-5 max-w-3xl text-base leading-7 sm:text-lg">
                {academyData.hero.subheadline}
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/sign-up"
                  className="spark-button-primary text-center"
                >
                  {academyData.hero.interviewCtaLabel}
                </Link>
                <Link
                  href={userId ? "/dashboard" : "/sign-in"}
                  className="spark-button-secondary text-center"
                >
                  {userId ? "Open personal cabinet" : "Sign in"}
                </Link>
              </div>
            </div>

            <div className="spark-panel rounded-[26px] p-5 sm:p-6">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/55">
                Strategic application form
              </p>
              <h2 className="mt-3 text-2xl font-bold text-white sm:text-[28px]">
                Apply for Interview
              </h2>
              <p className="spark-muted mt-2 text-sm leading-6">
                This is a selective route. Tell us why your ambition, discipline, and portfolio
                potential deserve one of the remaining seats.
              </p>

              <form className="mt-5 grid gap-3" onSubmit={handleSubmit}>
                <input
                  className="spark-input"
                  placeholder="Your full name"
                  value={formState.name}
                  onChange={(event) => updateField("name", event.target.value)}
                />
                <input
                  className="spark-input"
                  placeholder="Email address"
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
                  placeholder="Why should we choose you?"
                  value={formState.ambition}
                  onChange={(event) => updateField("ambition", event.target.value)}
                />
                <button className="spark-button-primary w-full" type="submit">
                  Apply for Interview
                </button>
                {formError ? <p className="text-sm text-rose-300">{formError}</p> : null}
                <p className="text-xs leading-5 text-white/50">
                  После отправки ты перейдешь на secure sign-up flow. Черновик ответа сохранится
                  в этом браузере.
                </p>
              </form>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
          <div className="spark-glass spark-section rounded-[28px] p-5 sm:p-8">
            <div className="section-heading">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/55">
                Interactive Roadmap
              </p>
              <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
                The route from interview to admission.
              </h2>
            </div>
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {academyData.roadmap.map((step, index) => (
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
                Teachers
              </p>
              <div className="mt-4 grid gap-3">
                {academyData.teachers.map((teacher) => (
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
                Webinar & Workshops
              </p>
              <div className="spark-card mt-4">
                <h3 className="text-lg font-semibold text-white">{academyData.webinar.title}</h3>
                <p className="mt-2 text-sm text-white/72">{academyData.webinar.time}</p>
                {academyData.webinar.link ? (
                  <a
                    href={academyData.webinar.link}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex text-sm font-semibold text-cyan-200 hover:text-white"
                  >
                    Open webinar link
                  </a>
                ) : (
                  <p className="mt-4 text-sm text-white/45">The admin panel will add the live link here.</p>
                )}
              </div>
              <div className="mt-4 grid gap-3">
                {academyData.workshops.map((workshop) => (
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
                          Join
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
