"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Gavel } from "lucide-react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/utils/supabase/client";
import {
  minorOffenses,
  majorOffenses,
  minorOffenseSanctions,
  majorOffenseSanctions,
  OffenseCategory,
} from "@/app/utils/offenseLibrary";

interface TrackingRecordingDialogProps {
  caseId: string;
}

export default function TrackingRecordingDialog({
  caseId,
}: TrackingRecordingDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [offenseType, setOffenseType] = useState("DEFAULT");
  const [majorCategory, setMajorCategory] = useState("DEFAULT");
  const [offenseCategory, setOffenseCategory] = useState("DEFAULT");
  const [selectedOffense, setSelectedOffense] = useState("DEFAULT");
  const [offenseCount, setOffenseCount] = useState(1);
  const [offenderName, setOffenderName] = useState("");
  const [offenderSearchResults, setOffenderSearchResults] = useState<string[]>(
    []
  );
  const [selectedOffender, setSelectedOffender] = useState<string | null>(null);
  const [caseInput, setCaseInput] = useState("");
  const [currentSanction, setCurrentSanction] = useState("");

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      setOffenderName("");
      setOffenseType("DEFAULT");
      setMajorCategory("DEFAULT");
      setOffenseCategory("DEFAULT");
      setSelectedOffense("DEFAULT");
      setOffenseCount(1);
      setCurrentSanction("");
    } else {
      if (textareaRef.current) {
        textareaRef.current.value = "";
      }
      setErrorMessage("");
    }
  }, [isOpen]);

  useEffect(() => {
    setMajorCategory("DEFAULT");
    setOffenseCategory("DEFAULT");
    setSelectedOffense("DEFAULT");
    setCurrentSanction("");
  }, [offenseType]);

  useEffect(() => {
    setOffenseCategory("DEFAULT");
    setSelectedOffense("DEFAULT");
    updateSanction();
  }, [majorCategory]);

  useEffect(() => {
    setSelectedOffense("DEFAULT");
    updateSanction();
  }, [offenseCategory]);

  useEffect(() => {
    updateSanction();
  }, [selectedOffense, offenseCount]);

  const updateSanction = () => {
    if (offenseType === "Minor" && selectedOffense !== "DEFAULT") {
      const sanction =
        minorOffenseSanctions.find((s) => s.offense === offenseCount)
          ?.sanction || "";
      setCurrentSanction(sanction);
    } else if (offenseType === "Major" && majorCategory !== "DEFAULT") {
      const sanction =
        majorOffenseSanctions[
          majorCategory as keyof typeof majorOffenseSanctions
        ];
      setCurrentSanction(sanction);
    } else {
      setCurrentSanction("");
    }
  };

  const handleOffenderNameChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const name = e.target.value;
    setOffenderName(name);

    if (name.length > 2) {
      try {
        const { data: firstNameData, error: firstNameError } = await supabase
          .from("users")
          .select("firstName, lastName")
          .ilike("firstName", `%${name}%`);

        const { data: lastNameData, error: lastNameError } = await supabase
          .from("users")
          .select("firstName, lastName")
          .ilike("lastName", `%${name}%`);

        const allResults = [...(firstNameData || []), ...(lastNameData || [])];
        const uniqueResults = Array.from(
          new Set(
            allResults.map((item) => `${item.firstName} ${item.lastName}`)
          )
        );

        setOffenderSearchResults(uniqueResults.length ? uniqueResults : []);
      } catch (error) {
        console.error("Error during search:", error);
        setOffenderSearchResults([]);
      }
    } else {
      setOffenderSearchResults([]);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!textareaRef.current?.value) {
      setErrorMessage("Case description is required");
      return;
    }

    if (
      offenseType === "DEFAULT" ||
      (offenseType === "Major" && majorCategory === "DEFAULT") ||
      offenseCategory === "DEFAULT" ||
      selectedOffense === "DEFAULT"
    ) {
      setErrorMessage("Please select all required offense details");
      return;
    }

    let specificOffenseName = "";
    if (offenseType === "Minor") {
      specificOffenseName =
        minorOffenses[offenseCategory as keyof typeof minorOffenses]?.find(
          (o) => o.id.toString() === selectedOffense
        )?.name || "";
    } else if (offenseType === "Major") {
      specificOffenseName =
        majorOffenses[majorCategory as keyof typeof majorOffenses][
          offenseCategory as keyof OffenseCategory
        ]?.find((o) => o.id.toString() === selectedOffense)?.name || "";
    }

    const addata = {
      offenseType,
      majorCategory: offenseType === "Major" ? majorCategory : null,
      offenseCategory,
      specificOffense: specificOffenseName,
      offenseCount: offenseType === "Minor" ? offenseCount : null,
      caseReport: textareaRef.current.value,
      caseStatus: "Solved",
      hearingEnded: new Date(),
      offenderName: selectedOffender || offenderName,
      caseInput,
      caseSanction: currentSanction,
      caseActionStatus: "Case Decision",
      caseTracking: "Solved",
    };

    try {
      const { data: trackingRecordingAction, error: fetchError } =
        await supabase
          .from("sti_dgoms_case")
          .update(addata)
          .eq("id", caseId)
          .single();

      if (fetchError) throw fetchError;

      setIsOpen(false);

      router.push("/dashboard/tracking-and-recording");
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
        <Button size="icon" variant="outline" className="h-8 w-8 rounded-full ">
          <Gavel className="h-4 w-4 b" color="black" />
          <span className="sr-only">Open case decision</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-semibold">
            Disciplinary Action
          </DialogTitle>
          <DialogDescription className="text-center">
            Enter the case details and decision below
          </DialogDescription>
        </DialogHeader>
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="offenderName">
                    Student involve (Full Name)
                  </Label>
                  <div className="relative">
                    <Input
                      id="offenderName"
                      value={offenderName}
                      onChange={handleOffenderNameChange}
                      className="w-full"
                      required
                    />
                    {offenderSearchResults.length > 0 && (
                      <ul className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-md border bg-background shadow-lg">
                        {offenderSearchResults.map((offender) => (
                          <li
                            key={offender}
                            className="cursor-pointer px-4 py-2 hover:bg-accent"
                            onClick={() => {
                              setSelectedOffender(offender);
                              setOffenderName(offender);
                              setOffenderSearchResults([]);
                            }}
                          >
                            {offender}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="case">Case</Label>
                  <Input
                    id="case"
                    value={caseInput}
                    onChange={(e) => setCaseInput(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="offenseType">Type of Offense</Label>
                <Select value={offenseType} onValueChange={setOffenseType}>
                  <SelectTrigger id="offenseType">
                    <SelectValue placeholder="Select offense type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DEFAULT" disabled>
                      Select offense type
                    </SelectItem>
                    <SelectItem value="Minor">Minor</SelectItem>
                    <SelectItem value="Major">Major</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {offenseType === "Major" && (
                <div className="space-y-2">
                  <Label htmlFor="majorCategory">Major Offense Category</Label>
                  <Select
                    value={majorCategory}
                    onValueChange={setMajorCategory}
                  >
                    <SelectTrigger id="majorCategory">
                      <SelectValue placeholder="Select major offense category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DEFAULT" disabled>
                        Select major offense category
                      </SelectItem>
                      {Object.keys(majorOffenses).map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {(offenseType === "Minor" ||
                (offenseType === "Major" && majorCategory !== "DEFAULT")) && (
                <div className="space-y-2">
                  <Label htmlFor="offenseCategory">Offense Category</Label>
                  <Select
                    value={offenseCategory}
                    onValueChange={setOffenseCategory}
                  >
                    <SelectTrigger id="offenseCategory">
                      <SelectValue placeholder="Select offense category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DEFAULT" disabled>
                        Select offense category
                      </SelectItem>
                      {Object.keys(
                        offenseType === "Minor"
                          ? minorOffenses
                          : majorOffenses[
                              majorCategory as keyof typeof majorOffenses
                            ]
                      ).map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {offenseCategory !== "DEFAULT" && (
                <div className="space-y-2">
                  <Label htmlFor="specificOffense">Specific Offense</Label>
                  <Select
                    value={selectedOffense}
                    onValueChange={setSelectedOffense}
                  >
                    <SelectTrigger id="specificOffense">
                      <SelectValue placeholder="Select specific offense" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DEFAULT" disabled>
                        Select specific offense
                      </SelectItem>
                      {(offenseType === "Minor"
                        ? minorOffenses[
                            offenseCategory as keyof typeof minorOffenses
                          ]
                        : majorOffenses[
                            majorCategory as keyof typeof majorOffenses
                          ][offenseCategory as keyof OffenseCategory]
                      )?.map((offense) => (
                        <SelectItem
                          key={offense.id}
                          value={offense.id.toString()}
                        >
                          {offense.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {offenseType === "Minor" && (
                <div className="space-y-2">
                  <Label htmlFor="offenseCount">Offense Count</Label>
                  <Select
                    value={offenseCount.toString()}
                    onValueChange={(value) => setOffenseCount(parseInt(value))}
                  >
                    <SelectTrigger id="offenseCount">
                      <SelectValue placeholder="Select offense count" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">First Offense</SelectItem>
                      <SelectItem value="2">Second Offense</SelectItem>
                      <SelectItem value="3">Third Offense</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {currentSanction && (
                <div className="space-y-2">
                  <Label htmlFor="sanction">Sanction</Label>
                  <div
                    id="sanction"
                    className="p-2 bg-muted rounded-md text-sm"
                  >
                    {currentSanction}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="description">Case Description</Label>
                <textarea
                  id="description"
                  ref={textareaRef}
                  className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  required
                />
              </div>

              {errorMessage && (
                <div className="rounded-lg bg-destructive/15 p-3 text-center text-sm text-destructive">
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
