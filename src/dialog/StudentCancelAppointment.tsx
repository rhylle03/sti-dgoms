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
import { Calendar as CalendarIcon, Trash } from "lucide-react";

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

export function StudentCancelAppoinment({ appointmentId, full_name }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reason, setReason] = useState<string>("");

  const handleDelete = async () => {
    if (!reason) {
      alert("Please provide a reason before submitting.");

      return;
    }

    setIsLoading(true);

    const { error } = await supabase
      .from("appointments")
      .update({
        request_status: "cancelled",
        reason: reason,
      })
      .eq("id", appointmentId);

    const { error: consultationError } = await supabase
      .from("consultation")
      .update({
        request_status: "cancelled",
        reason: reason,
      })
      .eq("student_name", full_name);

    setIsLoading(false);
    window.location.reload();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="cursor-pointer bg-red-600 p-3 text-white rounded-md text-sm mt-3">
          Cancel Appointment
        </div>
      </DialogTrigger>
      <DialogContent className="w-[32em]">
        <DialogHeader>
          <DialogTitle className="text-left">Cancel Appointment?</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3 mt-5">
          <div className=" text-sm text-slate-500">
            You can only delete appointments 24 hours of the accepted date.
            <br />
            Are sure you want to delete appointment?
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
