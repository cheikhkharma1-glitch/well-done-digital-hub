import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listArticles from "./tools/list-articles";
import getArticle from "./tools/get-article";
import listProjects from "./tools/list-projects";
import listMyThreads from "./tools/list-my-threads";
import getThreadMessages from "./tools/get-thread-messages";
import getMyProfile from "./tools/get-my-profile";
import createContactRequest from "./tools/create-contact-request";

// Direct Supabase issuer (never the .lovable.cloud proxy) — required by RFC 8414.
const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "well-done-services-mcp",
  title: "Well Done Services",
  version: "0.1.0",
  instructions:
    "Serveur MCP de Well Done Services Company. Permet à un utilisateur connecté d'explorer le blog (cybersécurité, dev web/mobile), les réalisations, ses conversations IA sauvegardées, son profil, et d'envoyer une demande de contact commerciale.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [
    listArticles,
    getArticle,
    listProjects,
    listMyThreads,
    getThreadMessages,
    getMyProfile,
    createContactRequest,
  ],
});
