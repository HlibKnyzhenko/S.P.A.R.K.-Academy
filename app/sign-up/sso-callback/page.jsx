import { SignUp } from "@clerk/nextjs";

export default function SignUpSsoCallbackPage() {
  return (
    <SignUp
      path="/sign-up"
      routing="path"
      signInUrl="/sign-in"
      fallbackRedirectUrl="/dashboard"
    />
  );
}
