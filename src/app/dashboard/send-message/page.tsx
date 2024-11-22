import SendMessageForm from "@/components/forms/SendMessageForm";
import { sendMail } from "@/lib/mail";
import React from "react";

export default function SendMessage() {
  const send = async (formData: FormData) => {
    "use server";
    const name = formData.get("name")?.toString() || "";
    const email = formData.get("email")?.toString() || "";
    const subject = formData.get("subject")?.toString() || "";
    const body = formData.get("body")?.toString() || "";

    await sendMail({
      to: email,
      name,
      subject,
      body: `<p>${body} <br/> <br/> <br/> - ${name} </p>`,
    });
  };

  return <SendMessageForm onSubmit={send} />;
}
