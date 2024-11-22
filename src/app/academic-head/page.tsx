import { DashboardChart } from "@/components/charts/DashboardChart";
import UserCard from "@/components/UseCard";
import StudentChart from "@/components/StudentChart";
import IncidentReport from "@/components/IncidentReport";
import { Calendar } from "@/components/ui/calendar";
import { Bell } from "lucide-react";
import { getUser } from "@/utils/supabase/server";
import { supabase } from "@/utils/supabase/client";

export default async function Dashboard() {
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
    <div>
      <div className="p-4 flex gap-4">
        <div className="w-3/4 flex flex-col gap-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <UserCard type="ongoingCases" />
            <UserCard type="majorCase" />
            <UserCard type="minorCase" />
            <UserCard type="totalcase" />
          </div>
          <div className="flex lg:flex-row gap-4">
            <div className="w-full lg:w-1/2 h-[500px]">
              <StudentChart />
            </div>
            <div className="w-full lg:w-1/2 h-[500px]">
              <DashboardChart />
            </div>
          </div>
          <div className="w-full"></div>
        </div>
        <div className="w-1/4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <Calendar className="w-full" />
          </div>
          <div className="box mt-2 bg-white">
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
    </div>
  );
}
