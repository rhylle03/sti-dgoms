import NewIncidentList from "@/components/pages/SetHearingClient";
import { getUser } from "@/utils/supabase/server";
import React from "react";

export default async function SetHearing() {
  const user = await getUser();

  return <NewIncidentList user_name={user.user_metadata?.full_name} />;
}
