import { supabase } from "@/utils/supabase/client";
import Calendar from "@/components/calendar";
import OpenPDF from "@/components/OpenPDF";
import StudentDashBoard from "@/components/StudentDashboard";
import { getUser } from "@/utils/supabase/server";

export default async function Page() {
  const user = await getUser();

  const { data: notifications, error } = await supabase
    .from("notification")
    .select("caseHearingStart")
    .eq("name", user?.user_metadata?.full_name);

  if (error) {
    console.error("Error fetching notifications:", error);
  }
  return (
    <>
      <div className="w-[100%] flex">
        <div className="w-full">
          <div className="box">
            <StudentDashBoard />
          </div>
        </div>
        <div className="w-[30%] ml-10">
          <Calendar></Calendar>
        </div>
      </div>
    </>
  );
}
