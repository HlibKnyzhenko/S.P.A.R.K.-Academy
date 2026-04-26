"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

function ProgressBar({ label, value, accentClass }) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-white/6 p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-white">{label}</p>
        <span className="text-sm font-semibold text-white/75">{value}%</span>
      </div>
      <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full rounded-full ${accentClass}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function ConfettiLayer() {
  const pieces = Array.from({ length: 30 }, (_, index) => ({
    id: index,
    left: `${(index * 13) % 100}%`,
    delay: `${(index % 10) * 0.18}s`,
    duration: `${6 + (index % 5)}s`,
    color: ["#00eaff", "#ffffff", "#7df6b0", "#ffd166"][index % 4],
  }));

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {pieces.map((piece) => (
        <span
          key={piece.id}
          className="spark-confetti"
          style={{
            left: piece.left,
            animationDelay: piece.delay,
            animationDuration: piece.duration,
            backgroundColor: piece.color,
          }}
        />
      ))}
    </div>
  );
}

export default function DashboardClient({ user, academyData, initialStudentProfile }) {
  const [studentProfile, setStudentProfile] = useState(initialStudentProfile);
  const [syncError, setSyncError] = useState("");
  const [certificate, setCertificate] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    let active = true;

    async function syncProfile() {
      try {
        const response = await fetch("/api/auth/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user.email,
            name: user.name,
          }),
        });

        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload.error || "Failed to sync profile.");
        }

        if (active && payload.user) {
          setStudentProfile(payload.user);
        }
      } catch (error) {
        if (active) {
          setSyncError("Profile sync failed. Try refreshing the page.");
        }
      }
    }

    syncProfile();

    return () => {
      active = false;
    };
  }, [user.email, user.name]);

  const unlockedAchievements = useMemo(() => {
    const ids = new Set(studentProfile?.achievementIds || []);
    return academyData.achievementsCatalog.filter((item) => ids.has(item.id));
  }, [academyData.achievementsCatalog, studentProfile]);

  function openCertificate(item) {
    setCertificate(item);
    setShowConfetti(true);
    window.setTimeout(() => setShowConfetti(false), 10000);
  }

  return (
    <>
      {showConfetti ? <ConfettiLayer /> : null}
      <main className="spark-shell min-h-screen px-4 py-6 sm:px-6 sm:py-8">
        <div className="spark-grid absolute inset-0" />
        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-6">
          <section className="spark-glass spark-section rounded-[30px] p-5 sm:p-8 lg:p-10">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
              <div className="max-w-3xl">
                <div className="spark-badge inline-flex rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.22em]">
                  Personal Cabinet 2.0
                </div>
                <h1 className="mt-5 text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
                  Welcome, {user.name}
                </h1>
                <p className="spark-muted mt-4 text-base leading-7">
                  Track portfolio readiness, unlock achievements, follow workshops, and stay close
                  to the interview route without losing momentum.
                </p>
                {studentProfile?.nextMilestone ? (
                  <div className="mt-5 rounded-[22px] border border-cyan-200/15 bg-cyan-200/8 p-4 text-sm leading-6 text-cyan-50">
                    <span className="font-semibold text-white">Next milestone:</span>{" "}
                    {studentProfile.nextMilestone}
                  </div>
                ) : null}
                {syncError ? <p className="mt-3 text-sm text-rose-300">{syncError}</p> : null}
              </div>
              <div className="flex items-start">
                <Link href="/admin" className="spark-button-ghost w-auto px-4 py-2 text-sm">
                  Open admin panel
                </Link>
              </div>
            </div>

            <div className="mt-8 grid gap-4 lg:grid-cols-2">
              <ProgressBar
                label="English progress to target level"
                value={studentProfile?.englishProgress || 0}
                accentClass="bg-[linear-gradient(90deg,#00eaff,#7df6b0)]"
              />
              <ProgressBar
                label="Portfolio readiness"
                value={studentProfile?.portfolioProgress || 0}
                accentClass="bg-[linear-gradient(90deg,#ffffff,#00eaff)]"
              />
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="flex flex-col gap-6">
              <div className="spark-glass spark-section rounded-[28px] p-5 sm:p-8">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/55">
                      Achievement system
                    </p>
                    <h2 className="mt-3 text-3xl font-bold text-white">Unlocked badges</h2>
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm font-semibold text-white/75">
                    {unlockedAchievements.length}/{academyData.achievementsCatalog.length}
                  </div>
                </div>
                <div className="mt-6 grid gap-3 md:grid-cols-2">
                  {academyData.achievementsCatalog.map((achievement) => {
                    const unlocked = unlockedAchievements.some((item) => item.id === achievement.id);
                    return (
                      <article
                        key={achievement.id}
                        className={`rounded-[22px] border p-5 transition ${
                          unlocked
                            ? "border-emerald-300/25 bg-emerald-300/10 shadow-[0_0_30px_rgba(125,246,176,0.12)]"
                            : "border-white/10 bg-white/6"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="text-lg font-semibold text-white">{achievement.title}</h3>
                          <span className="text-xs font-bold uppercase tracking-[0.18em] text-white/55">
                            {unlocked ? "Unlocked" : "Locked"}
                          </span>
                        </div>
                        <p className="spark-muted mt-3 text-sm leading-6">{achievement.description}</p>
                      </article>
                    );
                  })}
                </div>
              </div>

              <div className="spark-glass spark-section rounded-[28px] p-5 sm:p-8">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/55">
                  Certificates
                </p>
                <h2 className="mt-3 text-3xl font-bold text-white">Your proof of progress</h2>
                <div className="mt-6 grid gap-3 md:grid-cols-2">
                  {(studentProfile?.certificates || []).length ? (
                    studentProfile.certificates.map((item) => (
                      <article key={item.id} className="spark-card">
                        <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                        <p className="mt-2 text-sm text-white/55">
                          Uploaded {new Date(item.uploadedAt).toLocaleDateString()}
                        </p>
                        <div className="mt-4 flex gap-3">
                          <button
                            type="button"
                            onClick={() => openCertificate(item)}
                            className="spark-button-secondary"
                          >
                            Open on site
                          </button>
                          <a className="spark-button-ghost" href={item.dataUrl} download={item.name}>
                            Download
                          </a>
                        </div>
                      </article>
                    ))
                  ) : (
                    <div className="rounded-[22px] border border-white/10 bg-white/6 p-5 text-sm leading-6 text-white/55">
                      Certificates added by the admin panel will appear here.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <aside className="flex flex-col gap-6">
              <section className="spark-glass spark-section rounded-[28px] p-5 sm:p-6">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/55">
                  Teachers
                </p>
                <div className="mt-4 grid gap-3">
                  {academyData.teachers.map((teacher) => (
                    <article key={teacher.id} className="spark-card">
                      <h3 className="text-lg font-semibold text-white">{teacher.name}</h3>
                      <p className="mt-1 text-sm text-cyan-200">{teacher.role}</p>
                      <p className="spark-muted mt-2 text-sm leading-6">{teacher.focus}</p>
                    </article>
                  ))}
                </div>
              </section>

              <section className="spark-glass spark-section rounded-[28px] p-5 sm:p-6">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/55">
                  Webinar
                </p>
                <div className="spark-card mt-4">
                  <h3 className="text-lg font-semibold text-white">{academyData.webinar.title}</h3>
                  <p className="mt-2 text-sm text-white/70">{academyData.webinar.time}</p>
                  {academyData.webinar.link ? (
                    <a
                      href={academyData.webinar.link}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex text-sm font-semibold text-cyan-200 hover:text-white"
                    >
                      Open webinar
                    </a>
                  ) : (
                    <p className="mt-4 text-sm text-white/45">Link will be published by the admin panel.</p>
                  )}
                </div>
                <div className="mt-4 grid gap-3">
                  {academyData.workshops.map((workshop) => (
                    <article key={workshop.id} className="spark-card">
                      <h3 className="text-lg font-semibold text-white">{workshop.title}</h3>
                      <p className="mt-2 text-sm text-white/70">{workshop.time}</p>
                      <p className="spark-muted mt-2 text-sm leading-6">{workshop.description}</p>
                      {workshop.link ? (
                        <a
                          href={workshop.link}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-3 inline-flex text-sm font-semibold text-cyan-200 hover:text-white"
                        >
                          Join workshop
                        </a>
                      ) : null}
                    </article>
                  ))}
                </div>
              </section>
            </aside>
          </section>
        </div>
      </main>

      {certificate ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/75 px-4 py-8 backdrop-blur-sm">
          <div className="spark-glass relative w-full max-w-5xl rounded-[30px] p-4 sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold text-white">{certificate.name}</h3>
                <p className="mt-1 text-sm text-white/60">Certificate preview with confetti celebration.</p>
              </div>
              <button className="spark-button-ghost" onClick={() => setCertificate(null)} type="button">
                Close
              </button>
            </div>
            <div className="overflow-hidden rounded-[24px] border border-white/10 bg-black/20">
              {certificate.type.startsWith("image/") ? (
                <img alt={certificate.name} className="max-h-[70vh] w-full object-contain" src={certificate.dataUrl} />
              ) : (
                <iframe className="h-[70vh] w-full bg-white" src={certificate.dataUrl} title={certificate.name} />
              )}
            </div>
            <div className="mt-4 flex justify-end">
              <a className="spark-button-primary" href={certificate.dataUrl} download={certificate.name}>
                Download certificate
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
