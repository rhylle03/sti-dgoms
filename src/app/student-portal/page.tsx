import { supabase } from "@/utils/supabase/client";
import Calendar from "@/components/calendar";
import OpenPDF from "@/components/OpenPDF";
import StudentDashBoard from "@/components/StudentDashboard";
import IncidentReport from "@/components/IncidentReport";
import { Bell } from "lucide-react";
import { getUser } from "@/utils/supabase/server";

export default async function page() {
  const user = await getUser();

  return (
    <>
      <div className="w-[100%] flex">
        <div className="w-full">
          <div className="box">
            <StudentDashBoard />
          </div>
        </div>
        <div className="w-[30%] ml-10">
          <Calendar />
          <div className="box">
            <p className="text-2xl mb-4">Announcements</p>
            <OpenPDF />
          </div>
          <div className="box">
            <p className="text-2xl mb-4">Case Resolution</p>
          </div>
        </div>
      </div>
    </>
  );
}
