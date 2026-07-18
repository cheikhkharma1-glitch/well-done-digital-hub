import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/site/SiteLayout";

type OAuthClient = { name?: string; client_uri?: string };
type AuthorizationDetails = {
  client?: OAuthClient;
  redirect_uri?: string;
  redirect_url?: string;
  redirect_to?: string;
  scope?: string;
};

// Local typed wrapper — the supabase.auth.oauth namespace is in beta.
type OAuthApi = {
  getAuthorizationDetails: (
    id: string,
  ) => Promise<{ data: AuthorizationDetails | null; error: { message: string } | null }>;
  approveAuthorization: (
    id: string,
  ) => Promise<{ data: AuthorizationDetails | null; error: { message: string } | null }>;
  denyAuthorization: (
    id: string,
  ) => Promise<{ data: AuthorizationDetails | null; error: { message: string } | null }>;
};

function oauth(): OAuthApi {
  return (supabase.auth as unknown as { oauth: OAuthApi }).oauth;
}

export const Route = createFileRoute("/.lovable/oauth/consent")({
  ssr: false,
  validateSearch: (s: Record<string, unknown>) => ({
    authorization_id: typeof s.authorization_id === "string" ? s.authorization_id : "",
  }),
  beforeLoad: async ({ search, location }) => {
    if (!search.authorization_id) throw new Error("Missing authorization_id");
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      const next = location.pathname + location.searchStr;
      throw redirect({ to: "/auth", search: { next } });
    }
  },
  loader: async ({ location }) => {
    const authorizationId = new URLSearchParams(location.search).get("authorization_id")!;
    const { data, error } = await oauth().getAuthorizationDetails(authorizationId);
    if (error) throw new Error(error.message);
    const immediate = data?.redirect_url ?? data?.redirect_to;
    if (immediate && !data?.client) throw redirect({ href: immediate });
    return data;
  },
  component: Consent,
  errorComponent: ({ error }) => (
    <SiteLayout>
      <main className="container mx-auto px-4 py-24 max-w-lg">
        <h1 className="font-display text-2xl font-bold mb-3">Autorisation impossible</h1>
        <p className="text-muted-foreground text-sm">{String((error as Error)?.message ?? error)}</p>
      </main>
    </SiteLayout>
  ),
});

function Consent() {
  const details = Route.useLoaderData();
  const { authorization_id } = Route.useSearch();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function decide(approve: boolean) {
    setBusy(true);
    setError(null);
    const { data, error } = approve
      ? await oauth().approveAuthorization(authorization_id)
      : await oauth().denyAuthorization(authorization_id);
    if (error) {
      setBusy(false);
      setError(error.message);
      return;
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(false);
      setError("Aucune URL de redirection retournée par le serveur d'autorisation.");
      return;
    }
    window.location.href = target;
  }

  const clientName = details?.client?.name ?? "Une application externe";

  return (
    <SiteLayout>
      <main className="container mx-auto px-4 py-16 max-w-xl">
        <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur p-8 shadow-soft">
          <h1 className="font-display text-2xl font-bold mb-2">Connecter {clientName}</h1>
          <p className="text-sm text-muted-foreground mb-6">
            {clientName} pourra utiliser cette application <strong>en votre nom</strong> via ses outils MCP
            (lecture du blog, des réalisations, de vos conversations IA, de votre profil et envoi de demandes de contact).
            Cela ne contourne pas les règles de sécurité de l'application.
          </p>
          {details?.scope && (
            <p className="text-xs text-muted-foreground mb-6 font-mono break-all">
              Portées demandées : {details.scope}
            </p>
          )}
          {error && (
            <p role="alert" className="text-sm text-destructive mb-4">
              {error}
            </p>
          )}
          <div className="flex gap-3">
            <Button
              type="button"
              disabled={busy}
              onClick={() => decide(true)}
              className="flex-1 bg-gradient-primary"
            >
              {busy ? "…" : "Autoriser"}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={busy}
              onClick={() => decide(false)}
              className="flex-1"
            >
              Refuser
            </Button>
          </div>
        </div>
      </main>
    </SiteLayout>
  );
}
