import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/blog/$slug")({
  component: ArticlePage,
  notFoundComponent: () => (
    <SiteLayout>
      <div className="container mx-auto px-4 py-32 text-center">
        <h1 className="font-display text-3xl font-bold mb-4">Article introuvable</h1>
        <Button asChild><Link to="/blog">Retour au blog</Link></Button>
      </div>
    </SiteLayout>
  ),
});

type Article = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  cover_image_url: string | null;
  published_at: string | null;
};

function ArticlePage() {
  const { slug } = Route.useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("articles")
      .select("id,title,excerpt,content,category,cover_image_url,published_at")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle()
      .then(({ data }) => {
        setArticle(data);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <SiteLayout><div className="container mx-auto px-4 py-32 text-center text-muted-foreground">Chargement…</div></SiteLayout>;
  if (!article) throw notFound();

  return (
    <SiteLayout>
      <article className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8">
            <ArrowLeft className="h-4 w-4" /> Tous les articles
          </Link>
          <p className="text-sm font-semibold text-primary-glow uppercase tracking-wider mb-3">{article.category}</p>
          <h1 className="font-display text-4xl lg:text-5xl font-extrabold mb-4">{article.title}</h1>
          {article.published_at && (
            <p className="text-sm text-muted-foreground mb-8">
              Publié le {new Date(article.published_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          )}
          <p className="text-lg text-muted-foreground leading-relaxed mb-10">{article.excerpt}</p>
          {article.cover_image_url && (
            <div className="rounded-2xl overflow-hidden border border-border mb-10">
              <img src={article.cover_image_url} alt={article.title} className="w-full" />
            </div>
          )}
          <div className="prose prose-lg max-w-none">
            {article.content.split("\n").map((line, i) => {
              if (line.startsWith("## ")) return <h2 key={i} className="font-display text-2xl font-bold mt-8 mb-3">{line.replace("## ", "")}</h2>;
              if (line.trim() === "") return null;
              if (/^\d+\. /.test(line) || line.startsWith("- ")) return <p key={i} className="my-2 text-foreground/85">{line}</p>;
              return <p key={i} className="my-4 text-foreground/85 leading-relaxed">{line}</p>;
            })}
          </div>
          <div className="mt-16 p-8 rounded-2xl bg-gradient-hero text-primary-foreground text-center">
            <h3 className="font-display text-2xl font-bold mb-3">Un projet IT en tête ?</h3>
            <p className="opacity-80 mb-5">Discutons-en. Réponse sous 48h, devis gratuit.</p>
            <Button asChild className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"><Link to="/contact">Nous contacter</Link></Button>
          </div>
        </div>
      </article>
    </SiteLayout>
  );
}
