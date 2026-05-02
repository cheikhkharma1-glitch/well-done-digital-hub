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

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Connexion — Espace administration" }, { name: "robots", content: "noindex" }] }),
  component: AuthPage,
});

const emailSchema = z.string().trim().email().max(200);
const pwdSchema = z.string().min(8, "8 caractères minimum").max(72);

function AuthPage() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) nav({ to: "/admin" });
    });
  }, [nav]);

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
    nav({ to: "/admin" });
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
      options: { emailRedirectTo: `${window.location.origin}/admin`, data: { full_name: fullName } },
    });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Compte créé. Connectez-vous.");
  };

  return (
    <SiteLayout>
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 max-w-md">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold mb-2">Espace administration</h1>
            <p className="text-muted-foreground text-sm">Réservé à l'équipe Well Done Services.</p>
          </div>
          <div className="p-8 rounded-2xl bg-gradient-card border border-border shadow-soft">
            <Tabs defaultValue="login">
              <TabsList className="w-full grid grid-cols-2 mb-6">
                <TabsTrigger value="login">Connexion</TabsTrigger>
                <TabsTrigger value="signup">Créer un compte</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <form onSubmit={onLogin} className="space-y-4">
                  <div><Label htmlFor="le">Email</Label><Input id="le" name="email" type="email" required /></div>
                  <div><Label htmlFor="lp">Mot de passe</Label><Input id="lp" name="password" type="password" required /></div>
                  <Button type="submit" disabled={loading} className="w-full bg-gradient-primary">{loading ? "…" : "Se connecter"}</Button>
                </form>
              </TabsContent>
              <TabsContent value="signup">
                <form onSubmit={onSignup} className="space-y-4">
                  <div><Label htmlFor="sn">Nom complet</Label><Input id="sn" name="full_name" required /></div>
                  <div><Label htmlFor="se">Email</Label><Input id="se" name="email" type="email" required /></div>
                  <div><Label htmlFor="sp">Mot de passe (8+ car.)</Label><Input id="sp" name="password" type="password" required /></div>
                  <Button type="submit" disabled={loading} className="w-full bg-gradient-primary">{loading ? "…" : "Créer mon compte"}</Button>
                  <p className="text-xs text-muted-foreground">L'accès admin doit être attribué par un administrateur existant.</p>
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
