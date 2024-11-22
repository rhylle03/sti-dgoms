"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/utils/supabase/client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function SetResolution({ caseId, fullName }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [incidentStatus, setIncidentStatus] = useState("");
  const router = useRouter();
  const [startDate, setStartDate] = React.useState<Date>();
  const [endDate, setEndDate] = React.useState<Date>();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async () => {
    if (!textareaRef.current || textareaRef.current.value === "") {
      setErrorMessage("Resolution is empty");
      return;
    }

    console.log(startDate, endDate);

    if (
      !startDate ||
      isNaN(startDate.getTime()) ||
      !endDate ||
      isNaN(endDate.getTime())
    ) {
      setErrorMessage("Date is empty or invalid");
      return;
    }

    const { data, error } = await supabase
      .from("cases")
      .update({
        case_resolution: textareaRef.current.value,
        case_resolution_start_date: startDate,
        case_resolution_end_date: endDate,
      })

      .eq("id", caseId);

    if (error) {
      console.error("Error updating case:", error);
      setErrorMessage("Error in sending resolution");
    } else {
      console.log("Resolution updated for caseId:", caseId);
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <div className="px-6 py-3 bg-yellow-400 text-black rounded-full mr-6">
          {" "}
          Set Resolution
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <div className="mb-3">{fullName}</div>
          </DialogTitle>
          <DialogDescription>
            <div>
              <div className="mb-2 text-lg">Case Resolution</div>
              <div>
                <textarea
                  className="w-full border shadow-sm p-3"
                  name=""
                  id=""
                  rows={4}
                  ref={textareaRef}
                ></textarea>
              </div>
              <div className="">
                <p className="mb-2 text-lg">Resolution Schedule</p>
                <div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "justify-start text-left font-normal",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? (
                          format(startDate, "PPP")
                        ) : (
                          <span>Start Date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {" - "}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "justify-start text-left font-normal",
                          !endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? (
                          format(endDate, "PPP")
                        ) : (
                          <span>End Date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="justify-center flex flex-col mt-5">
                <p className="text-red-500 text-center">{errorMessage}</p>
                <button
                  onClick={handleSubmit}
                  className="bg-sti-blue text-white px-7 py-3 mt-3 rounded-md hover:bg-sti-yellow hover:text-black transition-all"
                >
                  Send
                </button>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
