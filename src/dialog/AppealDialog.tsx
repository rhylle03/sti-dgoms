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
import { useState, useRef, useEffect } from "react";

export default function AppealDialog({ caseId }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isAppealSent, setIsAppealSent] = useState(true);

  useEffect(() => {
    const checkAppealStatus = async () => {
      const { data, error } = await supabase
        .from("sti_dgoms_case")
        .select("appeal")
        .eq("id", caseId)
        .single();

      if (error) {
        console.error("Error fetching case:", error);
      } else {
        if ((data && data.appeal === null) || data.appeal === "") {
          setIsAppealSent(false);
        } else {
          setIsAppealSent(true);
        }
      }
    };

    if (caseId) {
      checkAppealStatus();
    }
  }, [caseId]);

  const handleSubmit = async () => {
    const appealText = textareaRef.current?.value;
    if (appealText) {
      const { data, error } = await supabase
        .from("sti-dgoms-case")
        .update({ appeal: appealText })
        .eq("id", caseId);

      if (error) {
        console.error("Error updating case:", error);
      } else {
        console.log("Appeal sent for caseId:", caseId);
        setIsOpen(false);
        setIsAppealSent(true);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger disabled={isAppealSent}>
        <div
          className={`p-3 bg-sti-blue text-white rounded-md w-[10em] justify-end 
            transition-all hover:bg-sti-yellow hover:text-black ${
              isAppealSent ? "opacity-50 hover:bg-sti-yellow" : ""
            } `}
        >
          {isAppealSent ? "Appeal Sent" : "Send Appeal"}
        </div>
      </DialogTrigger>
      <DialogContent className="w-[50em] mx-auto">
        <DialogHeader>
          <DialogTitle>
            <div className="mb-3">Send an Appeal</div>
          </DialogTitle>
          <DialogDescription>
            <div className="flex flex-col justify-center">
              <textarea
                className="p-3 border-2 m-4 border-black text-black"
                name="appealText"
                rows={3}
                ref={textareaRef}
              ></textarea>

              <button
                className="p-3 bg-sti-blue text-white rounded-md transition-all hover:bg-sti-yellow hover:text-black w-[10em] m-auto"
                onClick={handleSubmit}
              >
                Send Appeal
              </button>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
