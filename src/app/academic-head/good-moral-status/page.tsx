import { getUser } from "@/utils/supabase/server";
import GoodMoralStatus from "@/components/GoodMoralStatus";

export default async function AppointmentsPage() {
  const user = await getUser();

  return <GoodMoralStatus username={user?.user_metadata?.full_name} />;
}
