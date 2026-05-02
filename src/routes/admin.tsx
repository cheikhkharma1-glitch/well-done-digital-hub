import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LayoutDashboard, FolderKanban, Newspaper, Inbox, LogOut, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Administration — Well Done Services" }, { name: "robots", content: "noindex" }] }),
  component: AdminLayout,
});

const links = [
  { to: "/admin", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
  { to: "/admin/projets", label: "Projets", icon: FolderKanban },
  { to: "/admin/articles", label: "Articles", icon: Newspaper },
  { to: "/admin/demandes", label: "Demandes", icon: Inbox },
] as const;

function AdminLayout() {
  const nav = useNavigate();
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState<string>("");
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) nav({ to: "/auth" });
    });
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { nav({ to: "/auth" }); return; }
      setEmail(session.user.email ?? "");
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", session.user.id);
      const admin = (roles ?? []).some((r) => r.role === "admin");
      setIsAdmin(admin);
      setChecking(false);
    })();
    return () => { sub.subscription.unsubscribe(); };
  }, [nav]);

  const logout = async () => {
    await supabase.auth.signOut();
    toast.success("Déconnecté");
    nav({ to: "/" });
  };

  if (checking) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Vérification…</div>;

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-lg text-center p-10 rounded-2xl bg-gradient-card border border-border">
          <h1 className="font-display text-2xl font-bold mb-3">Accès restreint</h1>
          <p className="text-muted-foreground mb-2">Compte connecté : <span className="font-medium">{email}</span></p>
          <p className="text-muted-foreground mb-6 text-sm">
            Vous n'avez pas le rôle administrateur. Pour activer votre accès, ajoutez votre rôle dans la table <code className="px-1.5 py-0.5 rounded bg-muted">user_roles</code> via le backend (rôle = <code className="px-1.5 py-0.5 rounded bg-muted">admin</code>).
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={logout}>Se déconnecter</Button>
            <Button asChild><Link to="/">Retour au site</Link></Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-surface">
      <aside className="hidden lg:flex w-64 flex-col bg-foreground text-background">
        <div className="p-6 border-b border-background/10">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-gradient-primary flex items-center justify-center font-display font-bold">W</div>
            <div>
              <div className="font-display font-bold text-sm">Well Done</div>
              <div className="text-[10px] opacity-60">Administration</div>
            </div>
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {links.map((l) => {
            const active = l.exact ? path === l.to : path.startsWith(l.to);
            return (
              <Link key={l.to} to={l.to} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-smooth ${active ? "bg-gradient-primary text-primary-foreground" : "hover:bg-background/10"}`}>
                <l.icon className="h-4 w-4" /> {l.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-background/10 space-y-1">
          <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-background/10">
            <ExternalLink className="h-4 w-4" /> Voir le site
          </Link>
          <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-background/10">
            <LogOut className="h-4 w-4" /> Déconnexion
          </button>
          <div className="px-3 pt-2 text-xs opacity-60 truncate">{email}</div>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden bg-foreground text-background p-4 flex items-center justify-between">
          <Link to="/admin" className="font-display font-bold">Admin WDS</Link>
          <button onClick={logout} className="text-sm">Déconnexion</button>
        </header>
        <nav className="lg:hidden flex overflow-x-auto bg-foreground text-background border-t border-background/10">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="px-4 py-3 text-xs whitespace-nowrap" activeProps={{ className: "text-primary-glow font-semibold" }}>
              {l.label}
            </Link>
          ))}
        </nav>
        <main className="flex-1 p-6 lg:p-10"><Outlet /></main>
      </div>
    </div>
  );
}
