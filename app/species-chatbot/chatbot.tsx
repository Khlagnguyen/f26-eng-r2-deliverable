"use client";

/* eslint-disable */
"use client";
import { TypographyH2, TypographyP } from "@/components/ui/typography";
import { createBrowserSupabaseClient } from "@/lib/client-utils";
import { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

export default function SpeciesChatbot({
  userId,
  existingChatLog,
}: {
  userId: string;
  existingChatLog: { role: "user" | "bot"; content: string }[];
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [message, setMessage] = useState<string>("");
  const [chatLog, setChatLog] = useState(existingChatLog);
  const [inputDisable, setInputDisable] = useState<boolean>(false);

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const handleSubmit = async () => {
    const supabase = createBrowserSupabaseClient();

    type payloadBody = {
      res: string;
    };

    if (!message.trim()) return; //Check if message is empty

    //Create local array because at the end React state chatLog is the value from when handleSubmit started
    let localChatLog = [...chatLog, { role: "user" as const, content: message }, { role: "bot" as const, content: "" }];

    setChatLog(localChatLog);

    const input = message.trim();
    setMessage("");
    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({
        message: input,
      }),
    });
    console.log("Response:", res);

    //Animate response like that of ChatGPT
    const data = (await res.json()) as payloadBody;
    let totalTime = 2000;
    const totalUpdates = totalTime / 10;
    const plainData = data.res;
    const charPerUpdate = Math.ceil(plainData.length / totalUpdates);
    let animatedString = "";

    for (let i = 0; i < plainData.length; i += charPerUpdate) {
      animatedString += plainData.slice(i, i + charPerUpdate);
      localChatLog = [...localChatLog.slice(0, -1), { role: "bot", content: animatedString }];

      setChatLog(localChatLog);
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
    setInputDisable(false);
    //Upsert user's chatlog history
    const { error } = await supabase.from("chatlogs").upsert({ chat: localChatLog, userid: userId });
    if (error) {
      console.log(error);
    }
  };

  const handleClear = async () => {
    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase.from("chatlogs").delete().eq("userid", userId);
    if (error) {
      console.log(error);
    }
  };
  return (
    <>
      <TypographyH2>Species Chatbot</TypographyH2>
      <div className="mt-4 flex gap-4">
        <div className="mt-4 rounded-lg bg-foreground p-4 text-background">
          <TypographyP>
            To use the Species Chatbot, simply type your question in the input field below and hit enter. The chatbot
            will respond with the best available information.
          </TypographyP>
        </div>
      </div>
      {/* Chat UI, ChatBot to be implemented */}
      <div className="mx-auto mt-6">
        {/* Chat history */}
        <div className="h-[400px] space-y-3 overflow-y-auto rounded-lg border border-border bg-muted p-4">
          {chatLog.length === 0 ? (
            <p className="text-sm text-muted-foreground">Start chatting about a species!</p>
          ) : (
            chatLog.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] whitespace-pre-wrap rounded-2xl p-3 text-sm ${
                    msg.role === "user"
                      ? "rounded-br-none bg-primary text-primary-foreground"
                      : "rounded-bl-none border border-border bg-foreground text-primary-foreground"
                  }`}
                >
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            ))
          )}
        </div>
        {/* Textarea and submission */}
        <div className="mt-4 flex flex-col items-end">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onInput={handleInput}
            rows={1}
            placeholder="Ask about a species..."
            className="w-full resize-none overflow-hidden rounded border border-border bg-background p-2 text-sm text-foreground focus:outline-none"
          />
          <div className="flex gap-3">
            <button
              type="button"
              // Prevent users from messing up chatbot by entering during response generation
              onClick={() => {
                if (!inputDisable) {
                  setInputDisable(true);
                  void handleSubmit();
                }
              }}
              className="mt-2 rounded bg-primary px-4 py-2 text-background transition hover:opacity-90"
            >
              Enter
            </button>
            <button
              type="button"
              onClick={() => {
                setChatLog([]);
                void handleClear();
              }}
              className="mt-2 rounded bg-primary px-4 py-2 text-background transition hover:opacity-90"
            >
              Clear Chat
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
