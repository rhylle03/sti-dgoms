"use client";

import { Calendar, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { supabase } from "@/utils/supabase/client";

interface ForHearingDialogProps {
  caseId: string;
  offenderName: string;
  typeOfIncident: string;
  incidentDescription: string;
  created_at: string;
  studentSection: string;
  sentBy: string;
  subjectForHearing: string;
  userSession: string;
  setForHearing: string;
  caseNumber: string;
}

export default function ForHearingDialog({
  caseId,
  offenderName,
  typeOfIncident,
  studentSection,
  sentBy,
  subjectForHearing,
  userSession,
  setForHearing: initialForHearing,
  caseNumber,
}: ForHearingDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentForHearing, setCurrentForHearing] = useState(initialForHearing);
  const router = useRouter();

  useEffect(() => {
    const fetchHearingStatus = async () => {
      const { data, error } = await supabase
        .from("sti_dgoms_case")
        .select("setForHearing")
        .eq("id", caseId)
        .single();

      if (error) {
        console.error("Error fetching hearing status:", error);
      } else {
        setCurrentForHearing(data?.setForHearing);
      }
    };

    fetchHearingStatus();
  }, [caseId]);

  const handleHearing = async () => {
    setIsLoading(true);
    try {
      const hearingData = {
        setForHearing: "For Hearing",
        forHearing: new Date(),
        caseTracking: "For Hearing",
      };

      const { error: updateError } = await supabase
        .from("sti_dgoms_case")
        .update(hearingData)
        .eq("id", caseId);

      if (updateError) throw updateError;
      setIsOpen(false);
      router.push("/dashboard/set-hearing");
    } catch (error) {
      console.error("Error during operation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("sti_dgoms_case")
        .delete()
        .eq("id", caseId);

      if (error) throw error;

      setIsOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting record:", error);
    } finally {
      setIsLoading(false);
    }
    console.log("Current userSession:", userSession);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 bg-green-100 hover:bg-green-200 text-green-700"
        >
          <Calendar className="h-4 w-4" />
          <span className="sr-only">Set hearing</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Set for Hearing
          </DialogTitle>
          <DialogDescription>
            Please review the case details below before proceeding.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Case #: {caseNumber}</CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 text-sm">
              <div className="grid grid-cols-3 gap-2">
                <div className="font-medium">Reported by</div>
                <div className="col-span-2">{sentBy}</div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="font-medium">Student involve</div>
                <div className="col-span-2">{offenderName}</div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="font-medium">Incident Type</div>
                <div className="col-span-2">{typeOfIncident}</div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="font-medium">Section</div>
                <div className="col-span-2">{studentSection}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {userSession !== "School Administrator" &&
          userSession !== "Guidance Associate" && (
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete Case"
                )}
              </Button>
              <Button
                className={`${
                  currentForHearing === "For Hearing"
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-green-500 hover:bg-green-600 text-white"
                }`}
                onClick={handleHearing}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : currentForHearing === "For Hearing" ? (
                  "Cancel Hearing"
                ) : (
                  "Set for Hearing"
                )}
              </Button>
            </DialogFooter>
          )}
      </DialogContent>
    </Dialog>
  );
}
