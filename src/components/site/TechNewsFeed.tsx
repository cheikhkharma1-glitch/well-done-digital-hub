import { useCallback, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useServerFn } from "@tanstack/react-start";
import { Radio, RefreshCw, ArrowUpRight, Clock, Globe } from "lucide-react";
import { getTechNews, type TechNewsItem } from "@/lib/tech-news.functions";

const CATEGORIES = ["Tous", "IA", "Cybersécurité", "Dev Web & Mobile", "Tech"] as const;

function timeAgo(iso: string | null) {
  if (!iso) return "récent";
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.round(diff / 60000);
  if (m < 60) return `il y a ${Math.max(1, m)} min`;
  const h = Math.round(m / 60);
  if (h < 24) return `il y a ${h} h`;
  return `il y a ${Math.round(h / 24)} j`;
}

export function TechNewsFeed() {
  const fetchNews = useServerFn(getTechNews);
  const prefersReduced = useReducedMotion();
  const [items, setItems] = useState<TechNewsItem[]>([]);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("Tous");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchNews();
      setItems(res.items);
      setUpdatedAt(res.updatedAt);
      if (!res.items.length) setError("Flux temporairement indisponible.");
    } catch {
      setError("Impossible de récupérer les actualités pour le moment.");
    } finally {
      setLoading(false);
    }
  }, [fetchNews]);

  useEffect(() => {
    load();
    const t = setInterval(load, 10 * 60 * 1000);
    return () => clearInterval(t);
  }, [load]);

  const list = cat === "Tous" ? items : items.filter((i) => i.category === cat);

  return (
    <section className="relative py-16 lg:py-24 overflow-hidden border-t border-border">
      <div aria-hidden className="absolute inset-0 bg-grid-cyber opacity-[0.07]" />
      {!prefersReduced && (
        <motion.div
          aria-hidden
          className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-[oklch(0.82_0.16_210)]/60 to-transparent"
          initial={{ top: "0%" }}
          animate={{ top: ["0%", "100%"] }}
          transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
        />
      )}

      <div className="relative container mx-auto px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary border border-[oklch(0.82_0.16_210)]/40 text-xs font-bold uppercase tracking-widest">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <Radio className="h-3.5 w-3.5 text-[oklch(0.62_0.2_255)]" />
              Veille tech en temps réel
            </span>
            <h2 className="font-display text-3xl lg:text-5xl font-extrabold mt-5 leading-tight">
              L'actualité <span className="text-cyber">IA, cybersécurité & dev</span> en direct
            </h2>
            <p className="text-muted-foreground mt-3 max-w-2xl">
              Agrégation continue des meilleures sources tech mondiales : nouvelles technologies, intelligence
              artificielle, menaces de sécurité et écosystème web & mobile.
            </p>
          </div>
          <button
            onClick={load}
            disabled={loading}
            className="self-start inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-bold uppercase tracking-wider hover:border-[oklch(0.62_0.2_255)]/60 transition disabled:opacity-60"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Actualiser
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-8">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`relative px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                cat === c ? "text-white" : "bg-secondary text-foreground/70 hover:bg-accent hover:text-foreground"
              }`}
            >
              {cat === c && (
                <motion.span
                  layoutId="news-active-pill"
                  className="absolute inset-0 rounded-full bg-gradient-cyber"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">{c}</span>
            </button>
          ))}
          {updatedAt && (
            <span className="ml-auto font-mono text-[11px] text-muted-foreground">
              sync : {new Date(updatedAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
        </div>

        {loading && !items.length ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card p-6 animate-pulse space-y-3">
                <div className="h-3 w-24 bg-secondary/60 rounded" />
                <div className="h-5 w-4/5 bg-secondary/60 rounded" />
                <div className="h-4 w-full bg-secondary/60 rounded" />
                <div className="h-4 w-2/3 bg-secondary/60 rounded" />
              </div>
            ))}
          </div>
        ) : error && !list.length ? (
          <div className="text-center py-16 rounded-3xl border border-dashed border-border bg-secondary/30">
            <Globe className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">{error}</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {list.map((n, i) => (
              <motion.a
                key={n.id}
                href={n.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: prefersReduced ? 0 : 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.5, delay: Math.min(i, 8) * 0.04 }}
                className="group relative flex flex-col rounded-2xl overflow-hidden border border-border bg-card hover:border-[oklch(0.82_0.16_210)]/60 hover:-translate-y-1 hover:shadow-cyber transition-all duration-500"
              >
                <span
                  aria-hidden
                  className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-cyber scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700 z-10"
                />
                {n.image && (
                  <div className="aspect-[16/9] overflow-hidden bg-gradient-primary">
                    <img
                      src={n.image}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => ((e.currentTarget.style.display = "none"))}
                    />
                  </div>
                )}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-[11px] mb-3">
                    <span className="px-2 py-0.5 rounded-full bg-gradient-cyber text-white font-bold uppercase tracking-widest">
                      {n.category}
                    </span>
                    <span className="font-mono text-muted-foreground">{n.source}</span>
                  </div>
                  <h3 className="font-display text-lg font-bold leading-snug mb-2 group-hover:text-[oklch(0.62_0.2_255)] transition-colors line-clamp-3">
                    {n.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-3 flex-1">{n.excerpt}</p>
                  <div className="flex items-center justify-between mt-5 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {timeAgo(n.publishedAt)}
                    </span>
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
