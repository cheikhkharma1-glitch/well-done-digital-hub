import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { User as UserIcon, Building2, Mail, Bell, Save, LogOut, MessageSquare } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export const Route = createFileRoute("/profil")({
  head: () => ({
    meta: [
      { title: "Mon profil — Well Done Services" },
      { name: "description", content: "Gérez votre nom, votre entreprise et vos préférences d'abonnement aux contenus IA." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ProfilPage,
});

type Profile = {
  id: string;
  full_name: string | null;
  company: string | null;
  ai_subscribed: boolean;
  preferences: Record<string, unknown> | null;
};

function ProfilPage() {
  const nav = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Subscription preference categories
  const [aiCyber, setAiCyber] = useState(true);
  const [aiWeb, setAiWeb] = useState(true);
  const [aiMobile, setAiMobile] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { nav({ to: "/auth" }); return; }
      setUser(data.user);
      const { data: p } = await supabase
        .from("profiles")
        .select("id,full_name,company,ai_subscribed,preferences")
        .eq("id", data.user.id)
        .maybeSingle();
      const prof = (p as Profile | null) ?? {
        id: data.user.id, full_name: "", company: "", ai_subscribed: false, preferences: {},
      };
      setProfile(prof);
      const prefs = (prof.preferences ?? {}) as Record<string, boolean>;
      setAiCyber(prefs.ai_cyber ?? true);
      setAiWeb(prefs.ai_web ?? true);
      setAiMobile(prefs.ai_mobile ?? false);
      setLoading(false);
    });
  }, [nav]);

  const onSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        full_name: profile.full_name,
        company: profile.company,
        ai_subscribed: profile.ai_subscribed,
        preferences: { ai_cyber: aiCyber, ai_web: aiWeb, ai_mobile: aiMobile },
      }, { onConflict: "id" });
    setSaving(false);
    if (error) { toast.error("Échec de l'enregistrement"); return; }
    toast.success("Profil mis à jour");
  };

  const onLogout = async () => {
    await supabase.auth.signOut();
    nav({ to: "/" });
  };

  if (loading) {
    return <SiteLayout><div className="container mx-auto px-4 py-32 text-center text-muted-foreground">Chargement…</div></SiteLayout>;
  }

  return (
    <SiteLayout>
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-cyber flex items-center justify-center shadow-cyber">
                <UserIcon className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="font-display text-3xl font-bold">Mon profil</h1>
                <p className="text-sm text-muted-foreground flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" />{user?.email}</p>
              </div>
            </div>
          </motion.div>

          <form onSubmit={onSave} className="p-8 rounded-2xl bg-gradient-card border border-border shadow-soft space-y-6">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <Label htmlFor="full_name" className="flex items-center gap-1.5"><UserIcon className="h-3.5 w-3.5" /> Nom complet</Label>
                <Input id="full_name" value={profile?.full_name ?? ""} onChange={(e) => setProfile((p) => p && { ...p, full_name: e.target.value })} maxLength={120} />
              </div>
              <div>
                <Label htmlFor="company" className="flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5" /> Entreprise</Label>
                <Input id="company" value={profile?.company ?? ""} onChange={(e) => setProfile((p) => p && { ...p, company: e.target.value })} maxLength={200} />
              </div>
            </div>

            <div className="pt-2 border-t border-border">
              <h2 className="font-display text-lg font-bold mb-1 flex items-center gap-2"><Bell className="h-4 w-4 text-primary" /> Préférences d'abonnement aux contenus IA</h2>
              <p className="text-sm text-muted-foreground mb-4">Recevez par email nos analyses IA, alertes et tutoriels sur les sujets qui vous intéressent.</p>

              <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-background/40">
                <div>
                  <p className="font-medium">M'abonner aux contenus IA</p>
                  <p className="text-xs text-muted-foreground">Newsletter mensuelle générée par notre assistant.</p>
                </div>
                <Switch checked={profile?.ai_subscribed ?? false} onCheckedChange={(v) => setProfile((p) => p && { ...p, ai_subscribed: v })} />
              </div>

              <div className={`mt-4 grid sm:grid-cols-3 gap-3 transition-opacity ${profile?.ai_subscribed ? "opacity-100" : "opacity-50 pointer-events-none"}`}>
                {[
                  { label: "Cybersécurité", val: aiCyber, set: setAiCyber },
                  { label: "Développement web", val: aiWeb, set: setAiWeb },
                  { label: "Développement mobile", val: aiMobile, set: setAiMobile },
                ].map((t) => (
                  <label key={t.label} className="flex items-center justify-between p-3 rounded-lg border border-border bg-background/40 cursor-pointer">
                    <span className="text-sm">{t.label}</span>
                    <Switch checked={t.val} onCheckedChange={t.set} />
                  </label>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button type="submit" disabled={saving} className="bg-gradient-cyber text-white shadow-cyber gap-2">
                <Save className="h-4 w-4" /> {saving ? "Enregistrement…" : "Enregistrer"}
              </Button>
              <Button asChild type="button" variant="outline" className="gap-2">
                <Link to="/blog/assistant"><MessageSquare className="h-4 w-4" /> Mon assistant IA</Link>
              </Button>
              <Button type="button" variant="ghost" onClick={onLogout} className="ml-auto gap-2 text-muted-foreground">
                <LogOut className="h-4 w-4" /> Déconnexion
              </Button>
            </div>
          </form>
        </div>
      </section>
    </SiteLayout>
  );
}
