import { z } from "zod";
import { defineTool, supabaseForUser, unauthenticated, toolError, textResult } from "../_shared";

export default defineTool({
  name: "get_article",
  title: "Lire un article",
  description: "Retourne le contenu complet d'un article de blog par son slug.",
  inputSchema: {
    slug: z.string().trim().min(1).describe("Slug de l'article (ex: cybersecurite-pme)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ slug }, ctx) => {
    if (!ctx.isAuthenticated()) return unauthenticated();
    const sb = supabaseForUser(ctx);
    const { data, error } = await sb
      .from("articles")
      .select("id,title,slug,excerpt,content,category,published_at")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();
    if (error) return toolError(error.message);
    if (!data) return toolError("Article introuvable.");
    return textResult(JSON.stringify(data, null, 2), { article: data });
  },
});
