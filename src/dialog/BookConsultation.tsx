"use client";

import { useEffect, useState } from "react";
import { CalendarIcon } from "lucide-react";
import { format, parseISO, formatISO } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import Loading from "@/app/dashboard/loading";
import { supabase } from "@/utils/supabase/client";
import { useUploadThing } from "@/app/utils/uploadthing";
import { url } from "inspector";
import dayjs from "dayjs";

export default function BookConsultation({ fullName }: { fullName: string }) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [availableAppointments, setAvailableAppointments] = useState<any[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [isRequestSent, setIsRequestSent] = useState(false);
  const [hasSubmittedBefore, setHasSubmittedBefore] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchAvailableAppointments = async () => {
      if (!date) return;

      const formattedDate = format(date, "yyyy-MM-dd");

      try {
        const { data: appointments, error } = await supabase
          .from("appointments")
          .select("*")
          .eq("date_start", formattedDate)
          .is("filled_by", null);

        if (error) {
          console.error("Error fetching appointments:", error);
          return;
        }

        setAvailableAppointments(appointments || []);
      } catch (err) {
        console.error("Unexpected error fetching appointments:", err);
      }
    };

    fetchAvailableAppointments();
  }, [date]);

  useEffect(() => {
    const checkConsultation = async () => {
      try {
        const { data, error } = await supabase
          .from("consultation")
          .select("student_name, request_status")
          .eq("student_name", fullName);

        if (error) {
          console.error("Error fetching data:", error);
          return;
        }

        if (data && data.length > 0) {
          setIsRequestSent(true);

          const requestStatus = data[0].request_status;
          if (requestStatus === "denied" || requestStatus === "cancelled") {
            setHasSubmittedBefore(true);
          } else if (requestStatus === "complete") {
            setIsAccepted(true);
          }
        } else {
          setIsRequestSent(false);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (fullName) {
      checkConsultation();
    }
  }, [fullName]);

  const handleSubmit = async () => {
    if (!date || !selectedAppointment) {
      alert("Please fill all the required fields.");
      return;
    }

    setIsUploading(true);

    try {
      const appointmentDate = format(date, "yyyy-MM-dd");
      const appointmentTimeStart = dayjs(selectedAppointment.time_start).format(
        "HH:mm:ss"
      );
      const appointmentTimeEnd = dayjs(selectedAppointment.time_end).format(
        "HH:mm:ss"
      );
      const appointmentDateTimeStart = dayjs(
        `${appointmentDate}T${appointmentTimeStart}`
      ).toISOString();
      const appointmentDateTimeEnd = dayjs(
        `${appointmentDate}T${appointmentTimeEnd}`
      ).toISOString();

      const { data: existingRecord, error: selectError } = await supabase
        .from("consultation")
        .select("id")
        .eq("student_name", fullName)
        .maybeSingle();

      if (selectError) throw selectError;

      if (existingRecord) {
        const { error: updateError } = await supabase
          .from("consultation")
          .update({
            request_status: "scheduled",
            appointment_schedule_start: appointmentDateTimeStart,
            appointment_schedule_end: appointmentDateTimeEnd,
            appointment_id: selectedAppointment.id,
            accepted_at: new Date().toISOString(),
          })
          .eq("id", existingRecord.id);

        if (updateError) throw updateError;
        console.log("Request status updated successfully.");
      } else {
        const { error: insertError } = await supabase
          .from("consultation")
          .insert([
            {
              student_name: fullName,
              request_status: "scheduled",
              appointment_schedule_start: appointmentDateTimeStart,
              appointment_schedule_end: appointmentDateTimeEnd,
              appointment_id: selectedAppointment.id,
              accepted_at: new Date().toISOString(),
            },
          ]);

        if (insertError) throw insertError;
        console.log("New request created successfully.");
      }

      const { error: errorapp } = await supabase
        .from("appointments")
        .update({ filled_by: fullName, accepted_at: new Date().toISOString() })
        .eq("id", selectedAppointment.id);

      if (errorapp) {
        console.error("Error updating appointment:", errorapp);
        throw new Error("Failed to update appointment");
      }

      console.log("Request submitted successfully!");
      setIsRequestSent(true);
      setOpen(false);
    } catch (err) {
      console.error("Unexpected error during submission:", err);
      alert(
        "An error occurred while submitting your request. Please try again."
      );
    } finally {
      setIsUploading(false);
      window.location.reload();
    }
  };

  if (isLoading) {
    return <Loading />;
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        disabled={isRequestSent && !hasSubmittedBefore && !isAccepted}
        className="w-full"
      >
        {isAccepted ? (
          <>
            <div className="py-3 px-5 bg-sti-yellow rounded-md transition-all hover:text-black">
              Book Consultation
            </div>{" "}
          </>
        ) : (
          <>
            <div
              className={cn(
                "py-3 px-5 bg-sti-yellow rounded-md transition-all hover:text-black",
                isRequestSent && !hasSubmittedBefore
                  ? "opacity-50 hover:bg-sti-yellow"
                  : ""
              )}
            >
              {isRequestSent
                ? hasSubmittedBefore
                  ? "Submit Another Consultation"
                  : "Booking Submitted"
                : "Book Consultation"}
            </div>
          </>
        )}
      </DialogTrigger>
      <DialogContent className="w-[32em]">
        <DialogHeader>
          <DialogTitle>Book Consultation</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Select Appointment Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date || undefined}
                  onSelect={(newDate) => setDate(newDate || null)}
                />
              </PopoverContent>
            </Popover>
          </div>

          {availableAppointments.length > 0 ? (
            <div className="grid gap-2">
              <Label>Available Appointment Slots</Label>
              <ul className="list-disc">
                {availableAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className={cn(
                      "text-sm p-2 border-2 border-slate-300 rounded-sm hover:bg-slate-400 cursor-pointer",
                      selectedAppointment?.id === appointment.id &&
                        "bg-slate-300"
                    )}
                    onClick={() => setSelectedAppointment(appointment)}
                  >
                    {appointment.service}{" "}
                    {dayjs(`${appointment.time_start}`).format("hh:mm a")} -{" "}
                    {dayjs(`${appointment.time_end}`).format("hh:mm a")}
                  </div>
                ))}
              </ul>
            </div>
          ) : (
            date && (
              <p className="text-sm text-muted-foreground">
                No available appointments for the selected date.
              </p>
            )
          )}
        </div>

        <Button
          className="bg-sti-blue"
          onClick={handleSubmit}
          disabled={isUploading}
        >
          {isUploading ? "Booking..." : "Submit Request"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
