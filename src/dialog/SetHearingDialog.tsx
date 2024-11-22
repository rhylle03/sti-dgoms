"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, CalendarIcon, Plus } from "lucide-react";
import DatePicker from "react-datepicker";
import { supabase } from "@/utils/supabase/client";
import "react-datepicker/dist/react-datepicker.css";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function SetHearingDialog({ caseId }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isStartPopoverOpen, setIsStartPopoverOpen] = useState(false);
  const [isEndPopoverOpen, setIsEndPopoverOpen] = useState(false);
  const router = useRouter();

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
    setIsStartPopoverOpen(false);
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date);
    setIsEndPopoverOpen(false);
  };

  const handleSubmit = async () => {
    setErrorMessage("");

    if (!textareaRef.current || textareaRef.current.value === "") {
      setErrorMessage("Hearing instruction is empty");
      return;
    }

    if (!startDate || !endDate) {
      setErrorMessage("Date is empty or invalid");
      return;
    }

    const updateData = {
      caseHearingInstruction: textareaRef.current.value,
      caseHearingStartDate: startDate,
      caseHearingEndDate: endDate,
      incidentStatus: "Ongoing",
      setForHearing: "Hearing",
      hearingStatus: "Hearing Set",
      hearingCreated: new Date(),
      caseTracking: "Hearing",
    };

    try {
      const { error: updateError } = await supabase
        .from("sti_dgoms_case")
        .update(updateData)
        .eq("id", caseId);

      if (updateError) {
        console.error("Error updating hearing incident:", updateError);
        setErrorMessage("Failed to update case for hearing.");
        return;
      }

      router.push("/dashboard/set-hearing");

      console.log("Case successfully set for hearing and investigation.");
    } catch (error) {
      console.error("Error during update:", error);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <div className="flex items-end gap-2 px-6 py-3 bg-red-600 text-white rounded-full">
          <Calendar size={16} />
        </div>
      </DialogTrigger>
      <DialogTitle></DialogTitle>
      <DialogContent>
        <form>
          <div>
            <div className="mb-2 text-lg">Hearing instruction</div>
            <div>
              <textarea
                className="w-[50em] border shadow-sm p-3"
                rows={5}
                ref={textareaRef}
              ></textarea>
            </div>
            <div>
              <p className="mb-2 text-lg">Hearing and Investigation Schedule</p>
              <div className="flex items-center space-x-2">
                <Popover
                  open={isStartPopoverOpen}
                  onOpenChange={setIsStartPopoverOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="justify-start text-left font-normal"
                      onClick={() => setIsStartPopoverOpen(true)}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate
                        ? startDate.toLocaleString()
                        : "Select Start Date & Time"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <DatePicker
                      selected={startDate}
                      onChange={handleStartDateChange}
                      showTimeSelect
                      dateFormat="yyyy/MM/dd HH:mm"
                      className="border p-2 rounded"
                      placeholderText="Start Date & Time"
                      onClickOutside={() => setIsStartPopoverOpen(false)}
                    />
                  </PopoverContent>
                </Popover>
                {" - "}

                <Popover
                  open={isEndPopoverOpen}
                  onOpenChange={setIsEndPopoverOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="justify-start text-left font-normal"
                      onClick={() => setIsEndPopoverOpen(true)}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate
                        ? endDate.toLocaleString()
                        : "Select End Date & Time"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <DatePicker
                      selected={endDate}
                      onChange={handleEndDateChange}
                      showTimeSelect
                      dateFormat="yyyy/MM/dd HH:mm"
                      className="border p-2 rounded"
                      placeholderText="End Date & Time"
                      onClickOutside={() => setIsEndPopoverOpen(false)}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="justify-center flex flex-col mt-5">
              <p className="text-red-500 text-center">{errorMessage}</p>
              <button
                type="button"
                onClick={handleSubmit}
                className="bg-sti-blue text-white px-7 py-3 mt-3 rounded-md hover:bg-sti-yellow hover:text-black transition-all"
              >
                Set for Hearing & Investigation
              </button>

              <button
                type="button"
                className="bg-red-500 text-white px-7 py-3 mt-3 rounded-md hover:text-black transition-all"
              >
                Dismiss Hearing & Investigation
              </button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
