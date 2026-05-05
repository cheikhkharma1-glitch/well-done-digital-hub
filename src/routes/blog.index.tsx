import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Sparkles, ArrowUpRight, Calendar, Tag } from "lucide-react";
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
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    supabase
      .from("articles")
      .select("id,title,slug,excerpt,category,cover_image_url,published_at")
      .eq("published", true)
      .order("published_at", { ascending: false })
      .then(({ data }) => setArticles(data ?? []));
  }, []);

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : 24 },
    visible: (i: number = 0) => ({
      opacity: 1, y: 0,
      transition: { duration: 0.6, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] },
    }),
  };
  const stagger: Variants = { hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } };

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-hero text-primary-foreground">
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full blur-3xl"
          style={{ background: "var(--gradient-cyber)", opacity: 0.35 }}
          animate={prefersReduced ? undefined : { x: [0, 60, 0], y: [0, 40, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -bottom-40 -right-32 h-[28rem] w-[28rem] rounded-full bg-[oklch(0.82_0.16_210)]/25 blur-3xl"
          animate={prefersReduced ? undefined : { x: [0, -50, 0], y: [0, -30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <div aria-hidden className="absolute inset-0 bg-grid-cyber opacity-30" />

        <div className="relative container mx-auto px-4 lg:px-8 py-24 lg:py-32">
          <motion.div variants={stagger} initial="hidden" animate="visible" className="max-w-3xl">
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-[oklch(0.82_0.16_210)]/40 backdrop-blur-sm mb-6"
            >
              <Sparkles className="h-3.5 w-3.5 text-[oklch(0.82_0.16_210)]" />
              <span className="text-xs font-bold uppercase tracking-widest text-white/90">Insights & Actualités</span>
            </motion.div>
            <motion.h1
              variants={fadeUp}
              className="font-display text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] mb-6"
            >
              Le <span className="text-cyber">blog tech</span> qui éclaire votre transformation.
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg lg:text-xl text-white/80 max-w-2xl leading-relaxed">
              Conseils IT, cybersécurité, études de cas — décodés par nos experts.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* GRID */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-7"
          >
            {articles.map((a, i) => (
              <motion.div key={a.id} custom={i} variants={fadeUp}>
                <Link
                  to="/blog/$slug"
                  params={{ slug: a.slug }}
                  className="group relative block rounded-2xl overflow-hidden bg-card border border-border hover:border-[oklch(0.82_0.16_210)]/60 transition-all duration-500 hover:-translate-y-1 hover:shadow-cyber"
                >
                  {/* top scan line */}
                  <div
                    aria-hidden
                    className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-cyber scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700"
                  />
                  <div className="aspect-[16/10] bg-gradient-primary relative overflow-hidden">
                    {a.cover_image_url ? (
                      <img
                        src={a.cover_image_url}
                        alt={a.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-primary flex items-center justify-center">
                        <span className="font-display text-6xl text-white/20">{a.title[0]}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute top-3 right-3 h-9 w-9 rounded-full bg-[oklch(0.82_0.16_210)] text-[oklch(0.18_0.08_265)] flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-500">
                      <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                      <span className="inline-flex items-center gap-1 font-bold text-[oklch(0.62_0.2_255)] uppercase tracking-widest">
                        <Tag className="h-3 w-3" /> {a.category}
                      </span>
                      {a.published_at && (
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(a.published_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      )}
                    </div>
                    <h3 className="font-display text-xl font-bold mb-3 group-hover:text-[oklch(0.62_0.2_255)] transition-colors duration-300">
                      {a.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-3">{a.excerpt}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </SiteLayout>
  );
}
