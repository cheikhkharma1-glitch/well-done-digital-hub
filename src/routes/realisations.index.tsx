import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion, type Variants } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  Layers,
  Trophy,
  Users,
  Rocket,
  Search,
  Filter,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/realisations/")({
  head: () => ({
    meta: [
      { title: "Réalisations & portfolio — Well Done Services Company" },
      {
        name: "description",
        content:
          "Découvrez nos projets : plateformes de gestion scolaire, ERP, CRM, sites web et applications développés au Sénégal.",
      },
    ],
  }),
  component: PortfolioPage,
});

type Project = {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  image_url: string | null;
  technologies: string[] | null;
};

const stats = [
  { icon: Trophy, value: "50+", label: "Projets livrés" },
  { icon: Users, value: "30+", label: "Clients satisfaits" },
  { icon: Layers, value: "8", label: "Secteurs couverts" },
  { icon: Rocket, value: "98%", label: "Taux de succès" },
];

// Portfolio de démonstration (affiché si la table `projects` est vide)
// Images IT réelles servies par Unsplash (libres de droits).
const DEMO_PROJECTS: Project[] = [
  {
    id: "demo-1",
    slug: "plateforme-gestion-scolaire",
    title: "Plateforme de gestion scolaire",
    description:
      "SaaS multi-établissements : notes, paiements, communication parents, tableaux de bord temps réel.",
    category: "EdTech",
    image_url:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=80",
    technologies: ["React", "Node.js", "PostgreSQL", "Redis"],
  },
  {
    id: "demo-2",
    slug: "erp-industriel",
    title: "ERP industriel sur-mesure",
    description:
      "Gestion production, stocks, achats et RH pour une PME manufacturière — 40% de gain de productivité.",
    category: "ERP",
    image_url:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80",
    technologies: ["Next.js", "NestJS", "PostgreSQL", "Docker"],
  },
  {
    id: "demo-3",
    slug: "crm-commercial",
    title: "CRM commercial B2B",
    description:
      "Pipeline de vente, automatisations et scoring IA pour une force commerciale de 120 personnes.",
    category: "CRM",
    image_url:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80",
    technologies: ["React", "TypeScript", "Supabase", "OpenAI"],
  },
  {
    id: "demo-4",
    slug: "app-mobile-fintech",
    title: "Application mobile FinTech",
    description:
      "Wallet mobile avec transferts, paiements marchands et KYC vidéo — 50k+ utilisateurs actifs.",
    category: "Mobile",
    image_url:
      "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=1400&q=80",
    technologies: ["React Native", "Node.js", "MongoDB", "Stripe"],
  },
  {
    id: "demo-5",
    slug: "infrastructure-cloud",
    title: "Migration Cloud & DevOps",
    description:
      "Migration on-premise vers Kubernetes managé, CI/CD, observabilité et sécurité zero-trust.",
    category: "Cloud",
    image_url:
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1400&q=80",
    technologies: ["Kubernetes", "Terraform", "AWS", "Grafana"],
  },
  {
    id: "demo-6",
    slug: "audit-cybersecurite",
    title: "Audit & durcissement cybersécurité",
    description:
      "Pentest, hardening des serveurs, WAF, SIEM et formation des équipes pour un groupe bancaire.",
    category: "Cybersécurité",
    image_url:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1400&q=80",
    technologies: ["Wazuh", "Suricata", "Cloudflare", "Vault"],
  },
  {
    id: "demo-7",
    slug: "site-vitrine-corporate",
    title: "Site vitrine corporate premium",
    description:
      "Refonte identitaire avec animations 3D, CMS headless et SEO — +180% de leads qualifiés.",
    category: "Web",
    image_url:
      "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=1400&q=80",
    technologies: ["Next.js", "Sanity", "Framer Motion", "Vercel"],
  },
  {
    id: "demo-8",
    slug: "dashboard-ia-analytics",
    title: "Dashboard analytics dopé à l'IA",
    description:
      "Décisionnel temps réel avec prédictions ML, alertes intelligentes et exports automatisés.",
    category: "Data & IA",
    image_url:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80",
    technologies: ["Python", "FastAPI", "React", "TensorFlow"],
  },
  {
    id: "demo-9",
    slug: "datacenter-supervision",
    title: "Supervision datacenter 24/7",
    description:
      "Monitoring infrastructure, alertes multicanal et automatisation des remédiations niveau 1.",
    category: "Cloud",
    image_url:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1400&q=80",
    technologies: ["Prometheus", "Grafana", "Ansible", "PagerDuty"],
  },
];


