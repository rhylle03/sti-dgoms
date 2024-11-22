"use client";

import { PlusIcon, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { supabase } from "@/utils/supabase/client";
import dayjs from "dayjs";

const GMRAppointment = ({ gmrId }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState("");

  const handleSubmit = async () => {
    const appointmentDateTime = dayjs(`${date} ${time}`).format(
      "YYYY-MM-DD HH:mm:ss"
    );

    const { error } = await supabase
      .from("good_moral_requests")
      .update({ appointment_schedule: appointmentDateTime })
      .eq("id", gmrId);

    if (error) {
      console.error("Error updating request status:", error);
    } else {
      console.log("Request status updated successfully.");
      setIsOpen(false);
    }

    if (error) {
      setError("Failed to add appointment.");
      console.error(error.message);
      return;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-sti-blue hover:bg-sti-yellow hover:text-black">
          <PlusIcon className="mr-2 h-4 w-4" />
          Set Appointment
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Appointment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 w-[25em]">
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              name="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              name="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>
          {error && <div className="text-red-500">{error}</div>}
          <Button
            className="bg-sti-blue hover:bg-sti-yellow hover:text-black"
            type="submit"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Appointment"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export { GMRAppointment };

const GMRDeny = ({ gmrId }: any) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async () => {
    const { error } = await supabase
      .from("good_moral_requests")
      .update({ request_status: "denied", appointment_schedule: null })
      .eq("id", gmrId);

    if (error) {
      console.error("Error updating request status:", error);
    } else {
      console.log("Request status updated successfully.");
      setIsOpen(false);
      window.location.reload();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="cursor-pointer">
          <Trash2 className="text-red-500"></Trash2>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-left">Deny Appointment?</DialogTitle>
        </DialogHeader>
        <div className="my-5">Are you sure you want to deny appointment?</div>
        <div className="w-[30em]">
          <Button
            onClick={handleSubmit}
            className="bg-red-600 hover:bg-red-400"
          >
            Yes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { GMRDeny };
