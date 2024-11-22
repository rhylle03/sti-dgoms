import SetHearingCommitee from "@/dialog/SetHearingCommitee";
import { getUser } from "@/utils/supabase/server";

const NewIncidentListPage = async () => {
  const user = await getUser();

  const fullName = user?.user_metadata?.full_name;
  console.log(fullName);

  return <SetHearingCommitee fullName={fullName} />;
};

export default NewIncidentListPage;
