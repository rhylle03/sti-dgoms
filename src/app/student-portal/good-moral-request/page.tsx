import GoodMoralRequestDialog from "@/dialog/GoodMoralRequestDialog";
import { supabase } from "@/utils/supabase/client";
import { cookies } from "next/headers";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "react-day-picker";
import {
  CalendarDays,
  CalendarIcon,
  CheckCircleIcon,
  FileText,
  XCircleIcon,
} from "lucide-react";
import BookConsultation from "@/dialog/BookConsultation";
import { getUser } from "@/utils/supabase/server";
import { StudentCancelAppoinment } from "@/dialog/StudentCancelAppointment";
import dayjs from "dayjs";

export default async function Page() {
  const user = await getUser();

  const { data: userData } = await supabase
    .from("users")
    .select("*")
    .eq("email", user.email)
    .single();

  if (!userData) {
    return <div>User not found</div>;
  }

  const { data: gmrData, error: gmrError } = await supabase
    .from("good_moral_requests")
    .select("*")
    .eq("student_name", user.user_metadata?.full_name);

  if (gmrError) {
    return <div>Error: {gmrError.message}</div>;
  }

  const { data: consultationData, error: consultationError } = await supabase
    .from("consultation")
    .select("*")
    .eq("student_name", user.user_metadata?.full_name);

  if (consultationError) {
    return <div>Error: {consultationError.message}</div>;
  }

  return (
    <div className="m-auto p-4 space-y-6 max-w-2xl">
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 opacity-90" />
          <CardHeader className="relative">
            <CardTitle className="text-xl text-white">
              Submit Good Moral Request
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <GoodMoralRequestDialog fullName={user.user_metadata?.full_name} />
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-700 opacity-90" />
          <CardHeader className="relative">
            <CardTitle className="text-xl text-white">
              Schedule Consultation
            </CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <BookConsultation fullName={user.user_metadata?.full_name} />
          </CardContent>
        </Card>
      </div>

      <Card className="">
        <CardHeader>
          <CardTitle>Request Status</CardTitle>
        </CardHeader>
        <CardContent>
          <h2 className="text-xl font-semibold mb-4">
            Good Moral Request Status
          </h2>
          {gmrData.length === 0 ? (
            <div className="text-gray-500"> No Good Moral Request Found </div>
          ) : (
            <>
              {gmrData.map((request: any) => {
                let statusColor = "";
                let statusIcon = null;

                if (request.request_status === "open") {
                  statusColor = "bg-yellow-100 text-yellow-800";
                  statusIcon = <CheckCircleIcon className="w-4 h-4 mr-2" />;
                } else if (request.request_status === "accepted") {
                  statusColor = "bg-green-100 text-green-800";
                  statusIcon = <CheckCircleIcon className="w-4 h-4 mr-2" />;
                } else if (request.request_status === "denied") {
                  statusColor = "bg-red-100 text-red-800";
                  statusIcon = <XCircleIcon className="w-4 h-4 mr-2" />;
                }

                return (
                  <div key={request.id} className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Student Name:</span>
                      <span>{user.user_metadata?.full_name}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="font-medium">Request Status:</span>
                      <span
                        className={`px-3 py-1 rounded-full flex items-center ${statusColor}`}
                      >
                        {statusIcon}
                        {request.request_status.charAt(0).toUpperCase() +
                          request.request_status.slice(1)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="font-medium">Appointment Schedule:</span>
                      <span className="flex items-center">
                        <CalendarIcon className="w-4 h-4 mr-2 text-gray-500" />
                        {request.appointment_schedule
                          ? `Appointment set for ${format(
                              parseISO(request.appointment_schedule),
                              "MM/dd/yyyy HH:mmaa"
                            )}`
                          : "No Appointment set yet"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </>
          )}
          <hr className="w-full my-6"></hr>
          <h2 className="text-xl font-semibold my-4">Consultation Status</h2>
          {consultationData.length === 0 ? (
            <div className="text-gray-500"> No Consultation Request Found </div>
          ) : (
            <>
              {consultationData.map((requestc: any) => {
                let statusColor = "";
                let statusIcon = null;

                if (requestc.request_status === "scheduled") {
                  statusColor = "bg-yellow-100 text-yellow-800";
                  statusIcon = <CheckCircleIcon className="w-4 h-4 mr-2" />;
                } else if (requestc.request_status === "complete") {
                  statusColor = "bg-green-100 text-green-800";
                  statusIcon = <CheckCircleIcon className="w-4 h-4 mr-2" />;
                } else if (requestc.request_status === "denied") {
                  statusColor = "bg-red-100 text-red-800";
                  statusIcon = <XCircleIcon className="w-4 h-4 mr-2" />;
                } else if (requestc.request_status === "cancelled") {
                  statusColor = "bg-red-100 text-red-800";
                  statusIcon = <XCircleIcon className="w-4 h-4 mr-2" />;
                }

                return (
                  <div key={requestc.id} className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Student Name:</span>
                      <span>{user.user_metadata?.full_name}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="font-medium">Request Status:</span>
                      <span
                        className={`px-3 py-1 rounded-full flex items-center ${statusColor}`}
                      >
                        {statusIcon}
                        {requestc.request_status.charAt(0).toUpperCase() +
                          requestc.request_status.slice(1)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="font-medium">Appointment Schedule:</span>
                      <span className="flex items-center">
                        <CalendarIcon className="w-4 h-4 mr-2 text-gray-500" />
                        {requestc.appointment_schedule_start ||
                        requestc.appointment_schedule_end
                          ? `${format(
                              parseISO(requestc.appointment_schedule_start),
                              "MM/dd/yyyy HH:mm aa"
                            )} - ${format(
                              parseISO(requestc.appointment_schedule_end),
                              "HH:mm aa"
                            )}`
                          : "No Appointment set yet"}
                      </span>
                    </div>
                    {requestc.request_status === "scheduled" &&
                    dayjs().diff(dayjs(requestc.accepted_at), "hours") <= 24 ? (
                      <div className="w-full flex justify-end">
                        <StudentCancelAppoinment
                          full_name={user.user_metadata?.full_name}
                          appointmentId={requestc.appointment_id}
                        />
                      </div>
                    ) : null}

                    {requestc.request_status === "denied" ? (
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Reason:</span>
                        <span>{requestc.reason}</span>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