function PortfolioPage() {
  const prefersReduced = useReducedMotion();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState<string>("Tous");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("projects")
      .select("id,title,slug,description,category,image_url,technologies")
      .eq("published", true)
      .order("display_order", { ascending: true })
      .then(({ data }) => {
        const list = data ?? [];
        setProjects(list.length ? list : DEMO_PROJECTS);
        setLoading(false);
      });
  }, []);


  const cats = useMemo(
    () => ["Tous", ...Array.from(new Set(projects.map((p) => p.category)))],
    [projects],
  );

  const visible = useMemo(() => {
    let list = filter === "Tous" ? projects : projects.filter((p) => p.category === filter);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.technologies?.some((t) => t.toLowerCase().includes(q)),
      );
    }
    return list;
  }, [projects, filter, query]);

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : 24 },
    visible: (i: number = 0) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] },
    }),
  };

  const stagger: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  };

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-hero text-primary-foreground">
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[oklch(0.62_0.2_255)]/30 blur-3xl"
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
        {/* Scanning beam */}
        <motion.div
          aria-hidden
          className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-[oklch(0.82_0.16_210)] to-transparent"
          initial={{ top: "0%" }}
          animate={prefersReduced ? undefined : { top: ["0%", "100%"] }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />

        <div className="relative container mx-auto px-4 lg:px-8 py-24 lg:py-36">
          <motion.div variants={stagger} initial="hidden" animate="visible" className="max-w-4xl">
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-6"
            >
              <Sparkles className="h-3.5 w-3.5 text-[oklch(0.82_0.16_210)]" />
              <span className="text-xs font-bold uppercase tracking-widest text-white/90">
                Portfolio
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="font-display text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] mb-6"
            >
              Nos réalisations qui{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-[oklch(0.82_0.16_210)] via-[oklch(0.62_0.2_255)] to-[oklch(0.82_0.16_210)] bg-clip-text text-transparent">
                  parlent
                </span>
                <motion.span
                  aria-hidden
                  className="absolute -bottom-2 left-0 right-0 h-1 rounded-full bg-gradient-to-r from-[oklch(0.82_0.16_210)] to-[oklch(0.62_0.2_255)]"
                  initial={{ scaleX: 0, transformOrigin: "left" }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                />
              </span>{" "}
              d'elles-mêmes.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-lg lg:text-xl text-white/80 max-w-2xl leading-relaxed"
            >
              Chaque projet est une preuve concrète de notre engagement et de notre expertise.
              Découvrez les solutions que nous avons conçues pour des entreprises ambitieuses.
            </motion.p>
          </motion.div>

          {/* Stats strip */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="mt-16 lg:mt-24 grid grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                custom={i}
                variants={fadeUp}
                className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-md px-5 py-4 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <s.icon className="h-5 w-5 text-[oklch(0.82_0.16_210)]" />
                  </div>
                  <div>
                    <div className="text-2xl font-extrabold leading-none">{s.value}</div>
                    <div className="text-xs text-white/70 mt-1">{s.label}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FILTERS + GRID */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Toolbar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10"
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[oklch(0.62_0.2_255)] mb-2">
                <Filter className="inline h-3.5 w-3.5 mr-1.5 -mt-0.5" />
                Filtrer par catégorie
              </p>
              <h2 className="font-display text-2xl lg:text-3xl font-extrabold">
                Explorez notre portfolio
              </h2>
            </div>

            <div className="relative w-full lg:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher un projet, une techno…"
                className="w-full pl-10 pr-4 py-3 rounded-full bg-secondary/60 border border-border focus:outline-none focus:ring-2 focus:ring-[oklch(0.62_0.2_255)]/40 focus:border-[oklch(0.62_0.2_255)]/40 text-sm transition-all"
              />
            </div>
          </motion.div>

          {/* Filter pills */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="flex flex-wrap gap-2 mb-12"
          >
            {cats.map((c, i) => {
              const active = filter === c;
              return (
                <motion.button
                  key={c}
                  custom={i}
                  variants={fadeUp}
                  onClick={() => setFilter(c)}
                  whileTap={{ scale: 0.96 }}
                  className={`relative px-5 py-2.5 rounded-full text-sm font-bold uppercase tracking-wide transition-all ${
                    active
                      ? "text-white shadow-elegant"
                      : "bg-secondary text-foreground/80 hover:bg-accent hover:text-foreground"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="active-cat-pill"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-[oklch(0.82_0.16_210)] to-[oklch(0.62_0.2_255)]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{c}</span>
                </motion.button>
              );
            })}
          </motion.div>

          {/* Grid */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-3xl overflow-hidden bg-card border border-border animate-pulse"
                >
                  <div className="aspect-[4/3] bg-secondary/60" />
                  <div className="p-6 space-y-3">
                    <div className="h-3 w-20 bg-secondary/60 rounded" />
                    <div className="h-5 w-3/4 bg-secondary/60 rounded" />
                    <div className="h-4 w-full bg-secondary/60 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : visible.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20 rounded-3xl border border-dashed border-border bg-secondary/30"
            >
              <Search className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-display text-xl font-bold mb-2">Aucun projet trouvé</h3>
              <p className="text-muted-foreground">
                Essayez de modifier votre recherche ou de changer de catégorie.
              </p>
            </motion.div>
          ) : (
            <motion.div
              layout
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
            >
              <AnimatePresence mode="popLayout">
                {visible.map((p, i) => (
                  <motion.div
                    key={p.id}
                    layout
                    custom={i}
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.25 } }}
                    whileHover={prefersReduced ? undefined : { y: -8 }}
                    transition={{ type: "spring", stiffness: 220, damping: 22 }}
                  >
                    <Link
                      to="/realisations/$slug"
                      params={{ slug: p.slug }}
                      className="group relative block rounded-3xl overflow-hidden bg-gradient-card border border-border shadow-soft hover:shadow-elegant transition-all duration-500 h-full"
                    >
                      {/* Glow */}
                      <div
                        aria-hidden
                        className="absolute -top-24 -right-24 h-56 w-56 rounded-full bg-[oklch(0.82_0.16_210)]/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                      />
                      {/* Top gradient bar */}
                      <div
                        aria-hidden
                        className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[oklch(0.82_0.16_210)] to-[oklch(0.62_0.2_255)] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700 ease-out z-10"
                      />

                      <div className="aspect-[4/3] bg-gradient-primary relative overflow-hidden">
                        {p.image_url ? (
                          <img
                            src={p.image_url}
                            alt={p.title}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-primary flex items-center justify-center">
                            <span className="font-display text-7xl text-primary-foreground/30">
                              {p.title[0]}
                            </span>
                          </div>
                        )}
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />

                        {/* Category badge */}
                        <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-sm text-[10px] font-bold uppercase tracking-widest text-foreground shadow-md">
                          {p.category}
                        </span>

                        {/* Hover arrow */}
                        <div className="absolute top-4 right-4 h-10 w-10 rounded-full bg-gradient-cyber text-white flex items-center justify-center shadow-glow translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                          <ArrowUpRight className="h-5 w-5" />
                        </div>

                        {/* Tech chips on hover */}
                        {p.technologies && p.technologies.length > 0 && (
                          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-1.5 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                            {p.technologies.slice(0, 4).map((t) => (
                              <span
                                key={t}
                                className="px-2 py-1 rounded-md bg-white/95 backdrop-blur-sm text-[10px] font-semibold text-foreground"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="p-6 relative">
                        <h3 className="font-display text-xl font-bold mb-2 group-hover:text-[oklch(0.62_0.2_255)] transition-colors duration-300">
                          {p.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                          {p.description}
                        </p>
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[oklch(0.62_0.2_255)]">
                          Voir le projet
                          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-3xl bg-gradient-hero text-primary-foreground p-10 lg:p-16 text-center shadow-elegant"
          >
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[oklch(0.82_0.16_210)]/20 blur-3xl"
              animate={prefersReduced ? undefined : { scale: [1, 1.2, 1] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-[oklch(0.62_0.2_255)]/30 blur-3xl"
              animate={prefersReduced ? undefined : { scale: [1.1, 1, 1.1] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="relative">
              <h2 className="font-display text-3xl lg:text-5xl font-extrabold mb-4">
                Votre projet sera le prochain.
              </h2>
              <p className="opacity-85 mb-8 max-w-xl mx-auto text-lg">
                Rejoignez les entreprises qui nous font confiance pour transformer leurs ambitions
                en succès digitaux.
              </p>
              <Button
                asChild
                size="lg"
                className="bg-white text-foreground hover:bg-white/90 shadow-elegant hover:-translate-y-0.5 transition-all"
              >
                <Link to="/contact">
                  Démarrer un projet <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </SiteLayout>
  );
}
