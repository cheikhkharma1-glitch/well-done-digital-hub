import { z } from "zod";
import { defineTool, supabaseForUser, unauthenticated, toolError, textResult } from "../_shared";

export default defineTool({
  name: "list_projects",
  title: "Lister les réalisations",
  description: "Retourne les projets/réalisations publiés (portefeuille Well Done Services).",
  inputSchema: {
    category: z.string().optional().describe("Filtrer par catégorie (ex: Cybersécurité, Web, Mobile)."),
    limit: z.number().int().min(1).max(50).optional(),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ category, limit }, ctx) => {
    if (!ctx.isAuthenticated()) return unauthenticated();
    const sb = supabaseForUser(ctx);
    let q = sb
      .from("projects")
      .select("id,title,slug,description,category,client_name,technologies,image_url")
      .eq("published", true)
      .order("display_order", { ascending: true })
      .limit(limit ?? 20);
    if (category) q = q.eq("category", category);
    const { data, error } = await q;
    if (error) return toolError(error.message);
    return textResult(JSON.stringify(data, null, 2), { projects: data });
  },
});
