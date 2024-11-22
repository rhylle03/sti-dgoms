"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { supabase } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
export default function SetHearingCommitee({ user_name }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    studentName: "",
    message: "",
  });
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [isStartPopoverOpen, setIsStartPopoverOpen] = useState(false);
  const [isEndPopoverOpen, setIsEndPopoverOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
    setIsStartPopoverOpen(false);
  };

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date);
    setIsEndPopoverOpen(false);
  };

  const handleInputChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "studentName" && value.length > 2) {
      try {
        const { data } = await supabase
          .from("users")
          .select("firstName, lastName")
          .ilike("firstName", `%${value}%`);
        setSearchResults(
          data?.map((user) => `${user.firstName} ${user.lastName}`) || []
        );
      } catch (error) {
        console.error("Search error:", error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { title, studentName, message } = formData;

    try {
      const { error } = await supabase.from("notification").insert({
        title,
        studentName,
        message,
        sentBy: user_name,
      });
      if (error) throw error;
      setIsOpen(false);
      setFormData({ title: "", studentName: "", message: "" });
      setSearchResults([]);
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100"
      >
        <Plus className="h-4 w-4" />
        <span>Set Hearing</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">
            Set Hearing for Discipline Committee
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <input
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Title"
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="relative">
            <input
              name="studentName"
              value={formData.studentName}
              onChange={handleInputChange}
              placeholder="Discipline Committe Name"
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchResults.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                {searchResults.map((name) => (
                  <div
                    key={name}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, studentName: name }));
                      setSearchResults([]);
                    }}
                  >
                    {name}
                  </div>
                ))}
              </div>
            )}
          </div>

          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            placeholder="Message"
            required
            className="w-full min-h-[100px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
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

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
