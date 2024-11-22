import AppointmentsClient from "@/components/Appointments";
import { getUser } from "@/utils/supabase/server";

export default async function AppointmentsPage() {
  const user = await getUser();

  return <AppointmentsClient username={user.user_metadata?.full_name} />;
}
