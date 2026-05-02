import { createFileRoute, Link } from "@tanstack/react-router";
import { Target, Eye, Heart, Award } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";

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

      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="p-8 rounded-2xl bg-gradient-card border border-border">
                <div className="h-12 w-12 rounded-xl bg-gradient-primary text-primary-foreground flex items-center justify-center mb-5">
                  <v.icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-xl font-bold mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-24">
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
