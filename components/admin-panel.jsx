"use client";

import { useMemo, useState } from "react";

const emptyTeacher = { name: "", role: "", focus: "" };
const emptyWorkshop = { title: "", time: "", link: "", description: "" };
const emptyAchievement = { title: "", description: "" };

function cloneAcademyData(data) {
  return JSON.parse(JSON.stringify(data));
}

async function toDataUrl(file) {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  const base64 = window.btoa(binary);
  return `data:${file.type || "application/octet-stream"};base64,${base64}`;
}

export default function AdminPanel({ initialAcademyData }) {
  const [adminPassword, setAdminPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [academyData, setAcademyData] = useState(() => cloneAcademyData(initialAcademyData));

  const seatsMessage = useMemo(() => {
    return `Nabor na ${academyData.intake.cohortLabel}: ${academyData.intake.remainingSeats} of ${academyData.intake.totalSeats} seats left`;
  }, [academyData]);

  async function authorize(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setNotice("");

    try {
      const [loginRes, statsRes, usersRes, academyRes] = await Promise.all([
        fetch("/api/admin/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: adminPassword }),
        }),
        fetch("/api/admin/stats", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ adminPassword }),
        }),
        fetch("/api/admin/students", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ adminPassword }),
        }),
        fetch("/api/academy-data"),
      ]);

      const [loginPayload, statsPayload, usersPayload, academyPayload] = await Promise.all([
        loginRes.json(),
        statsRes.json(),
        usersRes.json(),
        academyRes.json(),
      ]);

      if (!loginRes.ok) {
        throw new Error(loginPayload.error || "Admin access denied.");
      }

      setStats(statsPayload.stats || null);
      setUsers(usersPayload.users || []);
      setAcademyData(cloneAcademyData(academyPayload.academyData || academyData));
      setIsAuthorized(true);
      setNotice("Admin panel unlocked.");
    } catch (requestError) {
      setError(requestError.message || "Failed to unlock admin panel.");
    } finally {
      setLoading(false);
    }
  }

  function updateHero(field, value) {
    setAcademyData((current) => ({
      ...current,
      hero: { ...current.hero, [field]: value },
    }));
  }

  function updateIntake(field, value) {
    setAcademyData((current) => ({
      ...current,
      intake: { ...current.intake, [field]: value },
    }));
  }

  function updateWebinar(field, value) {
    setAcademyData((current) => ({
      ...current,
      webinar: { ...current.webinar, [field]: value },
    }));
  }

  function updateTeacher(index, field, value) {
    setAcademyData((current) => ({
      ...current,
      teachers: current.teachers.map((teacher, teacherIndex) =>
        teacherIndex === index ? { ...teacher, [field]: value } : teacher
      ),
    }));
  }

  function updateWorkshop(index, field, value) {
    setAcademyData((current) => ({
      ...current,
      workshops: current.workshops.map((workshop, workshopIndex) =>
        workshopIndex === index ? { ...workshop, [field]: value } : workshop
      ),
    }));
  }

  function updateAchievement(index, field, value) {
    setAcademyData((current) => ({
      ...current,
      achievementsCatalog: current.achievementsCatalog.map((achievement, achievementIndex) =>
        achievementIndex === index ? { ...achievement, [field]: value } : achievement
      ),
    }));
  }

  function addTeacher() {
    setAcademyData((current) => ({
      ...current,
      teachers: [...current.teachers, { ...emptyTeacher, id: `teacher-${Date.now()}` }],
    }));
  }

  function addWorkshop() {
    setAcademyData((current) => ({
      ...current,
      workshops: [...current.workshops, { ...emptyWorkshop, id: `workshop-${Date.now()}` }],
    }));
  }

  function addAchievement() {
    setAcademyData((current) => ({
      ...current,
      achievementsCatalog: [
        ...current.achievementsCatalog,
        { ...emptyAchievement, id: `achievement-${Date.now()}` },
      ],
    }));
  }

  async function saveAcademyData() {
    setLoading(true);
    setError("");
    setNotice("");

    try {
      const response = await fetch("/api/academy-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminPassword,
          hero: academyData.hero,
          intake: {
            ...academyData.intake,
            remainingSeats: Number(academyData.intake.remainingSeats),
            totalSeats: Number(academyData.intake.totalSeats),
          },
          roadmap: academyData.roadmap,
          webinar: academyData.webinar,
          achievementsCatalog: academyData.achievementsCatalog,
          lessons: academyData.lessons,
          teachers: academyData.teachers,
          workshops: academyData.workshops,
          homework: academyData.homework,
        }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Failed to save academy data.");
      }

      setAcademyData(cloneAcademyData(payload.academyData));
      setNotice("Academy content updated.");
    } catch (requestError) {
      setError(requestError.message || "Failed to save academy data.");
    } finally {
      setLoading(false);
    }
  }

  async function saveUser(user) {
    setLoading(true);
    setError("");
    setNotice("");

    try {
      const response = await fetch("/api/admin/students", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminPassword,
          userId: user.id,
          updates: {
            englishLevel: user.englishLevel,
            englishProgress: Number(user.englishProgress),
            portfolioProgress: Number(user.portfolioProgress),
            nextMilestone: user.nextMilestone,
            achievementIds: user.achievementIds,
            certificates: user.certificates,
          },
        }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Failed to save student.");
      }

      setUsers(payload.users || []);
      setNotice(`Saved ${user.name}.`);
    } catch (requestError) {
      setError(requestError.message || "Failed to save student.");
    } finally {
      setLoading(false);
    }
  }

  function updateUser(index, field, value) {
    setUsers((current) =>
      current.map((user, userIndex) => (userIndex === index ? { ...user, [field]: value } : user))
    );
  }

  function toggleAchievement(userIndex, achievementId) {
    setUsers((current) =>
      current.map((user, index) => {
        if (index !== userIndex) {
          return user;
        }

        const nextIds = new Set(user.achievementIds || []);
        if (nextIds.has(achievementId)) {
          nextIds.delete(achievementId);
        } else {
          nextIds.add(achievementId);
        }

        return {
          ...user,
          achievementIds: Array.from(nextIds),
        };
      })
    );
  }

  async function handleCertificateUpload(userIndex, event) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      const dataUrl = await toDataUrl(file);
      setUsers((current) =>
        current.map((user, index) =>
          index === userIndex
            ? {
                ...user,
                certificates: [
                  ...(user.certificates || []),
                  {
                    id: `certificate-${Date.now()}`,
                    name: file.name,
                    type: file.type || "application/octet-stream",
                    dataUrl,
                    uploadedAt: new Date().toISOString(),
                  },
                ],
              }
            : user
        )
      );
    } catch (uploadError) {
      setError("Failed to read certificate file.");
    } finally {
      event.target.value = "";
    }
  }

  if (!isAuthorized) {
    return (
      <main className="spark-shell min-h-screen px-4 py-6 sm:px-6 sm:py-8">
        <div className="spark-grid absolute inset-0" />
        <div className="relative z-10 mx-auto flex min-h-[80vh] w-full max-w-3xl items-center justify-center">
          <section className="spark-glass spark-section w-full rounded-[30px] p-6 sm:p-8 lg:p-10">
            <div className="spark-badge inline-flex rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.22em]">
              S.P.A.R.K. Admin Panel
            </div>
            <h1 className="mt-5 text-3xl font-extrabold text-white sm:text-4xl">
              Enter the control code.
            </h1>
            <p className="spark-muted mt-3 text-base leading-7">
              This area controls seats, teachers, workshops, achievements, and student certificates.
            </p>
            <form className="mt-6 grid gap-4" onSubmit={authorize}>
              <input
                className="spark-input"
                type="password"
                placeholder="Admin access code"
                value={adminPassword}
                onChange={(event) => setAdminPassword(event.target.value)}
              />
              <button className="spark-button-primary w-full" disabled={loading} type="submit">
                {loading ? "Checking..." : "Unlock Admin Panel"}
              </button>
            </form>
            {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="spark-shell min-h-screen px-4 py-6 sm:px-6 sm:py-8">
      <div className="spark-grid absolute inset-0" />
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="spark-glass spark-section rounded-[30px] p-5 sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="spark-badge inline-flex rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.22em]">
                Academy Control Room
              </div>
              <h1 className="mt-5 text-3xl font-extrabold text-white sm:text-4xl">
                Admin panel for seats, students, certificates, and live programming.
              </h1>
              <p className="spark-muted mt-3 max-w-3xl text-base leading-7">
                Update the public landing page, manage selective intake pressure, assign achievements,
                upload certificates, and keep teachers plus workshops current.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[22px] border border-white/10 bg-white/6 px-4 py-4">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/50">Students</p>
                <p className="mt-3 text-3xl font-bold text-white">{stats?.totalStudents || users.length}</p>
              </div>
              <div className="rounded-[22px] border border-white/10 bg-white/6 px-4 py-4">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/50">Registered today</p>
                <p className="mt-3 text-3xl font-bold text-white">{stats?.registeredToday || 0}</p>
              </div>
            </div>
          </div>
          {notice ? <p className="mt-4 text-sm text-emerald-200">{notice}</p> : null}
          {error ? <p className="mt-2 text-sm text-rose-300">{error}</p> : null}
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
          <div className="flex flex-col gap-6">
            <section className="spark-glass spark-section rounded-[28px] p-5 sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/55">
                    Intake & Hero
                  </p>
                  <h2 className="mt-3 text-3xl font-bold text-white">Landing page messaging</h2>
                </div>
                <button className="spark-button-primary" disabled={loading} onClick={saveAcademyData} type="button">
                  Save Academy Data
                </button>
              </div>
              <div className="mt-6 grid gap-4">
                <input className="spark-input" value={academyData.hero.headline} onChange={(event) => updateHero("headline", event.target.value)} />
                <textarea className="spark-input min-h-28 resize-y py-3" value={academyData.hero.subheadline} onChange={(event) => updateHero("subheadline", event.target.value)} />
                <div className="grid gap-4 md:grid-cols-3">
                  <input className="spark-input" value={academyData.intake.cohortLabel} onChange={(event) => updateIntake("cohortLabel", event.target.value)} />
                  <input className="spark-input" type="number" value={academyData.intake.remainingSeats} onChange={(event) => updateIntake("remainingSeats", event.target.value)} />
                  <input className="spark-input" type="number" value={academyData.intake.totalSeats} onChange={(event) => updateIntake("totalSeats", event.target.value)} />
                </div>
                <div className="rounded-[22px] border border-emerald-300/20 bg-emerald-300/10 px-4 py-4 text-sm text-emerald-50">
                  {seatsMessage}
                </div>
              </div>
            </section>

            <section className="spark-glass spark-section rounded-[28px] p-5 sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/55">Teachers</p>
                  <h2 className="mt-3 text-3xl font-bold text-white">Visible in the cabinet</h2>
                </div>
                <button className="spark-button-secondary" onClick={addTeacher} type="button">
                  Add teacher
                </button>
              </div>
              <div className="mt-6 grid gap-4">
                {academyData.teachers.map((teacher, index) => (
                  <div key={teacher.id || index} className="spark-card">
                    <div className="grid gap-3">
                      <input className="spark-input" placeholder="Teacher name" value={teacher.name} onChange={(event) => updateTeacher(index, "name", event.target.value)} />
                      <input className="spark-input" placeholder="Role" value={teacher.role} onChange={(event) => updateTeacher(index, "role", event.target.value)} />
                      <textarea className="spark-input min-h-24 resize-y py-3" placeholder="Focus" value={teacher.focus} onChange={(event) => updateTeacher(index, "focus", event.target.value)} />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="spark-glass spark-section rounded-[28px] p-5 sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/55">Workshops</p>
                  <h2 className="mt-3 text-3xl font-bold text-white">Webinar and live schedule</h2>
                </div>
                <button className="spark-button-secondary" onClick={addWorkshop} type="button">
                  Add workshop
                </button>
              </div>
              <div className="spark-card mt-6">
                <div className="grid gap-3">
                  <input className="spark-input" placeholder="Webinar title" value={academyData.webinar.title} onChange={(event) => updateWebinar("title", event.target.value)} />
                  <input className="spark-input" placeholder="Webinar time" value={academyData.webinar.time} onChange={(event) => updateWebinar("time", event.target.value)} />
                  <input className="spark-input" placeholder="Webinar link" value={academyData.webinar.link} onChange={(event) => updateWebinar("link", event.target.value)} />
                </div>
              </div>
              <div className="mt-4 grid gap-4">
                {academyData.workshops.map((workshop, index) => (
                  <div key={workshop.id || index} className="spark-card">
                    <div className="grid gap-3">
                      <input className="spark-input" placeholder="Workshop title" value={workshop.title} onChange={(event) => updateWorkshop(index, "title", event.target.value)} />
                      <input className="spark-input" placeholder="Time" value={workshop.time} onChange={(event) => updateWorkshop(index, "time", event.target.value)} />
                      <input className="spark-input" placeholder="Link" value={workshop.link} onChange={(event) => updateWorkshop(index, "link", event.target.value)} />
                      <textarea className="spark-input min-h-24 resize-y py-3" placeholder="Description" value={workshop.description} onChange={(event) => updateWorkshop(index, "description", event.target.value)} />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="spark-glass spark-section rounded-[28px] p-5 sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/55">Achievements</p>
                  <h2 className="mt-3 text-3xl font-bold text-white">Create badge catalog</h2>
                </div>
                <button className="spark-button-secondary" onClick={addAchievement} type="button">
                  Add achievement
                </button>
              </div>
              <div className="mt-6 grid gap-4">
                {academyData.achievementsCatalog.map((achievement, index) => (
                  <div key={achievement.id || index} className="spark-card">
                    <div className="grid gap-3">
                      <input className="spark-input" placeholder="Achievement title" value={achievement.title} onChange={(event) => updateAchievement(index, "title", event.target.value)} />
                      <textarea className="spark-input min-h-24 resize-y py-3" placeholder="Achievement description" value={achievement.description} onChange={(event) => updateAchievement(index, "description", event.target.value)} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="spark-glass spark-section rounded-[28px] p-5 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/55">Students</p>
            <h2 className="mt-3 text-3xl font-bold text-white">Assign progress, badges, certificates</h2>
            <div className="mt-6 grid gap-4">
              {users.length ? (
                users.map((user, userIndex) => (
                  <article key={user.id} className="spark-card">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-semibold text-white">{user.name}</h3>
                        <p className="mt-1 text-sm text-white/60">{user.email}</p>
                      </div>
                      <button className="spark-button-primary" disabled={loading} onClick={() => saveUser(user)} type="button">
                        Save
                      </button>
                    </div>
                    <div className="mt-4 grid gap-3">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <input className="spark-input" type="number" value={user.englishProgress} onChange={(event) => updateUser(userIndex, "englishProgress", event.target.value)} />
                        <input className="spark-input" type="number" value={user.portfolioProgress} onChange={(event) => updateUser(userIndex, "portfolioProgress", event.target.value)} />
                      </div>
                      <input className="spark-input" value={user.englishLevel} onChange={(event) => updateUser(userIndex, "englishLevel", event.target.value)} />
                      <textarea className="spark-input min-h-24 resize-y py-3" value={user.nextMilestone} onChange={(event) => updateUser(userIndex, "nextMilestone", event.target.value)} />
                    </div>

                    <div className="mt-5">
                      <p className="text-sm font-semibold text-white">Achievements</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {academyData.achievementsCatalog.map((achievement) => {
                          const active = (user.achievementIds || []).includes(achievement.id);
                          return (
                            <button
                              key={achievement.id}
                              className={active ? "spark-tag-active" : "spark-tag"}
                              onClick={() => toggleAchievement(userIndex, achievement.id)}
                              type="button"
                            >
                              {achievement.title}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="mt-5">
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-sm font-semibold text-white">Certificates</p>
                        <label className="spark-button-secondary cursor-pointer">
                          Upload certificate
                          <input className="hidden" type="file" onChange={(event) => handleCertificateUpload(userIndex, event)} />
                        </label>
                      </div>
                      <div className="mt-3 grid gap-2">
                        {(user.certificates || []).length ? (
                          user.certificates.map((certificate) => (
                            <div key={certificate.id} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/70">
                              {certificate.name}
                            </div>
                          ))
                        ) : (
                          <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/45">
                            No certificates yet.
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="rounded-[24px] border border-white/10 bg-white/6 p-5 text-sm leading-6 text-white/55">
                  No synced students yet. Once a Clerk user opens the dashboard, they will appear here automatically.
                </div>
              )}
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}
