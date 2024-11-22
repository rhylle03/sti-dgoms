"use client";

import { CalendarCheck, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/utils/supabase/client";

interface ForHearingDialogProps {
  caseId: string;
}

export default function CompleteResolutionDialog({
  caseId,
}: ForHearingDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("sti_dgoms_case")
        .update({ resolutionStatus: "Complete" })
        .eq("id", caseId);

      if (error) throw error;

      setIsOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error updating resolution status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 bg-green-100 hover:bg-green-200 text-green-700"
          >
            <CalendarCheck className="h-4 w-4" />
            <span className="sr-only">Complete Resolution</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Confirm Completion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to mark this resolution as complete? This
              action will update the status in the database.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Completing...
                </>
              ) : (
                "Confirm Completion"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
