import { z } from "zod";
import { defineTool, supabaseForUser, unauthenticated, toolError, textResult } from "../_shared";

export default defineTool({
  name: "create_contact_request",
  title: "Créer une demande de contact",
  description: "Envoie une demande de contact commerciale à Well Done Services au nom de l'utilisateur.",
  inputSchema: {
    name: z.string().trim().min(2).max(120),
    email: z.string().trim().email().max(200),
    message: z.string().trim().min(5).max(4000),
    company: z.string().trim().max(200).optional(),
    phone: z.string().trim().max(40).optional(),
    project_type: z.string().trim().max(100).optional(),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
  handler: async (input, ctx) => {
    if (!ctx.isAuthenticated()) return unauthenticated();
    const sb = supabaseForUser(ctx);
    const { data, error } = await sb
      .from("contacts")
      .insert({ ...input, source: "mcp" })
      .select("id,created_at")
      .single();
    if (error) return toolError(error.message);
    return textResult(`Demande enregistrée (id: ${data.id}). Notre équipe vous recontactera.`, { contact: data });
  },
});
