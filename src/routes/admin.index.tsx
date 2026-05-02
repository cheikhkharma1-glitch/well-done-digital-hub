import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FolderKanban, Newspaper, Inbox, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const [counts, setCounts] = useState({ projects: 0, articles: 0, contacts: 0, newContacts: 0 });

  useEffect(() => {
    (async () => {
      const [p, a, c, nc] = await Promise.all([
        supabase.from("projects").select("id", { count: "exact", head: true }),
        supabase.from("articles").select("id", { count: "exact", head: true }),
        supabase.from("contacts").select("id", { count: "exact", head: true }),
        supabase.from("contacts").select("id", { count: "exact", head: true }).eq("status", "new"),
      ]);
      setCounts({
        projects: p.count ?? 0,
        articles: a.count ?? 0,
        contacts: c.count ?? 0,
        newContacts: nc.count ?? 0,
      });
    })();
  }, []);

  const cards = [
    { label: "Projets", value: counts.projects, icon: FolderKanban, to: "/admin/projets" },
    { label: "Articles", value: counts.articles, icon: Newspaper, to: "/admin/articles" },
    { label: "Demandes totales", value: counts.contacts, icon: Inbox, to: "/admin/demandes" },
    { label: "Demandes nouvelles", value: counts.newContacts, icon: TrendingUp, to: "/admin/demandes" },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-2">Tableau de bord</h1>
      <p className="text-muted-foreground mb-8">Vue d'ensemble de votre plateforme.</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((c) => (
          <Link key={c.label} to={c.to} className="p-6 rounded-2xl bg-card border border-border hover:shadow-elegant transition-smooth">
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 rounded-xl bg-gradient-primary text-primary-foreground flex items-center justify-center"><c.icon className="h-5 w-5" /></div>
            </div>
            <div className="font-display text-3xl font-bold">{c.value}</div>
            <div className="text-sm text-muted-foreground mt-1">{c.label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
