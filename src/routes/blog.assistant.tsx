import { createFileRoute, Link, Outlet, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { Plus, MessageSquare, Trash2, LogIn, Bot } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import type { User } from "@supabase/supabase-js";

export const Route = createFileRoute("/blog/assistant")({
  head: () => ({
    meta: [
      { title: "Assistant IA — Cybersécurité & Développement | Well Done" },
      { name: "description", content: "Posez vos questions sur la cybersécurité, le développement web et mobile à notre assistant IA en temps réel." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AssistantLayout,
});

type Thread = { id: string; title: string; updated_at: string };

function AssistantLayout() {
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [threads, setThreads] = useState<Thread[]>([]);
  const navigate = useNavigate();
  const params = useParams({ strict: false }) as { threadId?: string };
  const activeId = params.threadId;

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoadingAuth(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const loadThreads = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("chat_threads")
      .select("id,title,updated_at")
      .order("updated_at", { ascending: false });
    setThreads(data ?? []);
  }, [user]);

  useEffect(() => { loadThreads(); }, [loadThreads]);

  const createThread = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("chat_threads")
      .insert({ user_id: user.id, title: "Nouvelle conversation" })
      .select("id,title,updated_at")
      .single();
    if (error || !data) return;
    setThreads((t) => [data, ...t]);
    navigate({ to: "/blog/assistant/$threadId", params: { threadId: data.id } });
  };

  const deleteThread = async (id: string) => {
    await supabase.from("chat_threads").delete().eq("id", id);
    setThreads((t) => t.filter((x) => x.id !== id));
    if (activeId === id) navigate({ to: "/blog/assistant" });
  };

  if (loadingAuth) {
    return (
      <SiteLayout>
        <div className="container mx-auto px-4 py-24 text-center text-muted-foreground">Chargement…</div>
      </SiteLayout>
    );
  }

  if (!user) {
    return (
      <SiteLayout>
        <section className="container mx-auto px-4 py-20 max-w-2xl text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[oklch(0.62_0.2_255)] to-[oklch(0.82_0.16_210)] mb-6 shadow-glow">
            <Bot className="h-8 w-8 text-white" />
          </div>
          <h1 className="font-display text-4xl lg:text-5xl font-bold mb-4">Assistant IA expert</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Cybersécurité, développement web & mobile — posez vos questions à notre IA en temps réel.
            <br />Connectez-vous pour sauvegarder vos conversations.
          </p>
          <div className="flex gap-3 justify-center">
            <Button asChild size="lg" className="bg-gradient-primary">
              <Link to="/auth"><LogIn className="mr-2 h-4 w-4" /> Connexion / Inscription</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/blog">← Retour au blog</Link>
            </Button>
          </div>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="container mx-auto px-4 py-8 lg:py-12">
        <div className="grid lg:grid-cols-[280px_1fr] gap-6 min-h-[70vh]">
          {/* Sidebar */}
          <aside className="rounded-2xl border border-border/60 bg-card/50 backdrop-blur p-4 flex flex-col gap-3 h-fit lg:sticky lg:top-24">
            <Button onClick={createThread} className="w-full bg-gradient-primary">
              <Plus className="h-4 w-4 mr-2" /> Nouvelle conversation
            </Button>
            <div className="flex flex-col gap-1 overflow-y-auto max-h-[60vh]">
              {threads.length === 0 && (
                <p className="text-xs text-muted-foreground px-2 py-4">Aucune conversation. Créez-en une pour commencer.</p>
              )}
              {threads.map((t) => (
                <div key={t.id} className={cn(
                  "group flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors",
                  activeId === t.id ? "bg-primary/10 text-primary" : "hover:bg-accent",
                )}>
                  <Link
                    to="/blog/assistant/$threadId"
                    params={{ threadId: t.id }}
                    className="flex items-center gap-2 flex-1 min-w-0"
                  >
                    <MessageSquare className="h-4 w-4 shrink-0" />
                    <span className="truncate">{t.title}</span>
                  </Link>
                  <button
                    onClick={() => deleteThread(t.id)}
                    className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition"
                    aria-label="Supprimer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </aside>
          {/* Chat area */}
          <div className="rounded-2xl border border-border/60 bg-card/30 backdrop-blur overflow-hidden">
            <Outlet />
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
