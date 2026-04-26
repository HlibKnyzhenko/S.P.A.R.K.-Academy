import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DashboardClient from "../../components/dashboard-client";
import { getServerState } from "../../lib/server-store";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await currentUser();
  const state = await getServerState();
  const displayName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.username ||
    user?.primaryEmailAddress?.emailAddress ||
    "Student";
  const email = user?.primaryEmailAddress?.emailAddress || "";
  const studentProfile = state.users.find((item) => item.email === email) || null;

  return (
    <DashboardClient
      user={{ name: displayName, email }}
      academyData={state.academyData}
      initialStudentProfile={studentProfile}
    />
  );
}
