import { AnimatePresence, motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Code2, Database, Network, GraduationCap, CheckCircle2, type LucideIcon } from "lucide-react";
import { useMotionPref, useIsMobile } from "@/hooks/useMotionPref";
import webImg from "@/assets/service-web.jpg";
import softwareImg from "@/assets/service-software.jpg";
import networkImg from "@/assets/service-network.jpg";
import schoolImg from "@/assets/service-school.jpg";

type Service = {
  id: string;
  icon: LucideIcon;
  title: string;
  tagline: string;
  desc: string;
  image: string;
  alt: string;
  features: string[];
  metrics: { value: string; label: string }[];
};

const services: Service[] = [
  {
    id: "web",
    icon: Code2,
    title: "Développement Web",
    tagline: "Front-end · E-commerce · PWA",
    desc: "Sites vitrines, e-commerce, applications web et landing pages performantes, pensées pour la conversion et le référencement.",
    image: webImg,
    alt: "Développeur codant un site e-commerce moderne sur un écran ultra-large",
    features: ["Design sur mesure & responsive", "SEO technique et Core Web Vitals", "E-commerce et paiement en ligne", "Progressive Web App installable"],
    metrics: [
      { value: "<1.5s", label: "Temps de chargement" },
      { value: "100%", label: "Responsive mobile" },
      { value: "+2x", label: "Taux de conversion" },
    ],
  },
  {
    id: "software",
    icon: Database,
    title: "Solutions logicielles",
    tagline: "ERP · CRM · SaaS métier",
    desc: "ERP, CRM, logiciels métiers et solutions SaaS sur mesure, intégrés à vos processus et pilotés par la donnée.",
    image: softwareImg,
    alt: "Tableaux de bord ERP et CRM affichés sur plusieurs écrans dans un bureau moderne",
    features: ["Modules ERP finance, stock, RH", "CRM et pipeline commercial", "Tableaux de bord temps réel", "API et intégrations tierces"],
    metrics: [
      { value: "-40%", label: "Tâches manuelles" },
      { value: "360°", label: "Vue client unifiée" },
      { value: "99.9%", label: "Disponibilité" },
    ],
  },
  {
    id: "network",
    icon: Network,
    title: "Maintenance & Réseaux",
    tagline: "Infrastructure · Support 24/7",
    desc: "Maintenance informatique, gestion réseau, supervision et support technique réactif pour garder vos systèmes disponibles.",
    image: networkImg,
    alt: "Ingénieur réseau inspectant des baies de serveurs avec fibres optiques lumineuses",
    features: ["Audit et câblage structuré", "Supervision proactive 24/7", "Sauvegardes et plan de reprise", "Intervention sur site à Dakar"],
    metrics: [
      { value: "24/7", label: "Supervision" },
      { value: "<2h", label: "Délai d'intervention" },
      { value: "10 Gbps", label: "Backbone réseau" },
    ],
  },
  {
    id: "school",
    icon: GraduationCap,
    title: "Gestion scolaire",
    tagline: "EdTech · Parents · Statistiques",
    desc: "Élèves, notes, communication parents-école et statistiques avancées dans une plateforme unique et simple à utiliser.",
    image: schoolImg,
    alt: "Enseignant présentant un tableau de bord de gestion scolaire à des élèves équipés d'ordinateurs",
    features: ["Inscriptions et dossiers élèves", "Notes, bulletins et absences", "Portail parents et SMS", "Comptabilité et scolarité"],
    metrics: [
      { value: "5 000+", label: "Élèves gérés" },
      { value: "-70%", label: "Temps administratif" },
      { value: "100%", label: "Parents informés" },
    ],
  },
];

