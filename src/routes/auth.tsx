import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { z } from "zod";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Connexion & inscription — Well Done Services" },
      { name: "description", content: "Créez votre compte ou connectez-vous pour accéder à votre espace personnel et à l'assistant IA." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

const emailSchema = z.string().trim().email().max(200);
const pwdSchema = z.string().min(8, "8 caractères minimum").max(72);

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.4-1.6 4-5.5 4-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3.5 14.6 2.5 12 2.5 6.8 2.5 2.6 6.7 2.6 12s4.2 9.5 9.4 9.5c5.4 0 9-3.8 9-9.2 0-.6-.1-1.1-.2-1.6H12z"/>
    </svg>
  );
}

function AuthPage() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) nav({ to: "/profil" });
    });
  }, [nav]);

  const onGoogle = async () => {
    setGoogleLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/profil" });
    if (result.error) {
      setGoogleLoading(false);
      toast.error("Connexion Google impossible");
      return;
    }
    if (result.redirected) return; // navigating away
    setGoogleLoading(false);
    nav({ to: "/profil" });
  };

  const onLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = emailSchema.safeParse(fd.get("email"));
    const pwd = pwdSchema.safeParse(fd.get("password"));
    if (!email.success || !pwd.success) { toast.error("Identifiants invalides"); return; }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.data, password: pwd.data });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Connexion réussie");
    nav({ to: "/profil" });
  };

  const onSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = emailSchema.safeParse(fd.get("email"));
    const pwd = pwdSchema.safeParse(fd.get("password"));
    const fullName = String(fd.get("full_name") ?? "").trim();
    if (!email.success || !pwd.success) { toast.error("Données invalides"); return; }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: email.data,
      password: pwd.data,
      options: { emailRedirectTo: `${window.location.origin}/profil`, data: { full_name: fullName } },
    });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Compte créé. Vérifiez votre email puis connectez-vous.");
  };

  const GoogleButton = (
    <Button type="button" variant="outline" onClick={onGoogle} disabled={googleLoading} className="w-full gap-2">
      <GoogleIcon />
      {googleLoading ? "…" : "Continuer avec Google"}
    </Button>
  );

  const Separator = (
    <div className="relative my-5 flex items-center">
      <span className="flex-1 h-px bg-border" />
      <span className="px-3 text-xs uppercase tracking-wider text-muted-foreground">ou</span>
      <span className="flex-1 h-px bg-border" />
    </div>
  );

  return (
    <SiteLayout>
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 max-w-md">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold mb-2">Bienvenue</h1>
            <p className="text-muted-foreground text-sm">Connectez-vous ou créez votre compte.</p>
          </div>
          <div className="p-8 rounded-2xl bg-gradient-card border border-border shadow-soft">
            <Tabs defaultValue="login">
              <TabsList className="w-full grid grid-cols-2 mb-6">
                <TabsTrigger value="login">Connexion</TabsTrigger>
                <TabsTrigger value="signup">Inscription</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                {GoogleButton}
                {Separator}
                <form onSubmit={onLogin} className="space-y-4">
                  <div><Label htmlFor="le">Email</Label><Input id="le" name="email" type="email" required /></div>
                  <div><Label htmlFor="lp">Mot de passe</Label><Input id="lp" name="password" type="password" required /></div>
                  <Button type="submit" disabled={loading} className="w-full bg-gradient-primary">{loading ? "…" : "Se connecter"}</Button>
                </form>
              </TabsContent>
              <TabsContent value="signup">
                {GoogleButton}
                {Separator}
                <form onSubmit={onSignup} className="space-y-4">
                  <div><Label htmlFor="sn">Nom complet</Label><Input id="sn" name="full_name" required /></div>
                  <div><Label htmlFor="se">Email</Label><Input id="se" name="email" type="email" required /></div>
                  <div><Label htmlFor="sp">Mot de passe (8+ car.)</Label><Input id="sp" name="password" type="password" required /></div>
                  <Button type="submit" disabled={loading} className="w-full bg-gradient-primary">{loading ? "…" : "Créer mon compte"}</Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>
          <div className="text-center mt-6">
            <Link to="/" className="text-sm text-muted-foreground hover:text-primary">← Retour au site</Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
