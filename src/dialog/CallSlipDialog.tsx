"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/utils/supabase/client";
import { Plus, X, Send } from "lucide-react";
import { getUser } from "@/utils/supabase/server";

export default function CallSlipDialog({ user_name }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    studentName: "",
    message: "",
  });
  const [searchResults, setSearchResults] = useState<string[]>([]);

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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[50em]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">
              Send Notification
            </DialogTitle>
          </div>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-8">
          <Input
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Title"
            required
          />
          <div className="relative">
            <Input
              name="studentName"
              value={formData.studentName}
              onChange={handleInputChange}
              className="w-[50em]"
              placeholder="Student Name"
              required
            />
            {searchResults.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                {searchResults.map((name) => (
                  <div
                    key={name}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => {
                      setFormData({ ...formData, studentName: name });
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
            className="w-full min-h-[100px] px-3 py-2 text-sm rounded-md border border-input bg-background ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          />
          <div className="flex justify-end ">
            <Button
              type="submit"
              className="bg-sti-blue text-white hover:bg-sti-yellow"
            >
              Send
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
