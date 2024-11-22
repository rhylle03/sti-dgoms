"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, useEffect, useRef } from "react";

import React from "react";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  Check,
  DeleteIcon,
  PlusIcon,
  Trash,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { supabase } from "@/utils/supabase/client";
import dayjs from "dayjs";

export default function SetAppointmentDialog({ fullName }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState("");
  const [time_start, setTimeStart] = useState("");
  const [time_end, setTimeEnd] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState("");

  const handleSelect = (event: any) => {
    setSelectedService(event.target.value);
    console.log(`Selected service: ${event.target.value}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const startDatetime = dayjs(`${date}T${time_start}`).toISOString();
      const endDatetime = dayjs(`${date}T${time_end}`).toISOString();

      const { data, error } = await supabase.from("appointments").insert([
        {
          time_start: startDatetime,
          time_end: endDatetime,
          date_start: date,
          user: fullName,
          service: selectedService,
          request_status: "open",
        },
      ]);

      if (error) {
        setError("Failed to add appointment.");
        console.error(error.message);
        return;
      }

      setIsOpen(false);
      setDate("");
      setTimeStart("");
      console.log("Appointment added:", data);

      window.location.reload();
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
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
            <Label htmlFor="time">Start Time</Label>
            <Input
              id="time_start"
              name="time_start"
              type="time"
              value={time_start}
              onChange={(e) => setTimeStart(e.target.value)}
              required
            />
            <Label htmlFor="time">End Time</Label>
            <Input
              id="time_end"
              name="time_end"
              type="time"
              value={time_end}
              onChange={(e) => setTimeEnd(e.target.value)}
              required
            />
            <Label
              htmlFor="serviceList"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Service List
            </Label>
            <select
              id="serviceList"
              value={selectedService}
              onChange={handleSelect}
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            >
              <option value="" disabled>
                Select a service
              </option>
              <option value="Consultation">Consultation</option>
              <option value="Parent Teacher Conference">
                Parent Teacher Conference
              </option>
              <option value="Counselling">Counselling</option>
            </select>
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
}

export function DeleteAppointmentDialog({
  appointmentId,
  appointmentFilledBy,
}: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reason, setReason] = useState<string>("");

  const handleDelete = async () => {
    if (!reason) {
      alert("Please provide a reason before submitting.");
      return;
    }
    const { error: appError } = await supabase
      .from("appointments")
      .update({ request_status: "denied", reason: reason })
      .eq("id", appointmentId);

    if (appointmentFilledBy === null || "") {
      const { error: conError } = await supabase
        .from("consultation")
        .update({
          request_status: "denied",
          appointment_schedule: null,
          reason: reason,
        })
        .eq("student_name", appointmentFilledBy);
    }

    if (appError) {
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
        <Trash
          size={20}
          className=" text-red-600 mr-2 h-4 w-4 cursor-pointer"
        />
      </DialogTrigger>
      <DialogContent className="w-[32em]">
        <DialogHeader>
          <DialogTitle className="text-left">Delete Appointment?</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3 mt-5">
          <div className=" text-sm text-slate-500">
            Are you sure you want to delete appointment?
          </div>
          <div>
            <Label>Reason</Label>
            <Input
              name="reason"
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          <div className="flex justify-between">
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <button
              onClick={handleDelete}
              className="bg-red-500 px-4 py-2 text-white text-sm rounded-md"
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Yes"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function CompleteAppointmentDialog({
  appointmentId,
  appointmentFilledBy,
}: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reason, setReason] = useState<string>("");

  const handleComplete = async () => {
    setIsLoading(true);
    const { error: appError } = await supabase
      .from("appointments")
      .update({ request_status: "complete" })
      .eq("id", appointmentId);

    const { error: conError } = await supabase
      .from("consultation")
      .update({
        request_status: "complete",
        appointment_schedule_start: null,
        appointment_schedule_end: null,
      })
      .eq("student_name", appointmentFilledBy);

    if (appError || conError) {
      console.error("Error updating request status:", error);
    } else {
      console.log("Request status updated successfully.");
      setIsLoading(false);
      setIsOpen(false);
      window.location.reload();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Check
          size={20}
          className=" text-green-600 mr-2 h-4 w-4 cursor-pointer"
        />
      </DialogTrigger>
      <DialogContent className="w-[32em]">
        <DialogHeader>
          <DialogTitle className="text-left">Complete Appointment?</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3 mt-5">
          <div className=" text-sm text-slate-500">
            Are you sure you want to complete appointment?
          </div>

          <div className="flex justify-between">
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <button
              onClick={handleComplete}
              className="bg-green-500 px-4 py-2 text-white text-sm rounded-md"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Yes"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
