import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="spark-shell flex min-h-screen items-center justify-center px-4 py-6 sm:px-6 sm:py-10">
      <div className="spark-grid absolute inset-0" />
      <section className="relative z-10 flex w-full max-w-6xl flex-col items-stretch gap-5 lg:grid lg:grid-cols-[minmax(320px,0.95fr)_minmax(360px,460px)] lg:items-center lg:gap-8">
        <div className="order-2 spark-glass w-full rounded-[28px] p-6 text-left sm:p-8 lg:order-1 lg:p-10">
          <div className="spark-badge inline-flex rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.22em]">
            Join the academy
          </div>
          <h1 className="mt-5 max-w-[12ch] text-3xl font-extrabold leading-[1.05] text-white sm:text-4xl lg:mt-6 lg:text-5xl">
            Create your S.P.A.R.K. account and verify email by code.
          </h1>
          <p className="spark-muted mt-4 max-w-xl text-sm leading-6 sm:text-base sm:leading-7 lg:mt-5 lg:text-lg">
            The registration flow is wired for Clerk email verification, so students enter a
            confirmation code before the session is activated.
          </p>
          <div className="mt-6 rounded-[24px] border border-white/10 bg-white/6 p-5 text-sm leading-6 text-white/72 lg:mt-8">
            To make the OTP step appear automatically, enable email sign-up and select
            verification by code in the Clerk Dashboard.
          </div>
        </div>

        <div className="order-1 flex w-full justify-center lg:order-2">
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
