import SidebarLayout from "@/components/layout/sidebarlayout";

import { User } from "lucide-react";
import { getUser } from "@/utils/supabase/server";
import NotificationHearing from "@/components/NotificationHearing";

export const metadata = {
  title: "Dashboard",
  description: "Dashboard",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  return (
    <div className="flex h-screen">
      <div className="bg-sti-blue w-[20em]">
        <SidebarLayout />
      </div>

      <div className="flex-1 bg-[#F7F8FA] overflow-y-auto p-4">
        <div className="flex justify-between mb-4">
          <p className="ml-4 mt-5 text-2xl font-semibold">
            Welcome, {user?.user_metadata?.full_name}
          </p>
          <div className="flex items-center gap-6">
            <div className="flex flex-col text-end">
              <span className="font-medium">
                {user?.user_metadata?.full_name}
              </span>
              <span className="text-[10px] text-gray-500">{user?.role}</span>
            </div>
            <User />
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
