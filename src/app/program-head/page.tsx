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

  const caseHearingStart =
    notifications?.map((notif) => notif.caseHearingStart) || [];

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
          <div className="box">
            <p className="text-2xl mb-4">Announcements</p>
            <p>
              <OpenPDF />
            </p>
          </div>
          <div className="box">
            <p className="text-2xl mb-4">Hearing</p>
            {caseHearingStart.length > 0 ? (
              caseHearingStart.map((hearing, index) => (
                <p key={index}>
                  {hearing
                    ? new Date(hearing).toLocaleString()
                    : "No hearing scheduled"}
                </p>
              ))
            ) : (
              <p>No hearing scheduled</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
