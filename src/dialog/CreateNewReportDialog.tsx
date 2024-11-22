"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/utils/supabase/client";

export default function CreateReportDialog() {
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const reportData = {
      offenderName: formData.get("name"),
      typeOfIncident: formData.get("case"),
      studentID: formData.get("studentId"),
      studentSection: formData.get("section"),
      incidentDescription: formData.get("description"),
      offenseType: "Minor",
    };

    const { data, error } = await supabase
      .from("sti_dgoms_case")
      .insert([reportData]);

    if (error) {
      console.error("Error inserting data:", error.message);
    } else {
      console.log("Report created successfully:", data);
      setOpen(false);

      if (formRef.current) {
        formRef.current.reset();
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button onClick={() => setOpen(true)}>Create New Report</Button>
      <DialogContent className="w-[50em]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl ">
            Create new report
          </DialogTitle>
        </DialogHeader>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="case">Case</Label>
            <Input id="case" name="case" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="studentId">Student ID</Label>
            <Input id="studentId" name="studentId" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="section">Student Section</Label>
            <Input id="section" name="section" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Case Description</Label>
            <Textarea
              id="description"
              name="description"
              className="min-h-[100px]"
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600"
          >
            Submit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
