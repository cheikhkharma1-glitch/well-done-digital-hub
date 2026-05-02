import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/realisations/")({
  head: () => ({
    meta: [
      { title: "Réalisations & portfolio — Well Done Services Company" },
      { name: "description", content: "Découvrez nos projets : plateformes de gestion scolaire, ERP, CRM, sites web et applications développés au Sénégal." },
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

function PortfolioPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState<string>("Tous");

  useEffect(() => {
    supabase
      .from("projects")
      .select("id,title,slug,description,category,image_url,technologies")
      .eq("published", true)
      .order("display_order", { ascending: true })
      .then(({ data }) => setProjects(data ?? []));
  }, []);

  const cats = ["Tous", ...Array.from(new Set(projects.map((p) => p.category)))];
  const visible = filter === "Tous" ? projects : projects.filter((p) => p.category === filter);

  return (
    <SiteLayout>
      <section className="py-20 lg:py-28 bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 lg:px-8">
          <p className="text-sm font-semibold text-primary-glow uppercase tracking-wider mb-3">Portfolio</p>
          <h1 className="font-display text-4xl lg:text-6xl font-extrabold mb-5 max-w-3xl">Nos réalisations qui parlent d'elles-mêmes.</h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl">
            Chaque projet est une preuve concrète de notre engagement et de notre expertise.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-wrap gap-2 mb-10">
            {cats.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-smooth ${
                  filter === c ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground hover:bg-accent"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visible.map((p) => (
              <Link
                to="/realisations/$slug"
                params={{ slug: p.slug }}
                key={p.id}
                className="group rounded-2xl overflow-hidden bg-card border border-border hover:shadow-elegant transition-smooth"
              >
                <div className="aspect-[4/3] bg-gradient-primary relative">
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-primary flex items-center justify-center">
                      <span className="font-display text-7xl text-primary-foreground/30">{p.title[0]}</span>
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
    </SiteLayout>
  );
}
