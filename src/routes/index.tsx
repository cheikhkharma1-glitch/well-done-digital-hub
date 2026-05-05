import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight, Code2, Database, Network, GraduationCap, CheckCircle2, Sparkles, Quote } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
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

const services = [
  { icon: Code2, title: "Développement Web", desc: "Sites vitrines, e-commerce, applications web et landing pages performantes." },
  { icon: Database, title: "Solutions logicielles", desc: "ERP, CRM, logiciels métiers et solutions SaaS sur mesure." },
  { icon: Network, title: "Maintenance & Réseaux", desc: "Maintenance informatique, gestion réseau et support technique réactif." },
  { icon: GraduationCap, title: "Gestion scolaire", desc: "Élèves, notes, communication parents-école et statistiques avancées." },
];

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
          <motion.div variants={stagger} initial="hidden" animate="visible" className="max-w-4xl">
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2 rounded-full border border-[oklch(0.82_0.16_210)]/40 bg-primary-foreground/10 backdrop-blur px-4 py-1.5 text-xs lg:text-sm text-primary-foreground/90 mb-6"
            >
              <Sparkles className="h-3.5 w-3.5 text-[oklch(0.82_0.16_210)]" />
              <span>Acteur de la transformation digitale en Afrique</span>
            </motion.div>
            <motion.h1
              variants={fadeUp}
              className="font-display text-4xl sm:text-5xl lg:text-7xl font-extrabold text-primary-foreground leading-[1.05] mb-6"
            >
              Des solutions IT
              <br />
              <span className="relative inline-block">
                <span className="text-cyber">qui transforment</span>
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
            <motion.p variants={fadeUp} className="text-base lg:text-xl text-primary-foreground/80 max-w-2xl leading-relaxed mb-10">
              Well Done Services Company conçoit et déploie des solutions web, logicielles et réseau sur mesure pour les PME, écoles, administrations et startups au Sénégal et en Afrique.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="bg-gradient-cyber text-white hover:opacity-90 shadow-cyber hover:-translate-y-0.5 transition-all">
                <Link to="/contact">Demander un devis <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent">
                <Link to="/services">Découvrir nos services</Link>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10"
          >
            {stats.map((s, i) => (
              <motion.div key={s.label} custom={i} variants={fadeUp} className="border-l-2 border-[oklch(0.82_0.16_210)]/60 pl-4">
                <div className="font-display text-3xl lg:text-5xl font-bold text-primary-foreground">{s.value}</div>
                <div className="text-xs lg:text-sm text-primary-foreground/70 mt-1">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
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
            className="max-w-2xl mb-14"
          >
            <p className="text-sm font-bold text-[oklch(0.62_0.2_255)] uppercase tracking-widest mb-3">Nos expertises</p>
            <h2 className="font-display text-3xl lg:text-5xl font-bold mb-4">
              Une offre <span className="text-cyber">complète</span> pour digitaliser votre activité.
            </h2>
            <p className="text-muted-foreground text-lg">
              Du site vitrine à l'ERP métier, en passant par la gestion scolaire et l'infrastructure réseau.
            </p>
          </motion.div>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {services.map((s, i) => (
              <motion.div
                key={s.title}
                custom={i}
                variants={fadeUp}
                whileHover={prefersReduced ? undefined : { y: -6 }}
                transition={{ type: "spring", stiffness: 220, damping: 22 }}
                className="group relative p-6 lg:p-8 rounded-2xl bg-gradient-card border border-border hover:border-[oklch(0.82_0.16_210)]/60 hover:shadow-cyber transition-all duration-500 overflow-hidden"
              >
                <div aria-hidden className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-[oklch(0.82_0.16_210)]/15 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div aria-hidden className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-cyber scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700" />
                <div className="relative h-12 w-12 rounded-xl bg-gradient-cyber text-white flex items-center justify-center mb-5 shadow-cyber transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                  <s.icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-lg font-bold mb-2 relative">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed relative">{s.desc}</p>
              </motion.div>
            ))}
          </motion.div>
          <div className="mt-10">
            <Button asChild variant="ghost" className="group hover:text-[oklch(0.62_0.2_255)]">
              <Link to="/services">Voir tous les services <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-smooth" /></Link>
            </Button>
          </div>
        </div>
      </section>

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

      {/* MOT DU PDG */}
      <section className="py-24 lg:py-32 relative overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Photo */}
            <div className="relative animate-fade-in">
              <div className="absolute -top-6 -left-6 w-24 h-24 grid grid-cols-5 gap-1.5 opacity-60">
                {Array.from({ length: 25 }).map((_, i) => (
                  <span key={i} className="w-1.5 h-1.5 rounded-full bg-primary" />
                ))}
              </div>
              <div className="absolute -top-4 right-8 w-16 h-[110%] bg-primary/90 rounded-sm hidden lg:block" />
              <div className="absolute -bottom-6 -right-6 w-24 h-24 grid grid-cols-5 gap-1.5 opacity-60">
                {Array.from({ length: 25 }).map((_, i) => (
                  <span key={i} className="w-1.5 h-1.5 rounded-full bg-primary" />
                ))}
              </div>
              <div className="relative rounded-2xl overflow-hidden shadow-elegant ring-1 ring-border hover-scale">
                <img
                  src={ceoImg}
                  alt="M. Cheikh Mbacke Kharma — Président Directeur Général de Well Done Services Company"
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>

            {/* Texte */}
            <div className="animate-fade-in [animation-delay:150ms]">
              <p className="text-sm font-semibold text-primary-glow uppercase tracking-wider mb-3">Mot du Président</p>
              <h2 className="font-display text-3xl lg:text-5xl font-bold mb-8 leading-tight">
                Une vision <span className="text-gradient">tournée vers l'avenir</span>.
              </h2>
              <div className="relative pl-6 border-l-2 border-primary/30">
                <Quote className="absolute -top-2 -left-3 h-8 w-8 text-primary bg-background p-1" />
                <p className="text-base lg:text-lg text-foreground/85 leading-relaxed italic">
                  Passionné par l'innovation technologique, je m'engage pleinement dans la transformation digitale des entreprises. Avec une solide compréhension des enjeux numériques et des processus métiers, je mets mes compétences au service de solutions durables, agiles et orientées résultats.
                </p>
                <p className="mt-4 text-base lg:text-lg text-foreground/85 leading-relaxed italic">
                  Ma vision : faire du digital un levier de performance et de croissance pour chaque organisation. Résolument tourné vers l'avenir, je crois en l'alliance entre technologie, stratégie et intelligence collective pour bâtir un monde plus connecté, efficace et humain.
                </p>
              </div>
              <div className="mt-8 flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-display font-bold text-lg shadow-glow">
                  CK
                </div>
                <div>
                  <div className="font-display font-bold text-lg">M. Cheikh Mbacke Kharma</div>
                  <div className="text-sm text-muted-foreground">Président Directeur Général</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
                  <Link to="/realisations">Voir nos réalisations</Link>
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
    </SiteLayout>
  );
}
