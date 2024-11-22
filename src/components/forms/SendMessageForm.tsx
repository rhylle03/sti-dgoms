"use client";

import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

interface SendMessageFormProps {
  onSubmit: (formData: FormData) => Promise<void>;
}

const SendMessageForm: React.FC<SendMessageFormProps> = ({ onSubmit }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    body: "",
  });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    await onSubmit(formData);

    if (formValues.phone) {
      const apiUrl =
        typeof window !== "undefined"
          ? `${window.location.origin}/api/sms`
          : "/api/sms";

      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: formValues.phone, body: formValues.body }),
      });

      const data = await res.json();

      if (res.ok) {
        console.log("SMS sent successfully");
      } else {
        console.error(`Error: ${data.error}`);
      }
    }

    setFormValues({ name: "", phone: "", email: "", subject: "", body: "" });

    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        className="w-full max-w-sm bg-white rounded-lg shadow-lg p-6"
        onSubmit={handleSubmit}
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Send Message
        </h2>

        <div className="mb-4">
          <Label
            className="block text-gray-600 font-medium mb-2"
            htmlFor="name"
          >
            Name
          </Label>
          <Input
            id="name"
            type="text"
            name="name"
            value={formValues.name}
            onChange={handleChange}
            placeholder="Enter your name"
            className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <Label
            className="block text-gray-600 font-medium mb-2"
            htmlFor="email"
          >
            Email
          </Label>
          <Input
            id="email"
            type="email"
            name="email"
            value={formValues.email}
            onChange={handleChange}
            placeholder="Enter recipient's email"
            className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <Label
            className="block text-gray-600 font-medium mb-2"
            htmlFor="email"
          >
            Phone
          </Label>
          <Input
            id="phone"
            type="phone"
            name="phone"
            value={formValues.phone}
            onChange={handleChange}
            placeholder="Enter phone number (e.g., +639XXXXXXXXX)"
            className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <Label
            className="block text-gray-600 font-medium mb-2"
            htmlFor="subject"
          >
            Subject
          </Label>
          <Input
            id="subject"
            type="text"
            name="subject"
            value={formValues.subject}
            onChange={handleChange}
            placeholder="Enter subject"
            className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <Label
            className="block text-gray-600 font-medium mb-2"
            htmlFor="body"
          >
            Message
          </Label>
          <textarea
            id="body"
            name="body"
            placeholder="Enter your message"
            value={formValues.body}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            rows={4}
            required
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-sti-blue text-white py-2 px-4 rounded-lg hover:bg-sti-yellow transition duration-300"
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Send Email"}
        </button>
      </form>
    </div>
  );
};

export default SendMessageForm;
