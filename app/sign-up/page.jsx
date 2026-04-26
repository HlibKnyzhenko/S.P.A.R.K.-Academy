import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="spark-shell flex min-h-screen items-center justify-center px-6 py-10">
      <div className="spark-grid absolute inset-0" />
      <section className="relative z-10 flex w-full max-w-6xl flex-col items-center gap-8 lg:grid lg:grid-cols-[minmax(320px,0.95fr)_minmax(380px,460px)] lg:items-center">
        <div className="spark-glass w-full rounded-[28px] p-8 text-left sm:p-10">
          <div className="spark-badge inline-flex rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.22em]">
            Join the academy
          </div>
          <h1 className="mt-6 text-4xl font-extrabold leading-tight text-white sm:text-5xl">
            Create your S.P.A.R.K. account and verify email by code.
          </h1>
          <p className="spark-muted mt-5 max-w-xl text-base leading-7 sm:text-lg">
            The registration flow is wired for Clerk email verification, so students enter a
            confirmation code before the session is activated.
          </p>
          <div className="mt-8 rounded-[24px] border border-white/10 bg-white/6 p-5 text-sm leading-6 text-white/72">
            To make the OTP step appear automatically, enable email sign-up and select
            verification by code in the Clerk Dashboard.
          </div>
        </div>

        <div className="flex w-full justify-center">
          <SignUp
            path="/sign-up"
            routing="path"
            signInUrl="/sign-in"
            fallbackRedirectUrl="/dashboard"
          />
        </div>
      </section>
    </main>
  );
}
