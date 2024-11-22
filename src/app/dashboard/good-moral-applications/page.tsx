import GoodMoralApplication from "@/components/GoodMoralApplication";
import { cookies } from "next/headers";
import { getUser } from "@/utils/supabase/server";

export default async function AppointmentsPage() {
  const user = await getUser();

  return <GoodMoralApplication username={user?.user_metadata?.full_name} />;
}
