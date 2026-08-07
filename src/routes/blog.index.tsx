import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion, type Variants } from "framer-motion";
import { Sparkles, ArrowUpRight, Calendar, Tag, Search, Terminal, Clock, BookOpen } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { TechNewsFeed } from "@/components/site/TechNewsFeed";
import { supabase } from "@/integrations/supabase/client";

const SITE_URL = "https://well-done-digital-hub.lovable.app";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Blog cybersécurité, dev web & mobile — Well Done Services" },
      { name: "description", content: "Analyses, tutoriels et études de cas par les experts Well Done Services : cybersécurité défensive, développement web et mobile, transformation digitale." },
      { property: "og:title", content: "Blog Well Done Services — Cybersécurité, Web & Mobile" },
      { property: "og:description", content: "Conseils IT, cybersécurité, transformation digitale et études de cas." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/blog` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/blog` }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Blog",
        name: "Blog Well Done Services Company",
        url: `${SITE_URL}/blog`,
        description: "Cybersécurité défensive, développement web & mobile, transformation digitale.",
        publisher: { "@type": "Organization", name: "Well Done Services Company", url: SITE_URL },
      }),
    }],
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

function readingTime(text: string | null) {
  if (!text) return "3 min";
  const words = text.split(/\s+/).length;
  return `${Math.max(2, Math.round(words / 60))} min`;
}

