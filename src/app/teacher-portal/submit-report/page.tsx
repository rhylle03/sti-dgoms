import { getUser } from "@/utils/supabase/server";
import ReportFormNonStudent from "@/components/forms/ReportFormNonStudent";

export default async function page() {
  try {
    const data = await getUser();
    return (
      <div className="m-auto">
        <ReportFormNonStudent
          fullName={data?.user_metadata?.full_name}
        ></ReportFormNonStudent>
      </div>
    );
  } catch (e) {
    console.error(e);
  }
}
