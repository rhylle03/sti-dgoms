import ReportForm from "./../../../components/forms/ReportForm";
import { getUser } from "@/utils/supabase/server";

export default async function page() {
  try {
    const data = await getUser();
    return (
      <div className="m-auto">
        <ReportForm fullName={data?.user_metadata?.full_name}></ReportForm>
      </div>
    );
  } catch (e) {
    console.error(e);
  }
}
