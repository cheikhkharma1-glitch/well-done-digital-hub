import { z } from "zod";
import { defineTool, supabaseForUser, unauthenticated, toolError, textResult } from "../_shared";

export default defineTool({
  name: "get_thread_messages",
  title: "Messages d'une conversation",
  description: "Retourne les messages (utilisateur et assistant) d'un fil de discussion IA appartenant à l'utilisateur.",
  inputSchema: {
    thread_id: z.string().uuid().describe("Identifiant du fil de discussion."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ thread_id }, ctx) => {
    if (!ctx.isAuthenticated()) return unauthenticated();
    const sb = supabaseForUser(ctx);
    const { data, error } = await sb
      .from("chat_messages")
      .select("id,role,content,created_at")
      .eq("thread_id", thread_id)
      .order("created_at", { ascending: true });
    if (error) return toolError(error.message);
    return textResult(JSON.stringify(data, null, 2), { messages: data });
  },
});
