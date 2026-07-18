import { z } from "zod";
import { defineTool, supabaseForUser, unauthenticated, toolError, textResult } from "../_shared";

export default defineTool({
  name: "list_articles",
  title: "Lister les articles du blog",
  description: "Retourne les articles publiés du blog Well Done Services (titre, slug, résumé, date).",
  inputSchema: {
    limit: z.number().int().min(1).max(50).optional().describe("Nombre maximum d'articles (défaut 20)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit }, ctx) => {
    if (!ctx.isAuthenticated()) return unauthenticated();
    const sb = supabaseForUser(ctx);
    const { data, error } = await sb
      .from("articles")
      .select("id,title,slug,excerpt,published_at,category")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(limit ?? 20);
    if (error) return toolError(error.message);
    return textResult(JSON.stringify(data, null, 2), { articles: data });
  },
});
