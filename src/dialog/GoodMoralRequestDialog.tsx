"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Loading from "@/app/dashboard/loading";
import { supabase } from "@/utils/supabase/client";
import { useUploadThing } from "@/app/utils/uploadthing";
import { cn } from "@/lib/utils";

export default function GoodMoralRequestDialog({
  fullName,
}: {
  fullName: string;
}) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isRequestSent, setIsRequestSent] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const checkGoodMoralStatus = async () => {
      try {
        const { data, error } = await supabase
          .from("good_moral_requests")
          .select("student_name, request_status")
          .eq("student_name", fullName);

        if (error) {
          console.error("Error fetching data:", error);
          return;
        }

        if (data && data.length > 0) {
          setIsRequestSent(true);
          const requestStatus = data[0].request_status;
          if (requestStatus === "accepted") {
            setIsAccepted(true);
          }
        } else {
          setIsRequestSent(false);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (fullName) {
      checkGoodMoralStatus();
    }
  }, [fullName]);

  const { startUpload } = useUploadThing("imageUploader");

  const handleSubmit = async () => {
    if (!file) {
      alert("Please upload a file.");
      return;
    }

    setIsUploading(true);

    try {
      const uploadedFiles = await startUpload([file]);
      const fileUrl = uploadedFiles?.[0]?.url;

      if (!fileUrl) {
        throw new Error("Failed to get the file URL.");
      }

      const { error: insertError } = await supabase
        .from("good_moral_requests")
        .insert([
          {
            student_name: fullName,
            request_status: "open",
            url: fileUrl,
          },
        ]);

      if (insertError) throw insertError;

      console.log("New request created successfully.");
      setIsRequestSent(true);
      setOpen(false);
    } catch (err) {
      console.error("Unexpected error during submission:", err);
      alert(
        "An error occurred while submitting your request. Please try again."
      );
    } finally {
      setIsUploading(false);
      window.location.reload();
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger disabled={isAccepted || isRequestSent} className="w-full">
        <div
          className={cn(
            "py-3 px-5 bg-sti-yellow rounded-md transition-all hover:text-black",
            isAccepted || isRequestSent ? "opacity-50 hover:bg-sti-yellow" : ""
          )}
        >
          {isRequestSent
            ? isAccepted
              ? "Good Moral Submitted"
              : "Request Pending"
            : "Submit Good Moral"}
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Request Good Moral</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="file">Upload Receipt</Label>
            <Input
              type="file"
              id="file"
              onChange={(event) => setFile(event.target.files?.[0] || null)}
            />
            {file && (
              <p className="text-sm text-green-600">
                File selected: {file.name}
              </p>
            )}
            <p className="text-sm text-muted-foreground">
              Please upload the receipt you received from the counter.
            </p>
          </div>
        </div>

        <Button
          className="bg-sti-blue"
          onClick={handleSubmit}
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Submit Request"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