export function ServiceTabs() {
  const { reduce: prefReduce } = useMotionPref();
  const isMobile = useIsMobile();
  // On mobile we behave like reduced motion: no parallax/zoom, no scan-line.
  const reduce = prefReduce || isMobile;
  const [active, setActive] = useState(0);
  const current = services[active];

  // Auto-advance until the user takes control
  const [auto, setAuto] = useState(true);
  useEffect(() => {
    if (!auto || reduce) return;
    const t = setInterval(() => setActive((a) => (a + 1) % services.length), 7000);
    return () => clearInterval(t);
  }, [auto, reduce]);

  const select = (i: number) => {
    setAuto(false);
    setActive(i);
  };

  return (
    <div className="relative">
      {/* Tab bar */}
      <div
        role="tablist"
        aria-label="Nos expertises"
        className="relative flex flex-wrap gap-2 rounded-2xl glass p-2"
      >
        {services.map((s, i) => {
          const isActive = i === active;
          return (
            <button
              key={s.id}
              role="tab"
              id={`service-tab-${s.id}`}
              aria-selected={isActive}
              aria-controls={`service-panel-${s.id}`}
              onClick={() => select(i)}
              className={`relative flex-1 min-w-[9rem] rounded-xl px-4 py-3 text-left transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cyber-cyan)] ${
                isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="service-tab-pill"
                  aria-hidden
                  className="absolute inset-0 rounded-xl bg-gradient-cyber shadow-cyber"
                  transition={{ type: "spring", stiffness: 320, damping: 30 }}
                />
              )}
              <span className="relative flex items-center gap-2.5">
                <s.icon className="h-4.5 w-4.5 shrink-0" strokeWidth={1.8} />
                <span className="flex flex-col">
                  <span className="font-display text-sm font-bold leading-tight">{s.title}</span>
                  <span className={`font-mono text-[10px] uppercase tracking-[0.14em] ${isActive ? "text-primary-foreground/80" : "text-muted-foreground/70"}`}>
                    {s.tagline}
                  </span>
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Panel */}
      <div
        role="tabpanel"
        id={`service-panel-${current.id}`}
        aria-labelledby={`service-tab-${current.id}`}
        className="relative mt-6 overflow-hidden rounded-3xl border border-border bg-gradient-card shadow-elegant"
      >
        <div aria-hidden className="absolute inset-0 bg-grid-cyber opacity-30 [mask-image:radial-gradient(ellipse_at_top_right,black_10%,transparent_70%)]" />
        <div className="relative grid lg:grid-cols-[1.05fr_1fr]">
          {/* Visual */}
          <div className="relative min-h-[16rem] lg:min-h-[26rem] overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.img
                key={current.id}
                src={current.image}
                alt={current.alt}
                width={1280}
                height={960}
                loading="lazy"
                initial={{ opacity: 0, scale: reduce ? 1 : 1.08 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </AnimatePresence>
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#0b1226]/85 via-[#0b1226]/25 to-transparent" />
            <div aria-hidden className="absolute inset-0 mix-blend-screen opacity-40" style={{ background: "var(--gradient-glow)" }} />
            {!reduce && (
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 h-24 opacity-40"
                style={{ background: "linear-gradient(to bottom, transparent, rgb(6 182 212 / 0.35), transparent)" }}
                animate={{ y: ["-20%", "420%"] }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              />
            )}

            {/* Metrics overlay */}
            <div className="absolute inset-x-4 bottom-4 grid grid-cols-3 gap-2">
              {current.metrics.map((m, i) => (
                <motion.div
                  key={`${current.id}-${m.label}`}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.08, duration: 0.5 }}
                  className="rounded-xl border border-[color:var(--cyber-cyan)]/40 bg-[#0b1226]/70 px-3 py-2 backdrop-blur"
                >
                  <div className="font-display text-base lg:text-lg font-bold text-primary-foreground">{m.value}</div>
                  <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-primary-foreground/70">{m.label}</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="relative p-6 lg:p-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: reduce ? 0 : 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduce ? 0 : -12 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--cyber-cyan)]" />
                  {current.tagline}
                </div>
                <h3 className="font-display text-2xl lg:text-4xl font-bold tracking-tight mb-4">{current.title}</h3>
                <p className="text-muted-foreground text-base lg:text-lg leading-relaxed mb-7">{current.desc}</p>
                <ul className="space-y-3 mb-8">
                  {current.features.map((f, i) => (
                    <motion.li
                      key={f}
                      initial={{ opacity: 0, x: reduce ? 0 : -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.07, duration: 0.4 }}
                      className="flex items-start gap-3 text-sm lg:text-base"
                    >
                      <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-[color:var(--cyber-cyan)]" />
                      <span>{f}</span>
                    </motion.li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/contact"
                    search={{ source: `service:${current.id}` } as never}
                    className="group inline-flex items-center gap-2 rounded-full bg-gradient-cyber px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-cyber transition-transform duration-300 hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cyber-cyan)]"
                  >
                    Demander un devis
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link
                    to="/services"
                    className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold transition-colors hover:border-[color:var(--cyber-cyan)]/60 hover:text-[color:var(--cyber-blue)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cyber-cyan)]"
                  >
                    Détails du service
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
