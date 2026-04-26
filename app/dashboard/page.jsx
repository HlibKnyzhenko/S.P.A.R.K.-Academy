import { UserButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await currentUser();
  const displayName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.username ||
    user?.primaryEmailAddress?.emailAddress ||
    "Student";

  return (
    <main className="spark-shell flex min-h-screen items-center justify-center px-6 py-12">
      <div className="spark-grid absolute inset-0" />
      <section className="spark-glass relative z-10 w-full max-w-5xl rounded-[30px] p-8 sm:p-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="spark-badge inline-flex rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.22em]">
              Personal Cabinet
            </div>
            <h1 className="mt-5 text-3xl font-extrabold text-white sm:text-4xl">
              Welcome, {displayName}
            </h1>
            <p className="spark-muted mt-3 max-w-2xl text-base leading-7">
              This route is protected by Clerk middleware. Anyone without a valid session is
              redirected to the sign-in page before the dashboard renders.
            </p>
          </div>
          <div className="self-start rounded-full border border-white/12 bg-white/6 p-1.5">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <article className="rounded-[22px] border border-white/10 bg-white/6 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/50">
              Session
            </p>
            <p className="mt-3 text-lg font-semibold text-white">Authenticated</p>
            <p className="spark-muted mt-2 text-sm leading-6">
              Clerk middleware protects all routes inside the dashboard zone.
            </p>
          </article>
          <article className="rounded-[22px] border border-white/10 bg-white/6 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/50">
              Email
            </p>
            <p className="mt-3 text-lg font-semibold text-white">
              {user?.primaryEmailAddress?.emailAddress || "Not available"}
            </p>
            <p className="spark-muted mt-2 text-sm leading-6">
              Registration can require email ownership confirmation through OTP.
            </p>
          </article>
          <article className="rounded-[22px] border border-white/10 bg-white/6 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/50">
              Next Step
            </p>
            <p className="mt-3 text-lg font-semibold text-white">Connect real data</p>
            <p className="spark-muted mt-2 text-sm leading-6">
              This page is ready for courses, profile modules, and student tools.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
