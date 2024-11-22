import { NextResponse } from "next/server";
import twilio from "twilio";

const { TWILIO_SID, TWILIO_TOKEN } = process.env;

export async function POST(req: Request) {
  try {
    const { to, body } = await req.json();

    if (!to || !body) {
      return NextResponse.json(
        { error: "Recipient phone number and message body are required." },
        { status: 400 }
      );
    }

    const client = twilio(TWILIO_SID, TWILIO_TOKEN);

    const message = await client.messages.create({
      body,
      to,
      from: "+13185087010",
    });

    return NextResponse.json({ message: `Message sent!` }, { status: 200 });
  } catch (error) {
    console.error("Error sending SMS:", error);
    return NextResponse.json({ error: "Failed to send SMS." }, { status: 500 });
  }
}
