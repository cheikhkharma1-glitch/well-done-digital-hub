import { createFileRoute, Link } from "@tanstack/react-router";
import { Target, Eye, Heart, Award, Quote } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import portraitFounder from "@/assets/portrait-founder.png";

export const Route = createFileRoute("/a-propos")({
  head: () => ({
    meta: [
      { title: "À propos — Well Done Services Company" },
      { name: "description", content: "Notre mission, notre vision et nos valeurs : accélérer la transformation digitale au Sénégal et en Afrique." },
    ],
  }),
  component: AboutPage,
});

const values = [
  { icon: Target, title: "Mission", text: "Accompagner PME, écoles et administrations dans leur transition numérique avec des solutions sur mesure." },
  { icon: Eye, title: "Vision", text: "Devenir l'acteur de référence de la transformation digitale en Afrique de l'Ouest." },
  { icon: Heart, title: "Valeurs", text: "Excellence, écoute, transparence et engagement long terme avec chaque client." },
  { icon: Award, title: "Engagement", text: "Livrer dans les délais, avec qualité, et assurer un support continu après mise en production." },
];

function AboutPage() {
  const reduce = useReducedMotion();
  return (
    <SiteLayout>
      <section className="py-20 lg:py-28 bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 lg:px-8">
          <p className="text-sm font-semibold text-primary-glow uppercase tracking-wider mb-3">À propos</p>
          <h1 className="font-display text-4xl lg:text-6xl font-extrabold mb-6 max-w-3xl">Bâtir l'Afrique digitale, un projet à la fois.</h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl">
            Well Done Services Company SARL est une société sénégalaise spécialisée dans les solutions IT et digitales. Depuis plus de 5 ans, nous accompagnons nos clients dans leur transformation numérique.
          </p>
        </div>
      </section>

      {/* Founder portrait section */}
      <section className="py-20 lg:py-28 relative overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Portrait */}
            <motion.div
              initial={reduce ? false : { opacity: 0, x: -40 }}
              whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-5 relative"
            >
              <div className="relative max-w-md mx-auto lg:mx-0">
                {/* Decorative blocks */}
                <div className="absolute -top-6 -left-6 w-24 h-full bg-primary/90 rounded-2xl hidden sm:block" aria-hidden />
                <div className="absolute -bottom-8 -right-8 w-2/3 h-2/3 bg-gradient-primary rounded-2xl opacity-90 hidden sm:block" aria-hidden />
                {/* Dotted pattern */}
                <div
                  className="absolute -bottom-10 -right-12 w-28 h-28 hidden sm:block"
                  style={{
                    backgroundImage: "radial-gradient(currentColor 1.5px, transparent 1.5px)",
                    backgroundSize: "12px 12px",
                    color: "var(--primary-glow)",
                  }}
                  aria-hidden
                />

                {/* Image card */}
                <motion.div
                  whileHover={reduce ? undefined : { y: -6 }}
                  transition={{ duration: 0.4 }}
                  className="relative rounded-2xl overflow-hidden shadow-elegant ring-1 ring-border bg-card"
                >
                  <img
                    src={portraitFounder}
                    alt="Portrait du fondateur de Well Done Services Company"
                    className="w-full h-[520px] object-cover object-top"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent pointer-events-none" />
                </motion.div>

                {/* Floating badge */}
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

            {/* Content */}
            <motion.div
              initial={reduce ? false : { opacity: 0, x: 40 }}
              whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              className="lg:col-span-7"
            >
              <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Le mot du fondateur</p>
              <h2 className="font-display text-3xl lg:text-5xl font-extrabold leading-tight mb-6">
                Une vision claire, une exécution <span className="text-gradient">sans compromis</span>.
              </h2>
              <div className="relative pl-6 border-l-4 border-primary/70 mb-6">
                <Quote className="absolute -left-3 -top-2 h-6 w-6 text-primary bg-background" />
                <p className="text-lg text-muted-foreground leading-relaxed italic">
                  « Notre ambition est d'offrir aux entreprises et aux institutions africaines des outils numériques à la hauteur de leurs ambitions. Chaque projet est une opportunité de prouver qu'excellence technique et impact local vont de pair. »
                </p>
              </div>
              <div className="grid sm:grid-cols-3 gap-4 mt-8">
                {[
                  { k: "5+", v: "Années d'expérience" },
                  { k: "50+", v: "Projets livrés" },
                  { k: "98%", v: "Satisfaction client" },
                ].map((s) => (
                  <div key={s.v} className="rounded-xl bg-surface border border-border p-5">
                    <p className="font-display text-3xl font-extrabold text-primary">{s.k}</p>
                    <p className="text-sm text-muted-foreground mt-1">{s.v}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28 bg-surface">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={reduce ? false : { opacity: 0, y: 24 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="p-8 rounded-2xl bg-gradient-card border border-border hover:shadow-elegant transition-smooth"
              >
                <div className="h-12 w-12 rounded-xl bg-gradient-primary text-primary-foreground flex items-center justify-center mb-5">
                  <v.icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-xl font-bold mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-24 pt-4">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="rounded-3xl bg-surface p-10 lg:p-16 border border-border">
            <div className="max-w-2xl">
              <h2 className="font-display text-3xl lg:text-4xl font-bold mb-5">Pourquoi choisir Well Done Services ?</h2>
              <ul className="space-y-3 text-muted-foreground">
                <li>✓ Une équipe locale basée à Dakar, qui comprend votre contexte.</li>
                <li>✓ Plus de 50 projets livrés avec 98% de satisfaction client.</li>
                <li>✓ Une approche orientée résultats, mesurés et documentés.</li>
                <li>✓ Un support technique continu après la mise en production.</li>
                <li>✓ Des tarifs transparents et adaptés au marché africain.</li>
              </ul>
              <Button asChild size="lg" className="mt-8 bg-gradient-primary"><Link to="/contact">Travailler avec nous</Link></Button>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
