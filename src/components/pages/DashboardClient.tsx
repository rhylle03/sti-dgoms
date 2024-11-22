"use client";

import React from "react";
import UserCard from "../UseCard";
import { DashboardChart } from "../charts/DashboardChart";
import StudentChart from "../StudentChart";
import { Bell } from "lucide-react";
import IncidentReport from "../IncidentReport";
import { Calendar } from "../ui/calendar";

export default function DashboardClient({ userType }: any) {
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
          <div className="w-full">
            <div className="w-full h-[500px]">
              {userType === "Discipline Officer" && (
                <div className="box bg-white p-4 rounded-lg shadow-sm">
                  <>
                    <div className="flex items-center gap-2">
                      <h1 className="font-bold text-xl">New Reports</h1>
                      <Bell width={24} height={24} className="text-gray-500" />
                    </div>
                    <p className="mb-4 text-slate-500">
                      Accept or Deny reports as a valid case
                    </p>

                    <IncidentReport />
                  </>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="w-1/4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <Calendar className="w-full" />
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm mt-4">
            Announcements
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
}
