import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="spark-shell flex min-h-screen items-center justify-center px-6 py-10">
      <div className="spark-grid absolute inset-0" />
      <section className="relative z-10 flex w-full max-w-6xl flex-col items-center gap-8 lg:grid lg:grid-cols-[minmax(320px,0.95fr)_minmax(380px,460px)] lg:items-center">
        <div className="spark-glass w-full rounded-[28px] p-8 text-left sm:p-10">
          <div className="spark-badge inline-flex rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.22em]">
            S.P.A.R.K. Academy
          </div>
          <h1 className="mt-6 text-4xl font-extrabold leading-tight text-white sm:text-5xl">
            Welcome back to your learning space.
          </h1>
          <p className="spark-muted mt-5 max-w-xl text-base leading-7 sm:text-lg">
            Sign in to open your dashboard, follow course updates, and keep your academy
            profile in one place.
          </p>
          <div className="mt-8 grid gap-3 text-sm text-white/72 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
              Protected dashboard routes
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
              Redirect to personal cabinet after login
            </div>
          </div>
        </div>

        <div className="flex w-full justify-center">
          <SignIn
            path="/sign-in"
            routing="path"
            signUpUrl="/sign-up"
            fallbackRedirectUrl="/dashboard"
          />
        </div>
      </section>
    </main>
  );
}
