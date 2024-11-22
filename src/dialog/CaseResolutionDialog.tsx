"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Gavel, CalendarIcon, NotepadText, Upload } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/utils/supabase/client";
import { useUploadThing } from "@/app/utils/uploadthing";

interface TrackingRecordingDialogProps {
  caseId: string;
}
export default function CaseResolutionDialog({
  caseId,
}: TrackingRecordingDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [caseInput, setCaseInput] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();
  const [studentID, setStudentID] = useState("");
  const [contactInfo, setCaseContact] = useState("");
  const [studentEmail, setCaseEmail] = useState("");
  const { startUpload } = useUploadThing("imageUploader");
  const [file1, setFile1] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStartDate(null);
      setEndDate(null);
    } else {
      if (textareaRef.current) {
        textareaRef.current.value = "";
      }
      setErrorMessage("");
    }
  }, [isOpen]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsUploading(true);

    let fileUrl: string | null = null;

    if (file1) {
      const uploadedFile = await startUpload([file1]);
      fileUrl = uploadedFile?.[0]?.url || null;
    }

    const addata = {
      caseResolution: caseInput,
      caseResolutionStart: startDate,
      caseResolutionEnd: endDate,
      studentID: studentID,
      contactInfo: contactInfo,
      studentEmail: studentEmail,
      caseResolutionDocument: fileUrl,
      caseResolutionStatus: "For Resolution",
      caseTracking: "Solved",
      resolutionStatus: "For Resolution",
    };

    try {
      const { data, error: fetchError } = await supabase
        .from("sti_dgoms_case")
        .update(addata)
        .eq("id", caseId);

      if (fetchError) throw fetchError;

      setIsOpen(false);
      router.push("/dashboard/solved-cases");
    } catch (error) {
      console.error("Error during operation:", error);
      setErrorMessage("An error occurred while processing your request");
    }
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from("trackingRecordingAction")
        .delete()
        .eq("id", caseId);
      if (error) throw error;
      setIsOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error deleting record:", error);
      setErrorMessage("An error occurred while deleting the record");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline" className="h-8 w-8 rounded-full">
          <NotepadText className="h-4 w-4" color="black" />
          <span className="sr-only">Open case decision</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-semibold">
            Case Resolution
          </DialogTitle>
          <DialogDescription className="text-center">
            Enter the case resolution details below
          </DialogDescription>
        </DialogHeader>
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid  gap-4">
                <div className="space-y-2">
                  <Label htmlFor="case">Student Name</Label>
                  <Input
                    id="case"
                    value={caseInput}
                    onChange={(e) => setCaseInput(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid  gap-4">
                <div className="space-y-2">
                  <Label htmlFor="case">Student ID</Label>
                  <Input
                    id="studentID"
                    value={studentID}
                    onChange={(e) => setStudentID(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid  gap-4">
                <div className="space-y-2">
                  <Label htmlFor="case">Offense Committed</Label>
                  <Input
                    id="contactInfo"
                    value={contactInfo}
                    onChange={(e) => setCaseContact(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Attach File Case Resolution</Label>
                  <div className="rounded-lg border border-dashed p-4">
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <Input
                        type="file"
                        id="fileAddEvidence"
                        onChange={(event) =>
                          setFile1(event.target.files?.[0] || null)
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              {errorMessage && (
                <div className="rounded-lg bg-red-200 p-3 text-center text-sm text-red-700">
                  {errorMessage}
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                >
                  Delete
                </Button>
                <Button type="submit">Submit</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
