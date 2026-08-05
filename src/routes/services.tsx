import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Code2,
  Database,
  Network,
  GraduationCap,
  Check,
  ArrowRight,
  Sparkles,
  Rocket,
  ShieldCheck,
  Zap,
  Search,
  PenTool,
  Hammer,
  Headphones,
} from "lucide-react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { FitText } from "@/components/site/FitText";
import webImg from "@/assets/service-web.jpg";
import softwareImg from "@/assets/service-software.jpg";
import networkImg from "@/assets/service-network.jpg";
import schoolImg from "@/assets/service-school.jpg";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Nos services IT — Well Done Services Company" },
      {
        name: "description",
        content:
          "Développement web, ERP, CRM, gestion scolaire, maintenance et réseaux : nos expertises pour digitaliser votre entreprise au Sénégal.",
      },
    ],
  }),
  component: ServicesPage,
});

const services = [
  {
    icon: Code2,
    title: "Développement Web",
    tag: "Web & Mobile",
    desc: "Sites et applications web modernes, rapides et orientés conversion.",
    image: webImg,
    alt: "Développeur front-end travaillant sur une interface e-commerce moderne",
    items: [
      "Sites vitrines & corporate",
      "E-commerce avec mobile money",
      "Applications web sur mesure",
      "Landing pages haute conversion",
    ],
    accent: "from-amber-400 to-amber-600",
    glow: "bg-amber-500/20",
  },
  {
    icon: Database,
    title: "Solutions logicielles",
    tag: "ERP / CRM",
    desc: "Logiciels métiers conçus pour vos processus réels.",
    image: softwareImg,
    alt: "Tableaux de bord ERP et CRM affichés sur plusieurs écrans",
    items: [
      "ERP — gestion intégrée",
      "CRM commercial & marketing",
      "Logiciels métiers personnalisés",
      "Solutions SaaS multi-clients",
    ],
    accent: "from-primary to-primary-glow",
    glow: "bg-primary/20",
  },
  {
    icon: Network,
    title: "Maintenance & Réseaux",
    tag: "Infrastructure",
    desc: "Une infrastructure stable et sécurisée, supervisée par nos experts.",
    image: networkImg,
    alt: "Ingénieur réseau inspectant des baies de serveurs en datacenter",
    items: [
      "Maintenance informatique",
      "Gestion réseau & VPN",
      "Support technique réactif",
      "Audit & cybersécurité",
    ],
    accent: "from-emerald-400 to-teal-600",
    glow: "bg-emerald-500/20",
  },
  {
    icon: GraduationCap,
    title: "Gestion scolaire",
    tag: "EdTech",
    desc: "Une plateforme tout-en-un pour piloter votre établissement.",
    image: schoolImg,
    alt: "Plateforme de gestion scolaire présentée à des élèves en salle informatique",
    items: [
      "Gestion des élèves & inscriptions",
      "Notes & bulletins automatisés",
      "Communication parents-école",
      "Statistiques & tableaux de bord",
    ],
    accent: "from-fuchsia-400 to-purple-600",
    glow: "bg-fuchsia-500/20",
  },
];

const benefits = [
  { icon: Rocket, label: "Mise en production rapide", value: "2–6 sem." },
  { icon: ShieldCheck, label: "Sécurité & conformité", value: "ISO ready" },
  { icon: Zap, label: "Performance Lighthouse", value: "95+" },
  { icon: Sparkles, label: "Satisfaction client", value: "4.9/5" },
];

const process = [
  { icon: Search, title: "Découverte", desc: "Cadrage des besoins, audit existant et objectifs business." },
  { icon: PenTool, title: "Design & Architecture", desc: "Maquettes, parcours utilisateurs et architecture technique." },
  { icon: Hammer, title: "Développement", desc: "Sprints itératifs, démos régulières, qualité de code garantie." },
  { icon: Headphones, title: "Support & évolution", desc: "Maintenance proactive, monitoring et améliorations continues." },
];

