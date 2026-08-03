import { createFileRoute, Link } from "@tanstack/react-router";
import { Suspense, lazy, useEffect, useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight, CheckCircle2, Sparkles, Quote, ShieldCheck, Lock, Eye, Zap } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { HoloRig } from "@/components/site/HoloRig";
import { ParticleField } from "@/components/site/ParticleField";
import { LeadershipShowcase } from "@/components/site/LeadershipShowcase";
import { ServiceTabs } from "@/components/site/ServiceTabs";


// Below-the-fold 3D sections are code-split so the first paint stays fast (PWA/mobile).
const DataCube3D = lazy(() => import("@/components/site/DataCube3D").then((m) => ({ default: m.DataCube3D })));
const Timeline3D = lazy(() => import("@/components/site/Timeline3D").then((m) => ({ default: m.Timeline3D })));
const CyberShield = lazy(() => import("@/components/site/CyberShield").then((m) => ({ default: m.CyberShield })));
import { supabase } from "@/integrations/supabase/client";
import heroImg from "@/assets/hero-network.jpg";
import ceoImg from "@/assets/ceo-kharma.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Well Done Services Company — Transformation digitale en Afrique" },
      { name: "description", content: "Solutions IT sur mesure : développement web, ERP, CRM, gestion scolaire, maintenance et réseaux pour PME, écoles et administrations." },
    ],
  }),
  component: HomePage,
});

type Project = {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  image_url: string | null;
};


const stats = [
  { value: "50+", label: "Projets réalisés" },
  { value: "05+", label: "Années d'expérience" },
  { value: "98%", label: "Satisfaction client" },
  { value: "24/7", label: "Support technique" },
];

const testimonials = [
  { name: "Mme Diop", role: "Directrice — Groupe scolaire", text: "La plateforme de gestion scolaire a transformé notre relation avec les parents. Réactivité et professionnalisme exceptionnels." },
  { name: "M. Ndiaye", role: "DG — PME industrielle", text: "Notre ERP sur mesure nous a fait gagner un temps précieux. Une équipe à l'écoute, qui livre dans les délais." },
  { name: "Aïssatou S.", role: "Fondatrice — Startup", text: "Site et CRM livrés clés en main. Notre conversion a doublé en 3 mois." },
];

function HomePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    supabase
      .from("projects")
      .select("id,title,slug,description,category,image_url")
      .eq("published", true)
      .order("display_order", { ascending: true })
      .limit(3)
      .then(({ data }) => setProjects(data ?? []));
  }, []);

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : 24 },
    visible: (i: number = 0) => ({
      opacity: 1, y: 0,
      transition: { duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
    }),
  };
  const stagger: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } };

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden -mt-16 lg:-mt-20 pt-28 lg:pt-36 pb-24 lg:pb-32">
        <div className="absolute inset-0 -z-10">
          <img src={heroImg} alt="" width={1920} height={1080} className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-hero opacity-90" />
          <div className="absolute inset-0 bg-gradient-glow" />
          <div aria-hidden className="absolute inset-0 bg-grid-cyber opacity-30" />
          <ParticleField density={36} />
        </div>

        <motion.div
          aria-hidden
          className="pointer-events-none absolute top-20 -left-32 h-96 w-96 rounded-full blur-3xl"
          style={{ background: "var(--gradient-cyber)", opacity: 0.3 }}
          animate={prefersReduced ? undefined : { x: [0, 60, 0], y: [0, 40, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute bottom-0 -right-32 h-[28rem] w-[28rem] rounded-full bg-[oklch(0.82_0.16_210)]/25 blur-3xl"
          animate={prefersReduced ? undefined : { x: [0, -50, 0], y: [0, -30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="container mx-auto px-4 lg:px-8 relative">
          <div className="grid lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-16 items-center">
            <motion.div variants={stagger} initial="hidden" animate="visible" className="max-w-3xl">
              <motion.div
                variants={fadeUp}
                className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs lg:text-sm text-primary-foreground mb-6"
              >
                <Sparkles className="h-3.5 w-3.5 text-[color:var(--cyber-cyan)]" />
                <span>Acteur de la transformation digitale en Afrique</span>
              </motion.div>
              <motion.h1
                variants={fadeUp}
                className="font-display text-4xl sm:text-5xl lg:text-7xl font-extrabold text-primary-foreground leading-[1.05] mb-6"
              >
                Des solutions IT
                <br />
                <span className="relative inline-block">
                  <span className="text-holo">qui transforment</span>
                  <motion.span
                    aria-hidden
                    className="absolute -bottom-2 left-0 right-0 h-1 rounded-full bg-gradient-cyber"
                    initial={{ scaleX: 0, transformOrigin: "left" }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  />
                </span>{" "}
                votre entreprise.
              </motion.h1>
              <motion.p variants={fadeUp} className="text-base lg:text-xl text-primary-foreground/85 max-w-2xl leading-relaxed mb-10">
                Well Done Services Company conçoit et déploie des solutions web, logicielles et réseau sur mesure pour les PME, écoles, administrations et startups au Sénégal et en Afrique.
              </motion.p>
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3">
                <Button asChild size="lg" className="bg-gradient-cyber text-white hover:opacity-90 shadow-cyber hover:-translate-y-0.5 transition-all focus-visible:ring-2 focus-visible:ring-[color:var(--cyber-cyan)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0f172a]">
                  <Link to="/contact">Demander un devis <ArrowRight className="ml-1 h-4 w-4" /></Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/30 text-primary-foreground hover:bg-white/10 bg-transparent">
                  <Link to="/contact">Nous contacter</Link>
                </Button>
              </motion.div>
            </motion.div>

            {/* Holographic 3D rig */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="hidden lg:block"
            >
              <HoloRig className="max-w-lg mx-auto" />
            </motion.div>
          </div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10"
          >
            {stats.map((s, i) => (
              <motion.div key={s.label} custom={i} variants={fadeUp} className="border-l-2 border-[color:var(--cyber-cyan)]/60 pl-4">
                <div className="font-display text-3xl lg:text-5xl font-bold text-primary-foreground">{s.value}</div>
                <div className="text-xs lg:text-sm text-primary-foreground/70 mt-1">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>


      {/* MOT DU PDG — immersive 3D leadership showcase */}
      <LeadershipShowcase />

      {/* PROJETS */}
      <section className="py-24 lg:py-32 bg-surface relative overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14"
          >
            <div className="max-w-2xl">
              <p className="text-sm font-bold text-[oklch(0.62_0.2_255)] uppercase tracking-widest mb-3">Réalisations</p>
              <h2 className="font-display text-3xl lg:text-5xl font-bold">Nos projets <span className="text-cyber">récents</span>.</h2>
            </div>
            <Button asChild variant="outline" className="hover:border-[oklch(0.62_0.2_255)] hover:text-[oklch(0.62_0.2_255)]">
              <Link to="/realisations">Voir le portfolio complet</Link>
            </Button>
          </motion.div>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {projects.map((p, i) => (
              <motion.div key={p.id} custom={i} variants={fadeUp}>
                <Link
                  to="/realisations/$slug"
                  params={{ slug: p.slug }}
                  className="group block rounded-2xl overflow-hidden bg-card border border-border hover:border-[oklch(0.82_0.16_210)]/60 hover:shadow-cyber transition-all duration-500 hover:-translate-y-1"
                >
                  <div className="aspect-[4/3] bg-gradient-primary relative overflow-hidden">
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-cyber flex items-center justify-center">
                        <span className="font-display text-6xl text-white/30">{p.title[0]}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  <div className="p-6">
                    <p className="text-xs font-bold text-[oklch(0.62_0.2_255)] uppercase tracking-widest mb-2">{p.category}</p>
                    <h3 className="font-display text-lg font-bold mb-2 group-hover:text-[oklch(0.62_0.2_255)] transition-colors duration-300">{p.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{p.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>


      {/* CTA */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-hero p-10 lg:p-20 text-center shadow-elegant">
            <div className="absolute inset-0 bg-gradient-glow" />
            <div className="relative max-w-3xl mx-auto">
              <h2 className="font-display text-3xl lg:text-5xl font-bold text-primary-foreground mb-5">
                Prêt à accélérer votre transformation digitale ?
              </h2>
              <p className="text-primary-foreground/80 text-lg mb-8">
                Échangeons sur votre projet. Nous vous proposons une étude personnalisée et un devis gratuit sous 48h.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                  <Link to="/contact">Demander un devis gratuit <ArrowRight className="ml-1 h-4 w-4" /></Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent">
                  <Link to="/contact">Nous contacter</Link>
                </Button>
              </div>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-primary-foreground/70">
                <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary-glow" /> Devis sous 48h</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary-glow" /> Sans engagement</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary-glow" /> Équipe locale Dakar</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-24 lg:py-32 relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 bg-grid-cyber opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
        <div className="container mx-auto px-4 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="max-w-5xl mb-16"
          >
            <p className="text-xs font-bold text-[oklch(0.62_0.2_255)] uppercase tracking-[0.35em] mb-5">Nos expertises</p>
            <h2
              className="font-display font-bold leading-[1.1] tracking-tight mb-6 whitespace-nowrap text-[clamp(1.05rem,4.2vw,3.25rem)]"
              style={{ perspective: "900px" }}
            >
              {[
                { t: "Une", c: "" },
                { t: "offre", c: "" },
                { t: "complète", c: "text-cyber" },
                { t: "pour", c: "text-muted-foreground font-light" },
                { t: "digitaliser", c: "text-muted-foreground font-light" },
                { t: "votre", c: "text-muted-foreground font-light" },
                { t: "activité.", c: "text-muted-foreground font-light" },
              ].map((w, i) => (
                <motion.span
                  key={w.t}
                  className={`inline-block mr-[0.25em] ${w.c}`}
                  style={{ transformStyle: "preserve-3d" }}
                  initial={{ opacity: 0, rotateX: -85, y: 18 }}
                  whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.6, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ rotateX: 12, rotateY: -10, scale: 1.06 }}
                >
                  {w.t}
                </motion.span>
              ))}
            </h2>

            <p className="text-muted-foreground text-lg lg:text-xl leading-relaxed max-w-2xl">
              Du site vitrine à l'ERP métier, en passant par la gestion scolaire et l'infrastructure réseau.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <ServiceTabs />
          </motion.div>
          <div className="mt-10">
            <Button asChild variant="ghost" className="group hover:text-[oklch(0.62_0.2_255)]">
              <Link to="/services">Voir tous les services <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-smooth" /></Link>
            </Button>
          </div>

        </div>
      </section>

      {/* INFRASTRUCTURE 3D */}
      <section className="relative py-24 lg:py-32 overflow-hidden bg-[#0b1226] text-white">
        <div aria-hidden className="absolute inset-0 bg-gradient-mesh opacity-50" />
        <div aria-hidden className="absolute inset-0 bg-grid-cyber opacity-25 [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_75%)]" />
        <ParticleField density={40} />
        <div className="container mx-auto px-4 lg:px-8 relative">
          <div className="grid lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-xs font-bold text-[color:var(--cyber-cyan)] uppercase tracking-[0.35em] mb-5">
                Infrastructure · Cloud · IA
              </p>
              <h2 className="font-display text-3xl lg:text-5xl font-bold leading-tight mb-6">
                Une plateforme <span className="text-holo">connectée</span> de bout en bout.
              </h2>
              <p className="text-white/75 text-base lg:text-lg leading-relaxed mb-10 max-w-xl">
                Datacenter souverain, cloud multi-région, réseau SD-WAN, cluster GPU pour l'IA et supervision temps réel.
                Chaque brique est orchestrée pour une performance et une résilience de niveau industriel.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-10">
                {[
                  { k: "99.99%", v: "Disponibilité SLA" },
                  { k: "12 ms", v: "Latence médiane" },
                  { k: "10 Gbps", v: "Backbone réseau" },
                  { k: "24/7", v: "Supervision SOC" },
                ].map((s) => (
                  <div key={s.v} className="glass rounded-xl p-4">
                    <div className="font-display text-2xl font-bold text-white">{s.k}</div>
                    <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[color:var(--cyber-cyan)] mt-1">
                      {s.v}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild size="lg" className="bg-gradient-cyber text-white shadow-cyber hover:opacity-90 hover:-translate-y-0.5 transition-all">
                  <Link to="/contact">Demander un devis <ArrowRight className="ml-1 h-4 w-4" /></Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/30 bg-transparent text-white hover:bg-white/10">
                  <Link to="/services">Découvrir l'infrastructure</Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <Suspense fallback={<div className="aspect-square w-full rounded-3xl bg-white/5" />}><DataCube3D /></Suspense>
            </motion.div>
          </div>
        </div>
      </section>

      {/* TRANSFORMATION TIMELINE */}
      <Suspense fallback={<div className="h-64" />}><Timeline3D /></Suspense>


      {/* TESTIMONIALS */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-2xl mb-14">
            <p className="text-sm font-semibold text-primary-glow uppercase tracking-wider mb-3">Témoignages</p>
            <h2 className="font-display text-3xl lg:text-5xl font-bold">Ils nous font <span className="text-gradient">confiance</span>.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="p-8 rounded-2xl bg-gradient-card border border-border shadow-soft">
                <Quote className="h-8 w-8 text-primary-glow mb-4 opacity-50" />
                <p className="text-foreground/85 leading-relaxed mb-6">"{t.text}"</p>
                <div>
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-sm text-muted-foreground">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CYBERSÉCURITÉ */}
      <section className="relative py-24 lg:py-32 overflow-hidden bg-[#0f172a] text-white">
        <div aria-hidden className="absolute inset-0 bg-gradient-mesh opacity-60" />
        <div aria-hidden className="absolute inset-0 bg-grid-cyber opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_75%)]" />
        <div className="container mx-auto px-4 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <Suspense fallback={<div className="aspect-square w-full rounded-3xl bg-white/5" />}><CyberShield /></Suspense>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-xs font-bold text-[color:var(--cyber-cyan)] uppercase tracking-[0.35em] mb-5">Cybersécurité</p>
              <h2 className="font-display text-3xl lg:text-5xl font-bold leading-tight mb-6">
                Protégez votre <span className="text-holo">infrastructure</span> et vos données sensibles.
              </h2>
              <p className="text-white/75 text-base lg:text-lg leading-relaxed mb-8 max-w-xl">
                Audit de sécurité, durcissement des systèmes, gestion des accès, sauvegardes chiffrées et supervision 24/7. Nous mettons en place une défense en profondeur adaptée à votre organisation.
              </p>
              <ul className="grid sm:grid-cols-2 gap-3 mb-10">
                {[
                  { icon: ShieldCheck, label: "Audit & pentest" },
                  { icon: Lock, label: "Chiffrement AES-256" },
                  { icon: Eye, label: "Supervision 24/7 (SOC)" },
                  { icon: Zap, label: "Réponse à incident" },
                ].map((x) => (
                  <li key={x.label} className="flex items-center gap-3 rounded-xl glass px-4 py-3 text-sm">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-cyber shadow-cyber">
                      <x.icon className="h-4 w-4 text-white" />
                    </span>
                    <span className="text-white/90 font-medium">{x.label}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild size="lg" className="bg-gradient-cyber text-white shadow-cyber hover:opacity-90 hover:-translate-y-0.5 transition-all">
                  <Link to="/contact">Sécuriser mon SI <ArrowRight className="ml-1 h-4 w-4" /></Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/30 bg-transparent text-white hover:bg-white/10">
                  <Link to="/services">Voir toutes nos expertises</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* PARTENAIRES */}
      <section className="py-16 lg:py-24 bg-surface">
        <div className="container mx-auto px-4 lg:px-8">
          <p className="text-center text-xs font-bold text-muted-foreground uppercase tracking-[0.35em] mb-10">
            Ils nous font confiance
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 items-center">
            {["Ministère", "Groupe Scolaire", "PME Industrielle", "Fintech", "ONG", "Startup"].map((name) => (
              <div
                key={name}
                className="glass rounded-xl h-16 grid place-items-center text-sm font-display font-bold text-primary/80 hover:text-primary hover:-translate-y-0.5 transition-all"
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
