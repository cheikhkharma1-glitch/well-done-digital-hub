import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/realisations/$slug")({
  component: ProjectPage,
  notFoundComponent: () => (
    <SiteLayout>
      <div className="container mx-auto px-4 py-32 text-center">
        <h1 className="font-display text-3xl font-bold mb-4">Projet introuvable</h1>
        <Button asChild><Link to="/realisations">Retour au portfolio</Link></Button>
      </div>
    </SiteLayout>
  ),
});

type Project = {
  id: string;
  title: string;
  description: string;
  category: string;
  image_url: string | null;
  technologies: string[] | null;
  results: string | null;
  client_name: string | null;
  project_url: string | null;
};

function ProjectPage() {
  const { slug } = Route.useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("projects")
      .select("id,title,description,category,image_url,technologies,results,client_name,project_url")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle()
      .then(({ data }) => {
        setProject(data);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <SiteLayout><div className="container mx-auto px-4 py-32 text-center text-muted-foreground">Chargement…</div></SiteLayout>;
  if (!project) throw notFound();

  return (
    <SiteLayout>
      <article className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
          <Link to="/realisations" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8">
            <ArrowLeft className="h-4 w-4" /> Retour au portfolio
          </Link>
          <p className="text-sm font-semibold text-primary-glow uppercase tracking-wider mb-3">{project.category}</p>
          <h1 className="font-display text-4xl lg:text-6xl font-extrabold mb-6">{project.title}</h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-10">{project.description}</p>

          {project.image_url && (
            <div className="rounded-2xl overflow-hidden border border-border mb-10">
              <img src={project.image_url} alt={project.title} className="w-full" />
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-6 p-8 rounded-2xl bg-surface border border-border mb-10">
            {project.client_name && (
              <div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Client</div>
                <div className="font-medium">{project.client_name}</div>
              </div>
            )}
            <div>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Catégorie</div>
              <div className="font-medium">{project.category}</div>
            </div>
            {project.project_url && (
              <div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Site</div>
                <a href={project.project_url} target="_blank" rel="noopener noreferrer" className="font-medium text-primary inline-flex items-center gap-1 hover:underline">
                  Visiter <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            )}
          </div>

          {project.technologies && project.technologies.length > 0 && (
            <div className="mb-10">
              <h2 className="font-display text-xl font-bold mb-4">Technologies</h2>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((t) => (
                  <span key={t} className="px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-medium">{t}</span>
                ))}
              </div>
            </div>
          )}

          {project.results && (
            <div className="p-8 rounded-2xl bg-gradient-hero text-primary-foreground">
              <h2 className="font-display text-xl font-bold mb-3 text-primary-glow">Résultats obtenus</h2>
              <p className="text-lg">{project.results}</p>
            </div>
          )}

          <div className="mt-12 text-center">
            <Button asChild size="lg" className="bg-gradient-primary"><Link to="/contact">Démarrer un projet similaire</Link></Button>
          </div>
        </div>
      </article>
    </SiteLayout>
  );
}
