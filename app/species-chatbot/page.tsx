//Separated server and client components so that server can fetch existing chatlogs of a user before passing it to the client-side chatbot
import { createServerSupabaseClient } from "@/lib/server-utils";

import { redirect } from "next/navigation";
import SpeciesChatbot from "./chatbot";

export default async function SpeciesChatBotLandingPage() {
  const supabase = createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/");
  }

  const sessionId = session.user.id;

  const { data: chatlog } = await supabase.from("chatlogs").select("chat").eq("userid", sessionId).maybeSingle();

  interface ChatMessage {
    role: "user" | "bot";
    content: string;
  }

  return <SpeciesChatbot userId={sessionId} existingChatLog={(chatlog?.chat as ChatMessage[]) ?? []}></SpeciesChatbot>;
}
