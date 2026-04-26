import { SignIn } from "@clerk/nextjs";

export default function SignInSsoCallbackPage() {
  return (
    <SignIn
      path="/sign-in"
      routing="path"
      signUpUrl="/sign-up"
      fallbackRedirectUrl="/dashboard"
    />
  );
}
