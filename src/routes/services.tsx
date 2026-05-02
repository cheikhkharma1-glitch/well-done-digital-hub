import { createFileRoute, Link } from "@tanstack/react-router";
import { Code2, Database, Network, GraduationCap, Check, ArrowRight } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Nos services IT — Well Done Services Company" },
      { name: "description", content: "Développement web, ERP, CRM, gestion scolaire, maintenance et réseaux : nos expertises pour digitaliser votre entreprise au Sénégal." },
    ],
  }),
  component: ServicesPage,
});

const services = [
  {
    icon: Code2,
    title: "Développement Web",
    desc: "Nous concevons des sites et applications web modernes, rapides et orientés conversion.",
    items: ["Sites vitrines & corporate", "Sites e-commerce avec mobile money", "Applications web sur mesure", "Landing pages haute conversion"],
  },
  {
    icon: Database,
    title: "Solutions logicielles",
    desc: "ERP, CRM et logiciels métiers conçus pour vos processus réels.",
    items: ["ERP — gestion intégrée", "CRM commercial & marketing", "Logiciels métiers personnalisés", "Solutions SaaS multi-clients"],
  },
  {
    icon: Network,
    title: "Maintenance & Réseaux",
    desc: "Une infrastructure stable et sécurisée, supervisée par nos experts.",
    items: ["Maintenance informatique", "Gestion réseau & VPN", "Support technique réactif", "Audit & cybersécurité"],
  },
  {
    icon: GraduationCap,
    title: "Gestion scolaire",
    desc: "Une plateforme tout-en-un pour piloter votre établissement.",
    items: ["Gestion des élèves & inscriptions", "Notes & bulletins automatisés", "Communication parents-école", "Statistiques & tableaux de bord"],
  },
];

function ServicesPage() {
  return (
    <SiteLayout>
      <section className="py-20 lg:py-28 bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 lg:px-8">
          <p className="text-sm font-semibold text-primary-glow uppercase tracking-wider mb-3">Nos services</p>
          <h1 className="font-display text-4xl lg:text-6xl font-extrabold mb-5 max-w-3xl">Une expertise IT à 360° pour faire grandir votre activité.</h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl">
            Nous combinons développement, conseil et support pour livrer des solutions concrètes, mesurables et durables.
          </p>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8 grid md:grid-cols-2 gap-6 lg:gap-8">
          {services.map((s) => (
            <div key={s.title} className="p-8 lg:p-10 rounded-3xl bg-gradient-card border border-border shadow-soft hover:shadow-elegant transition-smooth">
              <div className="h-14 w-14 rounded-2xl bg-gradient-primary text-primary-foreground flex items-center justify-center mb-6 shadow-glow">
                <s.icon className="h-7 w-7" />
              </div>
              <h2 className="font-display text-2xl lg:text-3xl font-bold mb-3">{s.title}</h2>
              <p className="text-muted-foreground mb-6">{s.desc}</p>
              <ul className="space-y-3">
                {s.items.map((it) => (
                  <li key={it} className="flex items-start gap-3 text-sm">
                    <Check className="h-5 w-5 text-primary-glow shrink-0 mt-0.5" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="pb-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="rounded-3xl bg-foreground text-background p-10 lg:p-16 text-center">
            <h2 className="font-display text-3xl lg:text-4xl font-bold mb-4">Un projet en tête ?</h2>
            <p className="opacity-80 mb-8 max-w-xl mx-auto">Décrivez-nous votre besoin, nous revenons vers vous sous 48h avec une proposition adaptée.</p>
            <Button asChild size="lg" className="bg-gradient-primary">
              <Link to="/contact">Démarrer un projet <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
