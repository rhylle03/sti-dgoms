"use client";

import React, { useState, useRef } from "react";
import Dialog from "@/modals/Dialog";
import { supabase } from "@/utils/supabase/client";
import { Input } from "../ui/input";
import { useUploadThing } from "@/app/utils/uploadthing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReportForm({ fullName = "" }) {
  const [formData, setFormData] = useState({
    studentGrade: "",
    programCourse: "",
    studentYear: "",
    studentSection: "",
    offenderName: "",
    typeOfIncident: "",
    incidentDescription: "",
    fileEvidence: "",
  });
  const [formMessage, setFormMessage] = useState("");
  const [showTerms, setShowTerms] = useState(true);
  const [fileEvidence, setEvidenceFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [hasScrolledToBottom, setHasScrolledToBottom] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 20;
      if (isAtBottom && !hasScrolledToBottom) {
        setHasScrolledToBottom(true);
      }
    }
  };

  const { startUpload } = useUploadThing("imageUploader");

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const maxFileSize = 32 * 1024 * 1024; // 32MB in bytes

    if (file) {
      if (file.size > maxFileSize) {
        setFormMessage(
          "File size exceeds the 32MB limit. Please upload a smaller file."
        );
        setEvidenceFile(null);
      } else {
        setFormMessage("");
        setEvidenceFile(file);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setIsUploading(true);
    e.preventDefault();

    let fileUrl: string | null = null;

    try {
      if (fileEvidence) {
        const uploadedFile = await startUpload([fileEvidence]);
        fileUrl = uploadedFile?.[0]?.url || null;
      }

      const { data: newRecord, error } = await supabase
        .from("sti_dgoms_case")
        .insert([
          {
            ...formData,
            newReport: "Pending",
            caseTracking: "Pending",
            sentBy: fullName,
            fileEvidence: fileUrl,
          },
        ]);

      if (error) {
        console.error("Error response from Supabase:", error);
        setFormMessage("Error submitting report. Please try again.");
      } else {
        console.log("Data inserted successfully:", newRecord);
        setFormMessage("Report Sent Successfully");
        setFormData({
          studentGrade: "",
          programCourse: "",
          studentYear: "",
          offenderName: "",
          studentSection: "",
          typeOfIncident: "",
          incidentDescription: "",
          fileEvidence: "",
        });
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      setFormMessage("Unexpected error. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {showTerms && (
        <Dialog
          title=""
          onClose={() => setShowTerms(false)}
          onOk={() => setShowTerms(false)}
          disableOk={!hasScrolledToBottom}
        >
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">Terms and Conditions</CardTitle>
              </div>
              <p className="text-sm text-muted-foreground">
                Please read carefully and accept our terms and conditions to
                submit a report
              </p>
            </CardHeader>
            <CardContent>
              <div
                className="h-[400px] overflow-y-auto pr-4"
                onScroll={handleScroll}
                ref={scrollRef}
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "#888 #f1f1f1",
                }}
              >
                <div className="space-y-4 text-sm">
                  <h3 className="font-semibold">1. Consent to Contact</h3>
                  <p>
                    You consent to being contacted by the STI College
                    Disciplinary Office for further information regarding the
                    report. This may include requests for additional details,
                    clarification, or follow-up actions.
                  </p>

                  <h3 className="font-semibold">
                    2. Parental or Guardian Contact
                  </h3>
                  <p>
                    You acknowledge that your parents or guardians may also be
                    contacted by the STI College Disciplinary Office if
                    necessary for additional clarification or support. This may
                    be the case if the reported incident involves a minor or if
                    their involvement is deemed necessary for the resolution of
                    the matter.
                  </p>

                  <h3 className="font-semibold">
                    3. False Information and Campus Offenses
                  </h3>
                  <p>
                    Providing false information in a guidance report is a
                    serious offense and may have severe consequences, including
                    disciplinary action and potential legal repercussions. All
                    information submitted through this system will be treated
                    with confidentiality, but may be shared with relevant
                    authorities if necessary for investigation or to ensure the
                    safety of the campus community.
                  </p>

                  <h3 className="font-semibold">4. Important Note</h3>
                  <p>
                    It is crucial to provide accurate and truthful information
                    in your guidance report. Any false information submitted may
                    have severe consequences for both the offender and the
                    reporter.
                  </p>

                  <h3 className="font-semibold">5. Agreement</h3>
                  <p>
                    By clicking "I Understand" and proceeding with the
                    submission of your report, you acknowledge that you have
                    read and understood these terms and conditions, including
                    the potential consequences of providing false information.
                    You also agree to comply with all applicable laws and
                    regulations related to the reporting of misconduct.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Dialog>
      )}
      <div className="flex items-center justify-center bg-gray-100">
        <div className="bg-sti-blue justify-center text-white rounded-t-lg p-6 w-[50em]">
          <h2 className="text-2xl font-bold text-center">
            Submit Incident Report
          </h2>
          <p className="text-center mt-2">
            Please fill out all required fields to submit your incident report
          </p>

          <form
            onSubmit={handleSubmit}
            className="bg-sti-blue text-white rounded-b-lg p-6 space-y-6 "
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="studentGrade"
                  className="block text-sm font-medium mb-1"
                >
                  Course
                </label>
                <select
                  id="studentGrade"
                  name="studentGrade"
                  value={formData.studentGrade}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md text-black"
                  required
                >
                  <option value="" disabled>
                    Select course
                  </option>
                  <option value="Tertiary">Tertiary</option>
                  <option value="Senior High">Senior High School</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="programCourse"
                  className="block text-sm font-medium mb-1"
                >
                  Program
                </label>
                <select
                  id="programCourse"
                  name="programCourse"
                  value={formData.programCourse}
                  onChange={handleInputChange}
                  className="w-full p-2 border text-black rounded-md"
                  required
                >
                  <option value="" disabled>
                    Select program
                  </option>
                  {formData.studentGrade === "Senior High" ? (
                    <>
                      <option value="ITMAWD">
                        IT in Mobile App and Web Development
                      </option>
                      <option value="HUMMS">
                        Humanities and Social Sciences (HUMSS)
                      </option>
                      <option value="ABM">
                        Accountancy, Business, and Management (ABM)
                      </option>
                      <option value="STEM">
                        Science, Technology, Engineering, and Mathematics (STEM)
                      </option>
                      <option value="GAS">General Academic Strand</option>
                      <option value="Digital Arts ">Digital Arts </option>
                      <option value="Tourism Operations ">
                        Tourism Operations
                      </option>
                      <option value="Culinary Arts ">Culinary Arts </option>
                    </>
                  ) : (
                    <>
                      <option value="BSIT">
                        BS Information Technology (BSIT)
                      </option>
                      <option value="BSCS">BS Computer Science (BSCS)</option>
                      <option value="BSHM">
                        BS Hospitality Management (BSHM)
                      </option>
                      <option value="BSTM">BS Tourism Management (BSTM)</option>
                      <option value="BSBA">
                        BS Business Administration (BSBA)
                      </option>
                      <option value="BSAIS">
                        BS Accounting information System (BSAIS)
                      </option>
                      <option value="BACOMM">
                        Bachelor of Arts in Communication (BACOMM)
                      </option>
                      <option value="BMMA">
                        Bachelor in Multimedia Arts (BMMA)
                      </option>
                      <option value="BSCpE">
                        BS Computer Engineering (BSCpE)
                      </option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label
                  htmlFor="studentYear"
                  className="block text-sm font-medium mb-1"
                >
                  Year
                </label>
                <select
                  id="studentYear"
                  name="studentYear"
                  value={formData.studentYear}
                  onChange={handleInputChange}
                  className="w-full p-2 border text-black rounded-md"
                  required
                >
                  <option value="" disabled>
                    Year
                  </option>
                  {formData.studentGrade === "Senior High" ? (
                    <>
                      <option value="4">Grade 11</option>
                      <option value="4">Grade 12</option>
                    </>
                  ) : (
                    <>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="offenderName"
                className="block text-sm font-medium mb-1"
              >
                Offender Name
              </label>
              <input
                type="text"
                id="offenderName"
                name="offenderName"
                value={formData.offenderName}
                onChange={handleInputChange}
                className="w-full p-2 border text-black rounded-md"
                required
                placeholder="Enter offender's name"
              />
            </div>

            <div>
              <label
                htmlFor="offenderName"
                className="block text-sm font-medium mb-1"
              >
                Section
              </label>
              <input
                type="text"
                id="studentSection"
                name="studentSection"
                value={formData.studentSection}
                onChange={handleInputChange}
                className="w-full p-2 border text-black rounded-md"
                required
                placeholder="Enter your section"
              />
            </div>

            <div>
              <label
                htmlFor="typeOfIncident"
                className="block text-sm font-medium mb-1"
              >
                Type of Incident
              </label>
              <input
                id="typeOfIncident"
                name="typeOfIncident"
                value={formData.typeOfIncident}
                onChange={handleInputChange}
                className="w-full p-2 border text-black rounded-md"
                placeholder="(e.g. Cheating, Bullying)"
                required
              ></input>
            </div>

            <div>
              <label
                htmlFor="incidentDescription"
                className="block text-sm font-medium mb-1"
              >
                Narrative report
              </label>
              <textarea
                id="incidentDescription"
                name="incidentDescription"
                placeholder="This is a free form to write your narrative report"
                value={formData.incidentDescription}
                rows={6}
                onChange={handleInputChange}
                className="w-full p-2 border text-black rounded-md"
                required
              ></textarea>
            </div>

            <div>
              <label
                htmlFor="evidence"
                className="block text-sm font-medium mb-1"
              >
                Add Evidence or Attachment
              </label>
              <Input
                type="file"
                id="fileEvidence"
                value={formData.fileEvidence}
                onChange={handleFileChange}
              />
              {fileEvidence ? (
                <>
                  <p className="text-sm text-sti-yellow-">
                    File selected: {fileEvidence.name}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm text-gray-900 mt-1">
                    Upload any supporting attachment limited to 32MB.
                  </p>
                </>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-sti-yellow text-black py-2 px-4 rounded-md hover:bg-sti-yellow/90 transition-colors"
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Submit Report"}
            </button>

            {formMessage && (
              <div
                className={`mt-4 p-4 rounded-md ${
                  formMessage.includes("Successfully")
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {formMessage}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
