import { defineTool, supabaseForUser, unauthenticated, toolError, textResult } from "../_shared";

export default defineTool({
  name: "get_my_profile",
  title: "Mon profil",
  description: "Retourne le profil (nom, entreprise, préférences) de l'utilisateur connecté.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    if (!ctx.isAuthenticated()) return unauthenticated();
    const sb = supabaseForUser(ctx);
    const { data, error } = await sb
      .from("profiles")
      .select("id,full_name,company,ai_subscribed,preferences,updated_at")
      .eq("id", ctx.getUserId()!)
      .maybeSingle();
    if (error) return toolError(error.message);
    return textResult(JSON.stringify(data, null, 2), { profile: data });
  },
});
