import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { Mail, Phone, MapPin, MessageCircle, Send, CheckCircle2 } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & devis — Well Done Services Company" },
      { name: "description", content: "Demandez votre devis gratuit. Réponse sous 48h. Nos experts IT à Dakar à votre écoute." },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(2, "Nom trop court").max(120),
  email: z.string().trim().email("Email invalide").max(200),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  company: z.string().trim().max(200).optional().or(z.literal("")),
  project_type: z.string().max(100).optional().or(z.literal("")),
  message: z.string().trim().min(5, "Message trop court").max(4000),
});

const types = ["Site web", "E-commerce", "ERP / CRM", "Gestion scolaire", "Maintenance & réseau", "Autre"];

function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", project_type: "", message: "" });

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Formulaire invalide");
      return;
    }
    setLoading(true);
    const payload = {
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      company: parsed.data.company || null,
      project_type: parsed.data.project_type || null,
      message: parsed.data.message,
    };
    const { error } = await supabase.from("contacts").insert(payload);
    setLoading(false);
    if (error) {
      toast.error("Erreur lors de l'envoi. Réessayez.");
      return;
    }
    setSubmitted(true);
    toast.success("Message envoyé !");
  };

  const waText = encodeURIComponent("Bonjour Well Done Services, je souhaite discuter d'un projet.");

  return (
    <SiteLayout>
      <section className="py-20 lg:py-28 bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 lg:px-8">
          <p className="text-sm font-semibold text-primary-glow uppercase tracking-wider mb-3">Contact</p>
          <h1 className="font-display text-4xl lg:text-6xl font-extrabold mb-5 max-w-3xl">Parlons de votre projet.</h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl">Nous vous répondons sous 48h avec une proposition personnalisée. Aucun engagement.</p>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8 grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-1 space-y-6">
            <div className="p-6 rounded-2xl bg-gradient-card border border-border">
              <h3 className="font-display font-bold mb-4">Nos coordonnées</h3>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3"><MapPin className="h-5 w-5 text-primary-glow shrink-0 mt-0.5" /> Dakar, Sénégal</li>
                <li className="flex items-start gap-3"><Mail className="h-5 w-5 text-primary-glow shrink-0 mt-0.5" /> contact@welldonescompany.com</li>
                <li className="flex items-start gap-3"><Phone className="h-5 w-5 text-primary-glow shrink-0 mt-0.5" /> +221 00 000 00 00</li>
              </ul>
            </div>
            <a
              href={`https://wa.me/221000000000?text=${waText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-6 rounded-2xl bg-gradient-primary text-primary-foreground hover:shadow-glow transition-smooth"
            >
              <MessageCircle className="h-8 w-8 mb-3" />
              <h3 className="font-display font-bold mb-1">WhatsApp direct</h3>
              <p className="text-sm opacity-90">Échangez avec un expert en quelques secondes.</p>
            </a>
          </div>

          <div className="lg:col-span-2">
            {submitted ? (
              <div className="p-12 rounded-2xl bg-gradient-card border border-border text-center">
                <CheckCircle2 className="h-16 w-16 text-primary-glow mx-auto mb-5" />
                <h2 className="font-display text-2xl font-bold mb-3">Merci pour votre message !</h2>
                <p className="text-muted-foreground mb-6">Notre équipe vous contactera sous 48h.</p>
                <Button onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", company: "", project_type: "", message: "" }); }}>
                  Envoyer un autre message
                </Button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="p-8 lg:p-10 rounded-2xl bg-gradient-card border border-border shadow-soft space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <Label htmlFor="name">Nom complet *</Label>
                    <Input id="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} maxLength={120} />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} maxLength={200} />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} maxLength={40} />
                  </div>
                  <div>
                    <Label htmlFor="company">Entreprise</Label>
                    <Input id="company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} maxLength={200} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="project_type">Type de projet</Label>
                  <Select value={form.project_type} onValueChange={(v) => setForm({ ...form, project_type: v })}>
                    <SelectTrigger id="project_type"><SelectValue placeholder="Sélectionnez…" /></SelectTrigger>
                    <SelectContent>
                      {types.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea id="message" required rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} maxLength={4000} placeholder="Décrivez votre besoin, vos objectifs, votre budget approximatif…" />
                </div>
                <Button type="submit" size="lg" disabled={loading} className="bg-gradient-primary w-full sm:w-auto">
                  {loading ? "Envoi en cours…" : <>Envoyer ma demande <Send className="ml-2 h-4 w-4" /></>}
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