function BlogIndex() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("Tous");
  const [query, setQuery] = useState("");
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    supabase
      .from("articles")
      .select("id,title,slug,excerpt,category,cover_image_url,published_at")
      .eq("published", true)
      .order("published_at", { ascending: false })
      .then(({ data }) => {
        setArticles(data ?? []);
        setLoading(false);
      });
  }, []);

  const cats = useMemo(
    () => ["Tous", ...Array.from(new Set(articles.map((a) => a.category).filter(Boolean)))],
    [articles],
  );

  const filtered = useMemo(() => {
    let list = filter === "Tous" ? articles : articles.filter((a) => a.category === filter);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.excerpt?.toLowerCase().includes(q) ||
          a.category?.toLowerCase().includes(q),
      );
    }
    return list;
  }, [articles, filter, query]);

  const featured = filtered[0];
  const rest = filtered.slice(1);

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
        {/* Scanning line */}
        <motion.div
          aria-hidden
          className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-[oklch(0.82_0.16_210)] to-transparent"
          initial={{ top: "0%" }}
          animate={prefersReduced ? undefined : { top: ["0%", "100%"] }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />

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

            {/* Terminal-style stat strip */}
            <motion.div
              variants={fadeUp}
              className="mt-10 inline-flex items-center gap-4 rounded-xl border border-white/15 bg-black/30 backdrop-blur-md px-5 py-3 font-mono text-xs text-white/80"
            >
              <span className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
              </span>
              <Terminal className="h-3.5 w-3.5 text-[oklch(0.82_0.16_210)]" />
              <span>
                <span className="text-[oklch(0.82_0.16_210)]">$</span> ls articles/ —{" "}
                <span className="text-white font-bold">{articles.length}</span> publiés
              </span>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-6">
              <Link
                to="/blog/assistant"
                className="group inline-flex items-center gap-3 rounded-full border border-white/20 bg-gradient-to-r from-[oklch(0.62_0.2_255)]/30 to-[oklch(0.82_0.16_210)]/30 backdrop-blur-md px-5 py-3 text-sm font-semibold text-white hover:from-[oklch(0.62_0.2_255)]/50 hover:to-[oklch(0.82_0.16_210)]/50 transition-all shadow-glow"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                Assistant IA en direct — Cybersécurité & Dev
                <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* TOOLBAR: search + filters */}
      <section className="border-b border-border bg-surface/60 backdrop-blur">
        <div className="container mx-auto px-4 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
            <div className="relative w-full lg:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher un article, un sujet…"
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-background border border-border focus:outline-none focus:ring-2 focus:ring-[oklch(0.62_0.2_255)]/40 focus:border-[oklch(0.62_0.2_255)]/40 text-sm transition-all"
              />
            </div>
            <div className="flex-1 flex flex-wrap gap-2">
              {cats.map((c) => {
                const active = filter === c;
                return (
                  <button
                    key={c}
                    onClick={() => setFilter(c)}
                    className={`relative px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                      active
                        ? "text-white"
                        : "bg-secondary text-foreground/70 hover:bg-accent hover:text-foreground"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="blog-active-pill"
                        className="absolute inset-0 rounded-full bg-gradient-cyber"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{c}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden bg-card border border-border animate-pulse">
                  <div className="aspect-[16/10] bg-secondary/60" />
                  <div className="p-6 space-y-3">
                    <div className="h-3 w-24 bg-secondary/60 rounded" />
                    <div className="h-5 w-3/4 bg-secondary/60 rounded" />
                    <div className="h-4 w-full bg-secondary/60 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 rounded-3xl border border-dashed border-border bg-secondary/30">
              <BookOpen className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-display text-xl font-bold mb-2">Aucun article trouvé</h3>
              <p className="text-muted-foreground">Essayez une autre recherche ou catégorie.</p>
            </div>
          ) : (
            <>
              {/* Featured */}
              {featured && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="mb-16"
                >
                  <Link
                    to="/blog/$slug"
                    params={{ slug: featured.slug }}
                    className="group relative grid lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden border border-border bg-gradient-card shadow-soft hover:shadow-cyber transition-all duration-500"
                  >
                    <div
                      aria-hidden
                      className="absolute top-0 left-0 right-0 h-1 bg-gradient-cyber scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700 z-10"
                    />
                    <div className="relative aspect-[16/10] lg:aspect-auto bg-gradient-primary overflow-hidden">
                      {featured.cover_image_url ? (
                        <img
                          src={featured.cover_image_url}
                          alt={featured.title}
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="eager"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="font-display text-8xl text-white/15">{featured.title[0]}</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-tr from-foreground/60 via-transparent to-transparent" />
                      <span className="absolute top-5 left-5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-cyber text-white text-[10px] font-bold uppercase tracking-widest shadow-cyber">
                        <Sparkles className="h-3 w-3" /> À la une
                      </span>
                    </div>
                    <div className="p-8 lg:p-12 flex flex-col justify-center">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                        <span className="inline-flex items-center gap-1 font-bold text-[oklch(0.62_0.2_255)] uppercase tracking-widest">
                          <Tag className="h-3 w-3" /> {featured.category}
                        </span>
                        {featured.published_at && (
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(featured.published_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {readingTime(featured.excerpt)}
                        </span>
                      </div>
                      <h2 className="font-display text-3xl lg:text-4xl font-extrabold leading-tight mb-4 group-hover:text-[oklch(0.62_0.2_255)] transition-colors duration-300">
                        {featured.title}
                      </h2>
                      <p className="text-muted-foreground text-base lg:text-lg leading-relaxed mb-6 line-clamp-3">
                        {featured.excerpt}
                      </p>
                      <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[oklch(0.62_0.2_255)]">
                        Lire l'article
                        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              )}

              {/* Grid */}
              <motion.div
                layout
                variants={stagger}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.05 }}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-7"
              >
                <AnimatePresence mode="popLayout">
                  {rest.map((a, i) => (
                    <motion.div
                      key={a.id}
                      layout
                      custom={i}
                      variants={fadeUp}
                      exit={{ opacity: 0, scale: 0.95 }}
                    >
                      <Link
                        to="/blog/$slug"
                        params={{ slug: a.slug }}
                        className="group relative block rounded-2xl overflow-hidden bg-card border border-border hover:border-[oklch(0.82_0.16_210)]/60 transition-all duration-500 hover:-translate-y-1 hover:shadow-cyber h-full"
                      >
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
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3 flex-wrap">
                            <span className="inline-flex items-center gap-1 font-bold text-[oklch(0.62_0.2_255)] uppercase tracking-widest">
                              <Tag className="h-3 w-3" /> {a.category}
                            </span>
                            {a.published_at && (
                              <span className="inline-flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(a.published_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                              </span>
                            )}
                            <span className="inline-flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {readingTime(a.excerpt)}
                            </span>
                          </div>
                          <h3 className="font-display text-xl font-bold mb-3 group-hover:text-[oklch(0.62_0.2_255)] transition-colors duration-300">
                            {a.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-3">{a.excerpt}</p>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
