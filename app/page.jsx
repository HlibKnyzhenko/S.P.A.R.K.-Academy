import Link from "next/link";
import { auth } from "@clerk/nextjs/server";

export default async function HomePage() {
  const { userId } = await auth();

  return (
    <main className="spark-shell flex min-h-screen items-center justify-center px-6 py-12">
      <div className="spark-grid absolute inset-0" />
      <section className="spark-glass relative z-10 w-full max-w-5xl rounded-[28px] px-6 py-8 sm:px-10 sm:py-12">
        <div className="mb-6 inline-flex items-center gap-3 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] spark-badge">
          <span className="h-2.5 w-2.5 rounded-full bg-[#7df6b0] shadow-[0_0_18px_rgba(125,246,176,0.75)]" />
          Supporting Progress and Rising Knowledge
        </div>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.9fr)] lg:items-start">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-white/60">
              Student Portal
            </p>
            <h1 className="max-w-3xl text-4xl font-extrabold leading-tight text-white sm:text-5xl">
              S.P.A.R.K. Academy account access with a calm, polished flow.
            </h1>
            <p className="spark-muted mt-5 max-w-2xl text-base leading-7 sm:text-lg">
              New authentication pages are now ready for Clerk, with email verification by code,
              protected dashboard routes, and redirects aimed at the personal cabinet.
            </p>
          </div>
          <div className="rounded-[24px] border border-white/10 bg-white/6 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/50">
              Quick Access
            </p>
            <div className="mt-5 grid gap-3">
              <Link
                href={userId ? "/dashboard" : "/sign-in"}
                className="rounded-2xl bg-white px-5 py-3 text-center text-sm font-bold text-black transition hover:-translate-y-0.5 hover:shadow-[0_16px_28px_rgba(255,255,255,0.18)]"
              >
                {userId ? "Open dashboard" : "Sign in"}
              </Link>
              <Link
                href="/sign-up"
                className="rounded-2xl border border-white/15 bg-white/8 px-5 py-3 text-center text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-white/12"
              >
                Create account
              </Link>
            </div>
            <div className="mt-6 rounded-2xl border border-white/10 bg-black/25 p-4 text-sm leading-6 text-white/72">
              Email verification is handled by Clerk during sign-up. Once registration is completed,
              the user lands in the protected dashboard area.
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