function ServicesPage() {
  const prefersReduced = useReducedMotion();

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : 24 },
    visible: (i: number = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        delay: i * 0.08,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  const stagger: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
  };

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-hero text-primary-foreground">
        {/* Animated background orbs */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary-glow/30 blur-3xl"
          animate={prefersReduced ? undefined : { x: [0, 60, 0], y: [0, 40, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -bottom-40 -right-32 h-[28rem] w-[28rem] rounded-full bg-amber-400/20 blur-3xl"
          animate={prefersReduced ? undefined : { x: [0, -50, 0], y: [0, -30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Grid overlay */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:48px_48px]"
        />

        <div className="relative container mx-auto px-4 lg:px-8 py-24 lg:py-36">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="max-w-6xl"
          >
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-6"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span className="text-xs font-bold uppercase tracking-widest text-white/90">
                Nos services
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="font-display font-extrabold leading-[1.05] mb-6 text-[clamp(1.5rem,3.6vw,3.75rem)]"
              style={{ perspective: "1000px" }}
            >
              <FitText>
              {["Une", "expertise", "IT", "à", "360°", "pour", "faire", "grandir", "votre", "activité."].map(
                (word, i) => {
                  const isGold = word === "360°";
                  return (
                    <motion.span
                      key={word + i}
                      className="inline-block mr-[0.24em] relative"
                      style={{ transformStyle: "preserve-3d" }}
                      initial={{ opacity: 0, rotateX: -88, y: 22 }}
                      animate={{ opacity: 1, rotateX: 0, y: 0 }}
                      transition={{ duration: 0.65, delay: 0.15 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                      whileHover={{ rotateX: 14, rotateY: -12, scale: 1.08, z: 40 }}
                    >
                      <span
                        className={
                          isGold
                            ? "bg-gradient-to-r from-amber-300 via-amber-400 to-amber-600 bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(251,191,36,0.35)]"
                            : ""
                        }
                      >
                        {word}
                      </span>
                      {isGold && (
                        <motion.span
                          aria-hidden
                          className="absolute -bottom-1 left-0 right-0 h-[0.08em] rounded-full bg-gradient-to-r from-amber-300 to-amber-600"
                          initial={{ scaleX: 0, transformOrigin: "left" }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: 1, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
                        />
                      )}
                    </motion.span>
                  );
                },
              )}
              </FitText>
            </motion.h1>


            <motion.p
              variants={fadeUp}
              className="text-lg lg:text-xl text-white/80 max-w-2xl leading-relaxed mb-8"
            >
              Développement, conseil et support : nous livrons des solutions concrètes,
              mesurables et durables pour les entreprises ambitieuses.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="bg-white text-foreground hover:bg-white/90 shadow-elegant hover:-translate-y-0.5 transition-all"
              >
                <Link to="/contact">
                  Démarrer un projet <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white"
              >
                <Link to="/realisations">Voir nos réalisations</Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Benefits strip */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="mt-16 lg:mt-24 grid grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {benefits.map((b, i) => (
              <motion.div
                key={b.label}
                custom={i}
                variants={fadeUp}
                className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-md px-5 py-4 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <b.icon className="h-5 w-5 text-amber-300" />
                  </div>
                  <div>
                    <div className="text-2xl font-extrabold leading-none">{b.value}</div>
                    <div className="text-xs text-white/70 mt-1">{b.label}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* SERVICES GRID */}
      <section className="py-24 lg:py-32 relative">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-3">
              Domaines d'expertise
            </p>
            <h2 className="font-display text-3xl lg:text-5xl font-extrabold mb-4">
              Des solutions{" "}
              <span className="text-gradient">pensées pour vos enjeux</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Quatre pôles d'expertise complémentaires pour couvrir tout votre cycle digital.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="grid md:grid-cols-2 gap-6 lg:gap-8"
          >
            {services.map((s, i) => (
              <motion.article
                key={s.title}
                custom={i}
                variants={fadeUp}
                whileHover={prefersReduced ? undefined : { y: -8 }}
                transition={{ type: "spring", stiffness: 220, damping: 22 }}
                className="group relative rounded-3xl bg-gradient-card border border-border shadow-soft hover:shadow-elegant transition-all duration-500 overflow-hidden"
              >
                {/* Glow blob */}
                <div
                  aria-hidden
                  className={`absolute -top-20 -right-20 h-56 w-56 rounded-full ${s.glow} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700`}
                />
                {/* Top gradient bar */}
                <div
                  aria-hidden
                  className={`absolute top-0 left-0 right-0 z-20 h-1 bg-gradient-to-r ${s.accent} scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700 ease-out`}
                />

                {/* Visuel réel */}
                <div className="relative h-48 lg:h-56 overflow-hidden">
                  <img
                    src={s.image}
                    alt={s.alt}
                    width={1280}
                    height={720}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                  />
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#0b1226]/95 via-[#0b1226]/45 to-transparent" />
                  <div aria-hidden className={`absolute inset-0 mix-blend-overlay opacity-50 bg-gradient-to-br ${s.accent}`} />
                  {!prefersReduced && (
                    <motion.div
                      aria-hidden
                      className="pointer-events-none absolute inset-x-0 h-16 opacity-0 group-hover:opacity-60"
                      style={{ background: "linear-gradient(to bottom, transparent, rgb(6 182 212 / 0.45), transparent)" }}
                      animate={{ y: ["-30%", "420%"] }}
                      transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                    />
                  )}
                  <div className="absolute inset-x-6 bottom-5 flex items-end justify-between gap-3">
                    <div
                      className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${s.accent} text-white flex items-center justify-center shadow-glow transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}
                    >
                      <s.icon className="h-7 w-7" />
                    </div>
                    <span className="rounded-full border border-white/30 bg-black/35 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur">
                      {s.tag}
                    </span>
                  </div>
                </div>

                <div className="relative p-8 lg:p-10">


                  <h3 className="font-display text-2xl lg:text-3xl font-bold mb-3">
                    {s.title}
                  </h3>
                  <p className="text-muted-foreground mb-6">{s.desc}</p>

                  <ul className="space-y-3 mb-8">
                    {s.items.map((it) => (
                      <li key={it} className="flex items-start gap-3 text-sm">
                        <span
                          className={`mt-0.5 h-5 w-5 rounded-full bg-gradient-to-br ${s.accent} flex items-center justify-center shrink-0`}
                        >
                          <Check className="h-3 w-3 text-white" strokeWidth={3} />
                        </span>
                        <span className="text-foreground/85">{it}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 text-sm font-bold text-primary group/cta"
                  >
                    En savoir plus
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-1" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* PROCESS TIMELINE */}
      <section className="py-24 lg:py-32 bg-secondary/40">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-3">
              Notre méthode
            </p>
            <h2 className="font-display text-3xl lg:text-5xl font-extrabold mb-4">
              Un process clair, des résultats mesurables
            </h2>
            <p className="text-muted-foreground text-lg">
              De l'idée à la mise en production : nous vous accompagnons à chaque étape.
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div
              aria-hidden
              className="hidden lg:block absolute top-12 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"
            />

            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {process.map((p, i) => (
                <motion.div
                  key={p.title}
                  custom={i}
                  variants={fadeUp}
                  className="relative bg-card rounded-2xl p-6 border border-border shadow-soft hover:shadow-elegant transition-all hover:-translate-y-1 duration-500"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative h-12 w-12 rounded-xl bg-gradient-primary text-primary-foreground flex items-center justify-center shrink-0">
                      <p.icon className="h-6 w-6" />
                      <span className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-amber-500 text-white text-xs font-extrabold flex items-center justify-center shadow-md">
                        {i + 1}
                      </span>
                    </div>
                    <h3 className="font-display text-lg font-bold">{p.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24 pt-8">
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
              className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-amber-400/20 blur-3xl"
              animate={prefersReduced ? undefined : { scale: [1, 1.2, 1] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-primary-glow/30 blur-3xl"
              animate={prefersReduced ? undefined : { scale: [1.1, 1, 1.1] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="relative">
              <h2 className="font-display text-3xl lg:text-5xl font-extrabold mb-4">
                Un projet en tête ?
              </h2>
              <p className="opacity-85 mb-8 max-w-xl mx-auto text-lg">
                Décrivez-nous votre besoin, nous revenons vers vous sous 48h avec une
                proposition adaptée.
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
