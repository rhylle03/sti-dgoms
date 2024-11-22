"use client";

import { useEffect, useState } from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
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

export default function GoodMoralRequestDialog({ fullName }: any) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [availableAppointments, setAvailableAppointments] = useState<any[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [isRequestSent, setIsRequestSent] = useState(false);
  const [hasSubmittedBefore, setHasSubmittedBefore] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  useEffect(() => {
    const fetchAvailableAppointments = async () => {
      if (!date) return;

      const formattedDate = format(date, "yyyy-MM-dd'T'HH:mm:ss");

      try {
        const { data: appointments, error } = await supabase
          .from("appointments")
          .select("*")
          .eq("date::date", format(date, "yyyy-MM-dd"))
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
    const checkGoodMoralStatus = async () => {
      try {
        const { data, error } = await supabase
          .from("good_moral_requests")
          .select("student_name, request_status")
          .eq("student_name", fullName);

        if (error) {
          console.error("Error fetching data:", error);
          return;
        }

        if (data && data.length > 0) {
          setIsRequestSent(true);

          const requestStatus = data[0].request_status;
          if (requestStatus === "denied") {
            setHasSubmittedBefore(true);
          } else if (requestStatus === "accepted") {
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
      checkGoodMoralStatus();
    }
  }, [fullName]);

  const handleSubmit = async () => {
    if (!file || !date || !selectedAppointment) {
      alert("Please fill all the required fields.");
      return;
    }

    try {
      const { error } = await supabase
        .from("appointments")
        .update({ filled_by: fullName })
        .eq("id", selectedAppointment.id);

      if (error) {
        console.error("Error updating appointment:", error);
        return;
      }

      console.log("Request submitted successfully!");
      setOpen(false);
    } catch (err) {
      console.error("Unexpected error submitting request:", err);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        disabled={isAccepted || (isRequestSent && !hasSubmittedBefore)}
      >
        <div
          className={cn(
            "py-3 px-5 bg-sti-yellow rounded-md transition-all hover:text-black",
            isAccepted || (isRequestSent && !hasSubmittedBefore)
              ? "opacity-50 hover:bg-sti-yellow"
              : ""
          )}
        >
          {isRequestSent
            ? hasSubmittedBefore
              ? "Submit Another Request"
              : "Good Moral Submitted"
            : "Submit Good Moral"}
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Request Good Moral</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="file">Upload Receipt</Label>
            <Input
              className="text-slate-500 cursor-pointer"
              id="file"
              type="file"
              onChange={handleFileChange}
            />
            <p className="text-sm text-muted-foreground">
              Please upload the receipt you received from the counter.
            </p>
          </div>

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
                    {appointment.user} {appointment.time}
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

        <Button className="bg-sti-blue" onClick={handleSubmit}>
          Submit Request
        </Button>
      </DialogContent>
    </Dialog>
  );
}
