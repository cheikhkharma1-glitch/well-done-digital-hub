import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Blog & actualités — Well Done Services Company" },
      { name: "description", content: "Conseils IT, cybersécurité, transformation digitale et études de cas par les experts de Well Done Services." },
    ],
  }),
  component: BlogIndex,
});

type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  cover_image_url: string | null;
  published_at: string | null;
};

function BlogIndex() {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    supabase
      .from("articles")
      .select("id,title,slug,excerpt,category,cover_image_url,published_at")
      .eq("published", true)
      .order("published_at", { ascending: false })
      .then(({ data }) => setArticles(data ?? []));
  }, []);

  return (
    <SiteLayout>
      <section className="py-20 lg:py-28 bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 lg:px-8">
          <p className="text-sm font-semibold text-primary-glow uppercase tracking-wider mb-3">Blog</p>
          <h1 className="font-display text-4xl lg:text-6xl font-extrabold mb-5 max-w-3xl">Insights, conseils & études de cas.</h1>
          <p className="text-lg text-primary-foreground/80 max-w-2xl">Tout pour comprendre et accélérer votre transformation digitale.</p>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((a) => (
              <Link
                to="/blog/$slug"
                params={{ slug: a.slug }}
                key={a.id}
                className="group rounded-2xl overflow-hidden bg-card border border-border hover:shadow-elegant transition-smooth"
              >
                <div className="aspect-[16/10] bg-gradient-primary relative">
                  {a.cover_image_url ? (
                    <img src={a.cover_image_url} alt={a.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-primary" />
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                    <span className="font-medium text-primary-glow uppercase tracking-wider">{a.category}</span>
                    {a.published_at && <span>· {new Date(a.published_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}</span>}
                  </div>
                  <h3 className="font-display text-xl font-bold mb-3 group-hover:text-primary transition-smooth">{a.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">{a.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
