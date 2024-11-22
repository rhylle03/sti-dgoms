"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SetAppointmentDialog, {
  CompleteAppointmentDialog,
  DeleteAppointmentDialog,
} from "@/dialog/SetAppointmentDialog";
import { supabase } from "@/utils/supabase/client";
import Loading from "@/app/dashboard/loading";
import dayjs from "dayjs";
import { parseISO, format } from "date-fns";

type Appointment = {
  id: number;
  date: string;
  time_start: string;
  time_end: string;
  filled_by: string;
  url: string | null;
  service: string | null;
};

interface AppointmentsClientProps {
  username: string;
}

export default function AppointmentsClient({
  username,
}: AppointmentsClientProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data: appointmentsData, error: appointmentsError } =
          await supabase
            .from("appointments")
            .select("*")
            .eq("user", username)
            .eq("request_status", "open");

        console.log(appointmentsData);
        if (appointmentsError) {
          setError(appointmentsError.message);
          setLoading(false);
          return;
        }

        setAppointments(appointmentsData || []);
        setLoading(false);
      } catch (err) {
        setError("An unexpected error occurred.");
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [username]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="w-full p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Appointments</h1>
        <SetAppointmentDialog fullName={username} />
      </div>
      <div className="flex flex-col space-y-24">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Filled By</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.length > 0 ? (
              appointments.map((appointment) => {
                const formattedDate = dayjs(
                  parseISO(appointment.time_start)
                ).format("MMMM D, YYYY");
                const formattedTimeStart = dayjs(
                  parseISO(appointment.time_start)
                ).format("h:mm A");
                const formattedTimeEnd = dayjs(
                  parseISO(appointment.time_end)
                ).format("h:mm A");

                return (
                  <TableRow key={appointment.id}>
                    <TableCell>{formattedDate}</TableCell>
                    <TableCell>
                      {formattedTimeStart} - {formattedTimeEnd}
                    </TableCell>
                    <TableCell>{appointment.filled_by}</TableCell>
                    <TableCell>{appointment.service}</TableCell>
                    <TableCell className="justify-center flex">
                      <div className="flex flex-row gap-3">
                        <DeleteAppointmentDialog
                          appointmentId={appointment.id}
                          appointmentFilledBy={appointment.filled_by}
                        />{" "}
                        {appointment.filled_by ? (
                          <>
                            <CompleteAppointmentDialog
                              appointmentId={appointment.id}
                              appointmentFilledBy={appointment.filled_by}
                            />
                          </>
                        ) : (
                          <></>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5}>No appointments found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
