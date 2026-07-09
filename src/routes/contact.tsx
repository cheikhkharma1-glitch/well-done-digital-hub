import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Mail, Phone, MapPin, MessageCircle, Send, CheckCircle2, Sparkles, Zap, ShieldCheck, Clock } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const searchSchema = z.object({
  source: z.string().max(60).optional(),
});

export const Route = createFileRoute("/contact")({
  validateSearch: (s) => searchSchema.parse(s),
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
  message: z.string().trim().min(20, "Message trop court (20 caractères min.)").max(4000),
});

// 🔧 Mettez à jour ce numéro WhatsApp au format international sans "+" (ex: 221771234567)
const WHATSAPP_NUMBER = "221000000000";

const types = ["Site web", "E-commerce", "ERP / CRM", "Gestion scolaire", "Maintenance & réseau", "Autre"];
const perks = [
  { icon: Clock, label: "Réponse sous 48h" },
  { icon: ShieldCheck, label: "Données sécurisées" },
  { icon: Zap, label: "Devis gratuit" },
];

const CONTACT_EMAIL = "contact@welldonescompany.com";

function ContactPage() {
  const search = Route.useSearch();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", project_type: "", message: "" });
  const [waHref, setWaHref] = useState<string>("");
  const [mailHref, setMailHref] = useState<string>("");
  const prefersReduced = useReducedMotion();

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : 24 },
    visible: (i: number = 0) => ({
      opacity: 1, y: 0,
      transition: { duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
    }),
  };
  const stagger: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } };

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
      source: search.source ?? "contact-form",
    };
    const { error } = await supabase.from("contacts").insert(payload);
    setLoading(false);
    if (error) {
      toast.error("Erreur lors de l'envoi. Réessayez.");
      return;
    }
    setLoading(false);
    if (error) {
      toast.error("Erreur lors de l'envoi. Réessayez.");
      return;
    }

    // Forward qualified lead to WhatsApp (opens in new tab)
    const waMsg = [
      "🆕 Nouvelle demande Well Done Services",
      `👤 ${parsed.data.name}`,
      `✉️ ${parsed.data.email}`,
      parsed.data.phone ? `📞 ${parsed.data.phone}` : null,
      parsed.data.company ? `🏢 ${parsed.data.company}` : null,
      parsed.data.project_type ? `📌 ${parsed.data.project_type}` : null,
      "",
      parsed.data.message,
    ].filter(Boolean).join("\n");
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMsg)}`, "_blank", "noopener");

    setSubmitted(true);
    toast.success("Message envoyé ! WhatsApp ouvert pour confirmation.");
  };

  const waText = encodeURIComponent("Bonjour Well Done Services, je souhaite discuter d'un projet.");

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-hero text-primary-foreground">
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full blur-3xl"
          style={{ background: "var(--gradient-cyber)", opacity: 0.35 }}
          animate={prefersReduced ? undefined : { x: [0, 60, 0], y: [0, 40, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -bottom-40 -right-32 h-[28rem] w-[28rem] rounded-full bg-[oklch(0.82_0.16_210)]/25 blur-3xl"
          animate={prefersReduced ? undefined : { x: [0, -50, 0], y: [0, -30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <div aria-hidden className="absolute inset-0 bg-grid-cyber opacity-30" />

        <div className="relative container mx-auto px-4 lg:px-8 py-24 lg:py-32">
          <motion.div variants={stagger} initial="hidden" animate="visible" className="max-w-3xl">
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-[oklch(0.82_0.16_210)]/40 backdrop-blur-sm mb-6"
            >
              <Sparkles className="h-3.5 w-3.5 text-[oklch(0.82_0.16_210)]" />
              <span className="text-xs font-bold uppercase tracking-widest text-white/90">Contactez-nous</span>
            </motion.div>
            <motion.h1 variants={fadeUp} className="font-display text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] mb-5">
              Parlons de <span className="text-cyber">votre projet</span>.
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg lg:text-xl text-white/80 max-w-2xl leading-relaxed mb-8">
              Réponse personnalisée sous 48h. Aucun engagement. Échangeons sur vos enjeux digitaux.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
              {perks.map((p) => (
                <span key={p.label} className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 backdrop-blur px-4 py-2 text-sm">
                  <p.icon className="h-4 w-4 text-[oklch(0.82_0.16_210)]" />
                  {p.label}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FORM + INFOS */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8 grid lg:grid-cols-3 gap-10">
          <motion.aside
            initial={{ opacity: 0, x: prefersReduced ? 0 : -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-1 space-y-6"
          >
            <div className="relative p-6 rounded-2xl bg-gradient-card border border-border overflow-hidden group hover:border-[oklch(0.62_0.2_255)]/40 transition-colors">
              <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-[oklch(0.82_0.16_210)]/15 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <h3 className="font-display font-bold mb-4 relative">Nos coordonnées</h3>
              <ul className="space-y-4 text-sm relative">
                {[
                  { icon: MapPin, text: "Dakar, Sénégal" },
                  { icon: Mail, text: "contact@welldonescompany.com" },
                  { icon: Phone, text: "+221 00 000 00 00" },
                ].map((item) => (
                  <li key={item.text} className="flex items-start gap-3 group/item">
                    <span className="h-9 w-9 rounded-lg bg-[oklch(0.82_0.16_210)]/15 text-[oklch(0.62_0.2_255)] flex items-center justify-center shrink-0 group-hover/item:bg-gradient-cyber group-hover/item:text-white transition-all duration-300">
                      <item.icon className="h-4 w-4" />
                    </span>
                    <span className="pt-1.5">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <motion.a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={prefersReduced ? undefined : { y: -4 }}
              transition={{ type: "spring", stiffness: 220, damping: 22 }}
              className="relative block p-6 rounded-2xl bg-gradient-cyber text-white overflow-hidden shadow-cyber group"
            >
              <motion.div
                aria-hidden
                className="absolute inset-0 bg-white/10"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.8 }}
              />
              <MessageCircle className="h-8 w-8 mb-3 relative" />
              <h3 className="font-display font-bold mb-1 relative">WhatsApp direct</h3>
              <p className="text-sm opacity-90 relative">Échangez avec un expert en quelques secondes.</p>
            </motion.a>
          </motion.aside>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-2"
          >
            {submitted ? (
              <div className="relative p-12 rounded-2xl bg-gradient-card border border-border text-center overflow-hidden">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="inline-flex h-20 w-20 rounded-full bg-gradient-cyber items-center justify-center mx-auto mb-5 shadow-cyber"
                >
                  <CheckCircle2 className="h-10 w-10 text-white" strokeWidth={2.5} />
                </motion.div>
                <h2 className="font-display text-2xl font-bold mb-3">Merci pour votre message !</h2>
                <p className="text-muted-foreground mb-6">Notre équipe vous contactera sous 48h.</p>
                <Button onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", company: "", project_type: "", message: "" }); }}>
                  Envoyer un autre message
                </Button>
              </div>
            ) : (
              <form
                onSubmit={onSubmit}
                className="relative p-8 lg:p-10 rounded-2xl bg-gradient-card border border-border shadow-soft space-y-5 overflow-hidden"
              >
                <div aria-hidden className="absolute top-0 left-0 right-0 h-1 bg-gradient-cyber" />
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <Label htmlFor="name">Nom complet *</Label>
                    <Input id="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} maxLength={120} className="focus-visible:ring-[oklch(0.62_0.2_255)]" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} maxLength={200} className="focus-visible:ring-[oklch(0.62_0.2_255)]" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} maxLength={40} className="focus-visible:ring-[oklch(0.62_0.2_255)]" />
                  </div>
                  <div>
                    <Label htmlFor="company">Entreprise</Label>
                    <Input id="company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} maxLength={200} className="focus-visible:ring-[oklch(0.62_0.2_255)]" />
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
                  <Textarea id="message" required rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} maxLength={4000} placeholder="Décrivez votre besoin, vos objectifs, votre budget approximatif…" className="focus-visible:ring-[oklch(0.62_0.2_255)]" />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  disabled={loading}
                  className="bg-gradient-cyber text-white hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-cyber w-full sm:w-auto"
                >
                  {loading ? "Envoi en cours…" : <>Envoyer ma demande <Send className="ml-2 h-4 w-4" /></>}
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </SiteLayout>
  );
}
