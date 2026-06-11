import { createFileRoute, useParams } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Send, Bot, User as UserIcon, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/blog/assistant/$threadId")({
  component: ChatThread,
});

type DbMessage = { id: string; role: "user" | "assistant" | "system"; content: string };

function dbToUI(m: DbMessage): UIMessage {
  return {
    id: m.id,
    role: m.role,
    parts: [{ type: "text", text: m.content }],
  } as UIMessage;
}

function ChatThread() {
  const { threadId } = useParams({ from: "/blog/assistant/$threadId" });
  const [initial, setInitial] = useState<UIMessage[] | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const persistedIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (cancelled) return;
      setUserId(u.user?.id ?? null);
      const { data } = await supabase
        .from("chat_messages")
        .select("id,role,content")
        .eq("thread_id", threadId)
        .order("created_at", { ascending: true });
      if (cancelled) return;
      const msgs = (data ?? []) as DbMessage[];
      msgs.forEach((m) => persistedIds.current.add(m.id));
      setInitial(msgs.map(dbToUI));
    })();
    return () => { cancelled = true; };
  }, [threadId]);

  if (initial === null) {
    return <div className="h-full flex items-center justify-center text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin" /></div>;
  }

  return <ChatInner threadId={threadId} initialMessages={initial} userId={userId} input={input} setInput={setInput} endRef={endRef} inputRef={inputRef} persistedIds={persistedIds} />;
}

function ChatInner({
  threadId, initialMessages, userId, input, setInput, endRef, inputRef, persistedIds,
}: {
  threadId: string;
  initialMessages: UIMessage[];
  userId: string | null;
  input: string;
  setInput: (v: string) => void;
  endRef: React.RefObject<HTMLDivElement | null>;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
  persistedIds: React.MutableRefObject<Set<string>>;
}) {
  const { messages, sendMessage, status } = useChat({
    id: threadId,
    messages: initialMessages,
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, endRef]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [threadId, status, inputRef]);

  // Persist assistant messages once streaming finishes
  useEffect(() => {
    if (status !== "ready" || !userId) return;
    const last = messages[messages.length - 1];
    if (!last || last.role !== "assistant" || persistedIds.current.has(last.id)) return;
    const text = last.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
    if (!text.trim()) return;
    persistedIds.current.add(last.id);
    supabase.from("chat_messages").insert({
      thread_id: threadId,
      user_id: userId,
      role: "assistant",
      content: text,
    }).then(() => {
      supabase.from("chat_threads").update({ updated_at: new Date().toISOString() }).eq("id", threadId);
    });
  }, [status, messages, threadId, userId, persistedIds]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading || !userId) return;
    setInput("");
    // Persist user message + auto-title if first
    const { data: inserted } = await supabase.from("chat_messages").insert({
      thread_id: threadId, user_id: userId, role: "user", content: text,
    }).select("id").single();
    if (inserted) persistedIds.current.add(inserted.id);
    if (messages.length === 0) {
      const title = text.slice(0, 60);
      await supabase.from("chat_threads").update({ title }).eq("id", threadId);
    }
    sendMessage({ text });
  };

  return (
    <div className="flex flex-col h-[70vh]">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground py-12">
            <Bot className="h-10 w-10 mx-auto mb-3 text-primary" />
            <p className="text-sm">Posez votre première question sur la cybersécurité, le web ou le mobile.</p>
          </div>
        )}
        {messages.map((m) => {
          const text = m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
          const isUser = m.role === "user";
          return (
            <div key={m.id} className={cn("flex gap-3", isUser && "flex-row-reverse")}>
              <div className={cn(
                "h-8 w-8 rounded-lg flex items-center justify-center shrink-0",
                isUser ? "bg-primary text-primary-foreground" : "bg-gradient-to-br from-[oklch(0.62_0.2_255)] to-[oklch(0.82_0.16_210)] text-white",
              )}>
                {isUser ? <UserIcon className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>
              <div className={cn(
                "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap",
                isUser ? "bg-primary text-primary-foreground" : "bg-muted/60 border border-border/60",
              )}>
                {text || (status === "streaming" && !isUser ? <span className="inline-flex gap-1"><span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" /><span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse [animation-delay:0.2s]" /><span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse [animation-delay:0.4s]" /></span> : null)}
              </div>
            </div>
          );
        })}
        {status === "submitted" && (
          <div className="flex gap-3">
            <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-[oklch(0.62_0.2_255)] to-[oklch(0.82_0.16_210)] text-white">
              <Bot className="h-4 w-4" />
            </div>
            <div className="rounded-2xl px-4 py-3 bg-muted/60 border border-border/60 text-sm text-muted-foreground">
              Réflexion…
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>
      <form onSubmit={onSubmit} className="border-t border-border/60 p-4 flex gap-2 bg-background/50">
        <Textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSubmit(e as unknown as FormEvent);
            }
          }}
          placeholder="Posez votre question sur la cybersécurité, le développement web ou mobile…"
          rows={2}
          className="resize-none flex-1"
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading || !input.trim()} className="bg-gradient-primary self-end">
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </form>
    </div>
  );
}
