import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef } from "react";
import {
  Target,
  Eye,
  Heart,
  Award,
  Quote,
  GitBranch,
  ShieldCheck,
  Gauge,
  Cloud,
  Terminal,
  ArrowRight,
} from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Holo3DTitle } from "@/components/site/Holo3DTitle";
import { CyberShield } from "@/components/site/CyberShield";
import portraitFounder from "@/assets/portrait-founder.png";
import aboutTeam from "@/assets/about-team.jpg";
import aboutDevops from "@/assets/about-devops.jpg";
import aboutDatacenter from "@/assets/about-datacenter.jpg";

export const Route = createFileRoute("/a-propos")({
  head: () => ({
    meta: [
      { title: "À propos — Well Done Services Company" },
      {
        name: "description",
        content:
          "Notre mission, notre culture DevOps et nos valeurs : accélérer la transformation digitale des entreprises au Sénégal et en Afrique.",
      },
      { property: "og:title", content: "À propos — Well Done Services Company" },
      {
        property: "og:description",
        content:
          "Équipe IT à Dakar : ingénierie logicielle, cybersécurité, cloud et DevOps au service de votre croissance.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

const values = [
  { icon: Target, title: "Mission", text: "Accompagner PME, écoles et administrations dans leur transition numérique avec des solutions sur mesure.", tag: "mission.yml" },
  { icon: Eye, title: "Vision", text: "Devenir l'acteur de référence de la transformation digitale en Afrique de l'Ouest.", tag: "vision.json" },
  { icon: Heart, title: "Valeurs", text: "Excellence, écoute, transparence et engagement long terme avec chaque client.", tag: "values.env" },
  { icon: Award, title: "Engagement", text: "Livrer dans les délais, avec qualité, et assurer un support continu après mise en production.", tag: "sla.conf" },
];

const devops = [
  { icon: GitBranch, k: "CI/CD", v: "Déploiements automatisés", d: "Pipelines Git → build → tests → production, sans interruption de service." },
  { icon: ShieldCheck, k: "DevSecOps", v: "Sécurité intégrée", d: "Scans de dépendances, chiffrement, revue de code et durcissement systématiques." },
  { icon: Gauge, k: "Observabilité", v: "Monitoring 24/7", d: "Métriques, alertes et journaux centralisés pour anticiper les incidents." },
  { icon: Cloud, k: "Cloud natif", v: "Scalabilité maîtrisée", d: "Infrastructure as code, multi-région, coûts optimisés et réversibles." },
];

function AboutPage() {
  const reduce = useReducedMotion();
  const bandRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: bandRef, offset: ["start end", "end start"] });
  const bandY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#0b1226] py-20 lg:py-28 text-white">
        <div aria-hidden className="absolute inset-0 bg-gradient-mesh opacity-50" />
        <div
          aria-hidden
          className="absolute inset-0 bg-grid-cyber opacity-25 [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_75%)]"
        />
        <div className="container mx-auto px-4 lg:px-8 relative">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <p className="font-mono text-[11px] font-bold text-[color:var(--cyber-cyan)] uppercase tracking-[0.35em] mb-5">
                À propos · Dakar, Sénégal
              </p>
              <Holo3DTitle
                as="h1"
                animateOnView={false}
                words={[
                  { t: "Bâtir" },
                  { t: "l'Afrique" },
                  { t: "digitale,", c: "text-holo" },
                  { t: "un" },
                  { t: "projet" },
                  { t: "à" },
                  { t: "la" },
                  { t: "fois.", c: "text-gradient" },
                ]}
                className="font-display font-extrabold mb-6 max-w-4xl text-[clamp(1.6rem,5vw,3.5rem)]"
              />
              <p className="text-base lg:text-lg text-white/75 max-w-2xl leading-relaxed">
                Well Done Services Company SARL conçoit, sécurise et opère des plateformes
                numériques. Ingénierie logicielle, cybersécurité, cloud et culture DevOps :
                une même équipe, du premier atelier jusqu'au run en production.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {["Kubernetes", "Docker", "CI/CD", "PostgreSQL", "Zero-Trust", "Cloudflare"].map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-[color:var(--cyber-cyan)]/40 bg-white/5 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-white/80 backdrop-blur"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="mt-9 flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-gradient-cyber shadow-cyber">
                  <Link to="/contact">Parler à un expert</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/25 bg-white/5 text-white hover:bg-white/10">
                  <Link to="/realisations">Voir nos réalisations</Link>
                </Button>
              </div>
            </div>

            <motion.div
              initial={reduce ? false : { opacity: 0, scale: 0.94 }}
              animate={reduce ? undefined : { opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-5"
            >
              <div className="relative rounded-3xl overflow-hidden ring-1 ring-white/15 shadow-cyber">
                <img
                  src={aboutTeam}
                  alt="Équipe d'ingénieurs Well Done Services en réunion technique à Dakar"
                  width={1600}
                  height={1008}
                  className="w-full h-[320px] lg:h-[420px] object-cover"
                />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#0b1226] via-[#0b1226]/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
                  <Terminal className="h-4 w-4 text-[color:var(--cyber-cyan)]" />
                  <p className="font-mono text-[11px] text-white/85">
                    build: passing · uptime 99.9% · équipe locale
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FOUNDER */}
      <section className="py-20 lg:py-28 relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 bg-grid-cyber opacity-[0.06]" />
        <div className="container mx-auto px-4 lg:px-8 relative">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={reduce ? false : { opacity: 0, x: -40 }}
              whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-5 relative"
            >
              <div className="relative max-w-md mx-auto lg:mx-0">
                <div className="absolute -top-6 -left-6 w-24 h-full bg-primary/90 rounded-2xl hidden sm:block" aria-hidden />
                <div className="absolute -bottom-8 -right-8 w-2/3 h-2/3 bg-gradient-primary rounded-2xl opacity-90 hidden sm:block" aria-hidden />
                <div
                  className="absolute -bottom-10 -right-12 w-28 h-28 hidden sm:block"
                  style={{
                    backgroundImage: "radial-gradient(currentColor 1.5px, transparent 1.5px)",
                    backgroundSize: "12px 12px",
                    color: "var(--primary-glow)",
                  }}
                  aria-hidden
                />

                <motion.div
                  whileHover={reduce ? undefined : { y: -6, rotateY: 4, rotateX: -3 }}
                  transition={{ duration: 0.4 }}
                  style={reduce ? undefined : { transformStyle: "preserve-3d" }}
                  className="relative rounded-2xl overflow-hidden shadow-elegant ring-1 ring-border bg-card"
                >
                  <img
                    src={portraitFounder}
                    alt="Portrait du fondateur de Well Done Services Company"
                    className="w-full h-[520px] object-cover object-top"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent pointer-events-none" />
                  {!reduce && (
                    <motion.div
                      aria-hidden
                      className="pointer-events-none absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-[color:var(--cyber-cyan)]/25 to-transparent"
                      initial={{ y: "-40%" }}
                      animate={{ y: "460%" }}
                      transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                    />
                  )}
                </motion.div>

                <motion.div
                  initial={reduce ? false : { opacity: 0, y: 20 }}
                  whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="absolute -bottom-6 left-6 bg-card border border-border rounded-xl shadow-soft px-5 py-3"
                >
                  <p className="font-display text-xs uppercase tracking-wider text-muted-foreground">Fondateur & CEO</p>
                  <p className="font-display text-base font-bold">Well Done Services</p>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={reduce ? false : { opacity: 0, x: 40 }}
              whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              className="lg:col-span-7"
            >
              <p className="font-mono text-[11px] font-bold text-primary uppercase tracking-[0.3em] mb-3">Le mot du fondateur</p>
              <Holo3DTitle
                words={[
                  { t: "Une" },
                  { t: "vision" },
                  { t: "claire,", c: "text-holo" },
                  { t: "une" },
                  { t: "exécution" },
                  { t: "sans", c: "text-gradient" },
                  { t: "compromis.", c: "text-gradient" },
                ]}
                className="font-display font-extrabold leading-tight mb-6 text-[clamp(1.4rem,4vw,3rem)]"
              />
              <div className="relative pl-6 border-l-4 border-primary/70 mb-6">
                <Quote className="absolute -left-3 -top-2 h-6 w-6 text-primary bg-background" />
                <p className="text-lg text-muted-foreground leading-relaxed italic">
                  « Notre ambition est d'offrir aux entreprises et aux institutions africaines des
                  outils numériques à la hauteur de leurs ambitions. Chaque projet est une
                  opportunité de prouver qu'excellence technique et impact local vont de pair. »
                </p>
              </div>
              <div className="grid sm:grid-cols-3 gap-4 mt-8">
                {[
                  { k: "5+", v: "Années d'expérience" },
                  { k: "50+", v: "Projets livrés" },
                  { k: "98%", v: "Satisfaction client" },
                ].map((s) => (
                  <div key={s.v} className="rounded-xl bg-surface border border-border p-5 hover:border-primary/40 transition-smooth">
                    <p className="font-display text-3xl font-extrabold text-primary">{s.k}</p>
                    <p className="text-sm text-muted-foreground mt-1">{s.v}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* DEVOPS CULTURE */}
      <section className="relative overflow-hidden bg-[#0b1226] py-20 lg:py-28 text-white">
        <div aria-hidden className="absolute inset-0 bg-gradient-mesh opacity-40" />
        <div className="container mx-auto px-4 lg:px-8 relative">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 30 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-6 order-2 lg:order-1"
            >
              <div className="relative rounded-3xl overflow-hidden ring-1 ring-white/15 shadow-cyber">
                <img
                  src={aboutDevops}
                  alt="Ingénieur DevOps supervisant des pipelines CI/CD sur un mur d'écrans"
                  width={1408}
                  height={1008}
                  loading="lazy"
                  className="w-full h-[300px] lg:h-[420px] object-cover"
                />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-tr from-[#0b1226]/70 via-transparent to-transparent" />
              </div>
            </motion.div>

            <div className="lg:col-span-6 order-1 lg:order-2">
              <p className="font-mono text-[11px] font-bold text-[color:var(--cyber-cyan)] uppercase tracking-[0.35em] mb-5">
                Culture d'ingénierie
              </p>
              <Holo3DTitle
                words={[
                  { t: "Le" },
                  { t: "DevOps", c: "text-holo" },
                  { t: "au" },
                  { t: "cœur" },
                  { t: "de" },
                  { t: "nos" },
                  { t: "livraisons.", c: "text-gradient" },
                ]}
                className="font-display font-bold leading-tight mb-6 text-[clamp(1.4rem,4vw,2.75rem)]"
              />
              <p className="text-white/75 leading-relaxed mb-8">
                Nous industrialisons chaque étape : du commit au monitoring. Résultat concret pour
                nos clients — des mises en production fréquentes, réversibles et sans stress.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                {devops.map((d, i) => (
                  <motion.div
                    key={d.k}
                    initial={reduce ? false : { opacity: 0, y: 20 }}
                    whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    whileHover={reduce ? undefined : { y: -5 }}
                    className="glass rounded-2xl border border-white/10 p-5"
                  >
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-cyber shadow-cyber mb-3">
                      <d.icon className="h-5 w-5 text-white" strokeWidth={1.75} />
                    </div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[color:var(--cyber-cyan)]">{d.k}</p>
                    <p className="font-display font-bold mt-1">{d.v}</p>
                    <p className="text-sm text-white/70 mt-1.5 leading-relaxed">{d.d}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DATACENTER PARALLAX BAND */}
      <section ref={bandRef} className="relative h-[320px] lg:h-[420px] overflow-hidden">
        <motion.img
          src={aboutDatacenter}
          alt="Allée de baies serveurs éclairée en bleu dans un datacenter"
          width={1600}
          height={912}
          loading="lazy"
          style={reduce ? undefined : { y: bandY }}
          className="absolute inset-0 h-[120%] w-full object-cover"
        />
        <div aria-hidden className="absolute inset-0 bg-[#0b1226]/70" />
        <div aria-hidden className="absolute inset-0 bg-grid-cyber opacity-20" />
        <div className="relative h-full container mx-auto px-4 lg:px-8 flex items-center">
          <div className="max-w-2xl text-white">
            <Holo3DTitle
              words={[
                { t: "Infrastructure" },
                { t: "sécurisée,", c: "text-holo" },
                { t: "disponible" },
                { t: "24/7.", c: "text-gradient" },
              ]}
              className="font-display font-bold text-[clamp(1.3rem,4vw,2.5rem)] mb-4"
            />
            <p className="text-white/80 text-sm lg:text-base">
              Hébergement redondant, sauvegardes chiffrées et supervision continue : vos services
              restent en ligne, même quand tout le reste bouge.
            </p>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-20 lg:py-28 bg-surface">
        <div className="container mx-auto px-4 lg:px-8">
          <p className="font-mono text-[11px] font-bold text-primary uppercase tracking-[0.3em] mb-4">Nos principes</p>
          <Holo3DTitle
            words={[
              { t: "Ce" },
              { t: "qui" },
              { t: "guide", c: "text-holo" },
              { t: "chacune" },
              { t: "de" },
              { t: "nos" },
              { t: "décisions.", c: "text-gradient" },
            ]}
            className="font-display font-bold mb-12 text-[clamp(1.3rem,3.8vw,2.25rem)]"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={reduce ? false : { opacity: 0, y: 24 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={reduce ? undefined : { y: -6 }}
                className="group relative overflow-hidden p-8 rounded-2xl bg-gradient-card border border-border hover:border-primary/40 hover:shadow-elegant transition-smooth"
              >
                <span
                  aria-hidden
                  className="absolute right-4 top-4 font-mono text-[10px] uppercase tracking-wider text-muted-foreground/60"
                >
                  {v.tag}
                </span>
                <div className="h-12 w-12 rounded-xl bg-gradient-primary text-primary-foreground flex items-center justify-center mb-5 group-hover:shadow-cyber transition-smooth">
                  <v.icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-xl font-bold mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US + SHIELD */}
      <section className="pb-24 pt-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="rounded-3xl bg-surface p-10 lg:p-16 border border-border relative overflow-hidden">
            <div aria-hidden className="absolute inset-0 bg-grid-cyber opacity-[0.07]" />
            <div className="relative grid lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7">
                <Holo3DTitle
                  words={[
                    { t: "Pourquoi" },
                    { t: "choisir", c: "text-holo" },
                    { t: "Well" },
                    { t: "Done" },
                    { t: "Services", c: "text-gradient" },
                    { t: "?" },
                  ]}
                  className="font-display font-bold mb-5 text-[clamp(1.3rem,3.8vw,2.25rem)]"
                />
                <ul className="space-y-3 text-muted-foreground">
                  <li>✓ Une équipe locale basée à Dakar, qui comprend votre contexte.</li>
                  <li>✓ Plus de 50 projets livrés avec 98% de satisfaction client.</li>
                  <li>✓ Une approche orientée résultats, mesurés et documentés.</li>
                  <li>✓ Un support technique continu après la mise en production.</li>
                  <li>✓ Des tarifs transparents et adaptés au marché africain.</li>
                </ul>
                <Button asChild size="lg" className="mt-8 bg-gradient-primary">
                  <Link to="/contact">
                    Travailler avec nous <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="lg:col-span-5">
                <CyberShield className="mx-auto max-w-sm" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
