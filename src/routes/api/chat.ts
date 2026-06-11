import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

const SYSTEM_PROMPT = `Tu es l'assistant expert de Well Done Services Company, spécialisé en :
- Cybersécurité (audits, conformité, protection des données, RGPD, sensibilisation, incidents)
- Développement web (React, Next.js, TanStack, Node.js, architectures modernes, SEO technique)
- Développement mobile (React Native, Flutter, iOS, Android, PWA)

Réponds toujours en français, de manière claire, structurée et pédagogique.
Utilise du Markdown (titres, listes, code) quand utile.
Sois précis, à jour, et oriente vers les bonnes pratiques de l'industrie.
Si la question sort de ces sujets, indique-le poliment et propose un sujet pertinent.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { messages } = (await request.json()) as { messages: UIMessage[] };
          if (!Array.isArray(messages)) {
            return new Response("Messages requis", { status: 400 });
          }
          const key = process.env.LOVABLE_API_KEY;
          if (!key) return new Response("LOVABLE_API_KEY manquante", { status: 500 });

          const gateway = createLovableAiGatewayProvider(key);
          const result = streamText({
            model: gateway("google/gemini-3-flash-preview"),
            system: SYSTEM_PROMPT,
            messages: await convertToModelMessages(messages),
          });

          return result.toUIMessageStreamResponse({ originalMessages: messages });
        } catch (e) {
          const msg = e instanceof Error ? e.message : "Erreur inconnue";
          return new Response(msg, { status: 500 });
        }
      },
    },
  },
});
