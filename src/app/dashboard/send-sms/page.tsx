"use client";

import React, { useState } from "react";

const SendSmsForm: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("/api/sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: phoneNumber, body: message }),
      });

      const data = await res.json();

      if (res.ok) {
        setResponse(`Success: ${data.message}`);
      } else {
        setResponse(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error sending SMS:", error);
      setResponse("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded shadow">
      <h1 className="text-xl font-bold mb-4">Send SMS</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="phoneNumber" className="block font-medium">
            Phone Number
          </label>
          <input
            id="phoneNumber"
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter phone number (e.g., +639XXXXXXXXX)"
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="message" className="block font-medium">
            Message
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your message"
            className="w-full px-3 py-2 border rounded"
            rows={4}
            required
          ></textarea>
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 text-white rounded ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Sending..." : "Send SMS"}
        </button>
      </form>
      {response && (
        <div
          className={`mt-4 p-2 rounded ${
            response.startsWith("Success")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {response}
        </div>
      )}
    </div>
  );
};

export default SendSmsForm;
