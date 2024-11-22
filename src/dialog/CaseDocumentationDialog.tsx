"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Scale, Upload, XCircle } from "lucide-react";
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

export function CaseDocumentationDialog({
  caseId,
  userSession,
}: {
  caseId: string;
  userSession?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [file1, setFile1] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { startUpload } = useUploadThing("imageUploader");

  const handleSubmit = async () => {
    if (!textareaRef.current?.value) {
      setErrorMessage("Case Documentation is required");
      return;
    }

    setIsUploading(true);

    let fileUrl: string | null = null;

    if (file1) {
      const uploadedFile = await startUpload([file1]);
      fileUrl = uploadedFile?.[0]?.url || null;
    }

    setIsOpen(false);

    const addata = {
      caseDocumentation: textareaRef.current.value,
      hearingNewStatus: "Hearing Ended",
      caseHearingEndDate: new Date(),
      setForHearing: "Hearing Ended",
      caseActionStatus: "For Decision",
      documentation_report: fileUrl || null,
      caseTracking: "For Decision",
      incidentStatus: "Hearing Ended",
    };

    const { data: ongoingCases, error: fetchError } = await supabase
      .from("sti_dgoms_case")
      .update(addata)
      .eq("id", caseId)
      .single();

    if (fetchError) {
      console.error("Error fetching hearing incident:", fetchError);
      return;
    }
    router.push("/dashboard/ongoing-cases");

    console.log("Case updated.");
    setIsUploading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline" className="h-8 w-8 rounded-full">
          <Scale className="h-4 w-4" />
          <span className="sr-only">Open case documentation</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[725px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-semibold">
            Document Report Case
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Fill out the documentation and attach any supporting evidence below.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <Card>
            <CardContent className="p-6">
              <form className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="documentation">
                    Documentation of the case hearing
                  </Label>
                  <textarea
                    id="documentation"
                    ref={textareaRef}
                    placeholder="Enter detailed documentation of the incident..."
                    className="w-full min-h-[150px] resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  />
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Provide more details by attaching file</Label>
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
                  <div className="rounded-lg bg-destructive/15 p-3 text-center text-sm text-destructive">
                    {errorMessage}
                  </div>
                )}

                {userSession !== "School Administrator" && (
                  <div className="flex flex-col gap-3">
                    <Button
                      type="button"
                      onClick={handleSubmit}
                      className="w-full bg-primary hover:bg-primary/90"
                      disabled={isUploading}
                    >
                      {isUploading ? "Uploading..." : "Document Case"}
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      className="w-full"
                      onClick={() => setIsOpen(false)}
                    >
                      Dismiss Case
                    </Button>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
