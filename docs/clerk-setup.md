# Clerk setup for S.P.A.R.K. Academy

## 1. Environment variables

Use these values in `.env.local`:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key
CLERK_SECRET_KEY=sk_test_your_key

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/dashboard
```

If you want Clerk to *always* redirect to the dashboard even when a `redirect_url`
query parameter exists, use these instead:

```env
NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=/dashboard
```

`AFTER_SIGN_IN_URL` and `AFTER_SIGN_UP_URL` are deprecated in Clerk. Prefer the
`FALLBACK` or `FORCE` variables above.

## 2. Clerk Dashboard settings

Open Clerk Dashboard -> `User & authentication` and set:

1. `Email` -> enable `Email address`.
2. `Sign-up` -> enable `Email address`.
3. `Verify at sign-up` -> enable it.
4. Verification method -> choose `Email verification code`.

This is the setting that makes the `<SignUp />` component automatically ask for the
email confirmation code during registration.

## 3. Routes in this project

- `/sign-in` -> custom Clerk sign-in page
- `/sign-up` -> custom Clerk sign-up page
- `/dashboard` -> protected personal cabinet

## 4. Middleware behavior

`middleware.ts` protects every route inside `/dashboard`. Unauthenticated users are
redirected by Clerk to the configured sign-in URL.
