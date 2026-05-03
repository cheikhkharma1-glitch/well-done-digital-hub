import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Code2, Database, Network, GraduationCap, CheckCircle2, Sparkles, Quote, Linkedin } from "lucide-react";
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

  useEffect(() => {
    supabase
      .from("projects")
      .select("id,title,slug,description,category,image_url")
      .eq("published", true)
      .order("display_order", { ascending: true })
      .limit(3)
      .then(({ data }) => setProjects(data ?? []));
  }, []);

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden -mt-16 lg:-mt-20 pt-28 lg:pt-36 pb-24 lg:pb-32">
        <div className="absolute inset-0 -z-10">
          <img src={heroImg} alt="" width={1920} height={1080} className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-hero opacity-90" />
          <div className="absolute inset-0 bg-gradient-glow" />
        </div>

        <div className="container mx-auto px-4 lg:px-8 relative">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 backdrop-blur px-4 py-1.5 text-xs lg:text-sm text-primary-foreground/90 mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Acteur de la transformation digitale en Afrique</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-extrabold text-primary-foreground leading-[1.05] mb-6">
              Des solutions IT
              <br />
              <span className="bg-gradient-to-r from-primary-foreground to-[oklch(0.85_0.08_240)] bg-clip-text text-transparent">
                qui transforment
              </span>{" "}
              votre entreprise.
            </h1>
            <p className="text-base lg:text-xl text-primary-foreground/80 max-w-2xl leading-relaxed mb-10">
              Well Done Services Company conçoit et déploie des solutions web, logicielles et réseau sur mesure pour les PME, écoles, administrations et startups au Sénégal et en Afrique.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-glow">
                <Link to="/contact">Demander un devis <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent">
                <Link to="/services">Découvrir nos services</Link>
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10">
            {stats.map((s) => (
              <div key={s.label} className="border-l-2 border-primary-foreground/30 pl-4">
                <div className="font-display text-3xl lg:text-5xl font-bold text-primary-foreground">{s.value}</div>
                <div className="text-xs lg:text-sm text-primary-foreground/70 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-2xl mb-14">
            <p className="text-sm font-semibold text-primary-glow uppercase tracking-wider mb-3">Nos expertises</p>
            <h2 className="font-display text-3xl lg:text-5xl font-bold mb-4">
              Une offre <span className="text-gradient">complète</span> pour digitaliser votre activité.
            </h2>
            <p className="text-muted-foreground text-lg">
              Du site vitrine à l'ERP métier, en passant par la gestion scolaire et l'infrastructure réseau.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s) => (
              <div key={s.title} className="group p-6 lg:p-8 rounded-2xl bg-gradient-card border border-border hover:border-primary-glow/50 hover:shadow-elegant transition-smooth">
                <div className="h-12 w-12 rounded-xl bg-gradient-primary text-primary-foreground flex items-center justify-center mb-5 group-hover:shadow-glow transition-smooth">
                  <s.icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-lg font-bold mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <Button asChild variant="ghost" className="group">
              <Link to="/services">Voir tous les services <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-smooth" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* PROJETS */}
      <section className="py-24 lg:py-32 bg-surface">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold text-primary-glow uppercase tracking-wider mb-3">Réalisations</p>
              <h2 className="font-display text-3xl lg:text-5xl font-bold">Nos projets <span className="text-gradient">récents</span>.</h2>
            </div>
            <Button asChild variant="outline">
              <Link to="/realisations">Voir le portfolio complet</Link>
            </Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p) => (
              <Link
                to="/realisations/$slug"
                params={{ slug: p.slug }}
                key={p.id}
                className="group rounded-2xl overflow-hidden bg-card border border-border hover:shadow-elegant transition-smooth"
              >
                <div className="aspect-[4/3] bg-gradient-primary relative overflow-hidden">
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-primary flex items-center justify-center">
                      <span className="font-display text-6xl text-primary-foreground/30">{p.title[0]}</span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <p className="text-xs font-medium text-primary-glow uppercase tracking-wider mb-2">{p.category}</p>
                  <h3 className="font-display text-lg font-bold mb-2 group-hover:text-primary transition-smooth">{p.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{p.description}</p>
                </div>
              </Link>
            ))}
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
