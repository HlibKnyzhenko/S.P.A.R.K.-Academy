import AdminPanel from "../../components/admin-panel";
import { getServerState } from "../../lib/server-store";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const state = await getServerState();

  return <AdminPanel initialAcademyData={state.academyData} />;
}
