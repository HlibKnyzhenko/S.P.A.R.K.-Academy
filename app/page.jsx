import { auth } from "@clerk/nextjs/server";
import HomePageClient from "../components/home-page-client";
import { getServerState } from "../lib/server-store";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { userId } = await auth();
  const state = await getServerState();

  return <HomePageClient academyData={state.academyData} userId={userId} />;
}
