/* eslint-disable */
import { generateResponse } from "@/lib/services/species-chat";
import { NextResponse } from "next/server";

// TODO: Implement this file

type payloadBody = {
  message: string;
};
export async function POST(req: Request) {
  const { message } = (await req.json()) as payloadBody;

  if (!message.trim()) {
    return NextResponse.json({ error: "A message is required." }, { status: 400 });
  }
  const res = await generateResponse(message);

  return NextResponse.json({ res });
}
