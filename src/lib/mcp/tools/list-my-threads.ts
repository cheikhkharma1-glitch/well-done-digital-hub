import { defineTool, supabaseForUser, unauthenticated, toolError, textResult } from "../_shared";

export default defineTool({
  name: "list_my_threads",
  title: "Mes conversations IA",
  description: "Liste les fils de conversation avec l'assistant IA de l'utilisateur connecté.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    if (!ctx.isAuthenticated()) return unauthenticated();
    const sb = supabaseForUser(ctx);
    const { data, error } = await sb
      .from("chat_threads")
      .select("id,title,updated_at,created_at")
      .order("updated_at", { ascending: false });
    if (error) return toolError(error.message);
    return textResult(JSON.stringify(data, null, 2), { threads: data });
  },
});
