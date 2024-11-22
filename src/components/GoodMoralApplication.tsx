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
  DeleteAppointmentDialog,
} from "@/dialog/SetAppointmentDialog";
import { supabase } from "@/utils/supabase/client";
import Loading from "@/app/dashboard/loading";
import dayjs from "dayjs";
import { Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GMRAppointment, GMRDeny } from "@/dialog/GMRAppointment";

type Appointment = {
  id: number;
  date: string;
  time: string;
  filled_by: string;
  url: string | null;
};

interface AppointmentsClientProps {
  username: string;
}

export default async function GoodMoralApplication({
  username,
}: AppointmentsClientProps) {
  const { data: gmr, error: gmrError } = await supabase
    .from("good_moral_requests")
    .select("*");

  if (!gmr) {
    console.log("failed to get gmr data");
  }

  const handleOpenImage = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <div className="w-full p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Good Moral Application</h1>
      </div>
      <div className="flex flex-col space-y-24">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Request Status</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Appointment</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(gmr?.length ?? 0) > 0 ? (
              gmr?.map((goodmoral) => {
                return (
                  <TableRow key={goodmoral.id}>
                    <TableCell>{goodmoral.student_name}</TableCell>
                    <TableCell>{goodmoral.request_status}</TableCell>
                    <TableCell>
                      {goodmoral.url ? (
                        <div className="flex items-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenImage(goodmoral.url)}
                          >
                            <Link className="h-4 w-4 mr-2" />
                            View Image
                          </Button>
                        </div>
                      ) : (
                        "No image"
                      )}
                    </TableCell>
                    <TableCell>
                      {goodmoral.appointment_schedule ? (
                        <>{goodmoral.appointment_schedule}</>
                      ) : (
                        <GMRAppointment gmrId={goodmoral.id} />
                      )}
                    </TableCell>

                    <TableCell className="justify-center flex">
                      <GMRDeny gmrId={goodmoral.id} />
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
