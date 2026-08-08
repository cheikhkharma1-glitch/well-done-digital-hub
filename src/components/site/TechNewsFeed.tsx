import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useServerFn } from "@tanstack/react-start";
import { Radio, RefreshCw, ArrowUpRight, Clock, Globe, Search, SlidersHorizontal, Star, X } from "lucide-react";
import { getTechNews, type TechNewsItem } from "@/lib/tech-news.functions";

const THEMES = ["IA", "Cybersécurité", "Dev Web & Mobile", "Tech"] as const;
type Theme = (typeof THEMES)[number];

const DATE_FILTERS = [
  { id: "all", label: "Toutes dates" },
  { id: "24h", label: "24 heures" },
  { id: "7d", label: "7 jours" },
  { id: "30d", label: "30 jours" },
] as const;
type DateFilter = (typeof DATE_FILTERS)[number]["id"];

const STORAGE_KEY = "wds-technews-themes";

function timeAgo(iso: string | null) {
  if (!iso) return "récent";
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.round(diff / 60000);
  if (m < 60) return `il y a ${Math.max(1, m)} min`;
  const h = Math.round(m / 60);
  if (h < 24) return `il y a ${h} h`;
  return `il y a ${Math.round(h / 24)} j`;
}

const DATE_MS: Record<DateFilter, number | null> = {
  all: null,
  "24h": 24 * 3600_000,
  "7d": 7 * 24 * 3600_000,
  "30d": 30 * 24 * 3600_000,
};

export function TechNewsFeed() {
  const fetchNews = useServerFn(getTechNews);
  const prefersReduced = useReducedMotion();
  const [items, setItems] = useState<TechNewsItem[]>([]);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [cat, setCat] = useState<"Tous" | Theme>("Tous");
  const [query, setQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [source, setSource] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [onlyMyThemes, setOnlyMyThemes] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { themes?: string[]; only?: boolean };
        setThemes((parsed.themes ?? []).filter((t): t is Theme => (THEMES as readonly string[]).includes(t)));
        setOnlyMyThemes(Boolean(parsed.only));
      }
    } catch {
      /* ignore */
    }
  }, []);

  const persist = useCallback((next: Theme[], only: boolean) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ themes: next, only }));
    } catch {
      /* ignore */
    }
  }, []);

  const toggleTheme = (t: Theme) => {
    const next = themes.includes(t) ? themes.filter((x) => x !== t) : [...themes, t];
    setThemes(next);
    persist(next, onlyMyThemes);
  };

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

  const sources = useMemo(
    () => Array.from(new Set(items.map((i) => i.source))).sort((a, b) => a.localeCompare(b)),
    [items],
  );

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    const window = DATE_MS[dateFilter];
    const now = Date.now();
    const filtered = items.filter((i) => {
      if (cat !== "Tous" && i.category !== cat) return false;
      if (onlyMyThemes && themes.length && !themes.includes(i.category as Theme)) return false;
      if (source !== "all" && i.source !== source) return false;
      if (window) {
        if (!i.publishedAt) return false;
        if (now - new Date(i.publishedAt).getTime() > window) return false;
      }
      if (q) {
        const hay = `${i.title} ${i.excerpt} ${i.source} ${i.category}`.toLowerCase();
        if (!q.split(/\s+/).every((w) => hay.includes(w))) return false;
      }
      return true;
    });
    // Personnalisation : remonter les thèmes préférés
    if (themes.length && !onlyMyThemes) {
      return [...filtered].sort((a, b) => {
        const pa = themes.includes(a.category as Theme) ? 0 : 1;
        const pb = themes.includes(b.category as Theme) ? 0 : 1;
        return pa - pb;
      });
    }
    return filtered;
  }, [items, cat, query, dateFilter, source, themes, onlyMyThemes]);

  const activeFilters = (query ? 1 : 0) + (dateFilter !== "all" ? 1 : 0) + (source !== "all" ? 1 : 0);

  const reset = () => {
    setQuery("");
    setDateFilter("all");
    setSource("all");
    setCat("Tous");
  };

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

        {/* Personnalisation des thèmes */}
        <div className="rounded-2xl border border-border bg-card/60 backdrop-blur p-5 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              <Star className="h-3.5 w-3.5 text-[oklch(0.82_0.16_210)]" /> Mes thèmes
            </span>
            {THEMES.map((t) => {
              const on = themes.includes(t);
              return (
                <button
                  key={t}
                  onClick={() => toggleTheme(t)}
                  aria-pressed={on}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-all ${
                    on
                      ? "border-transparent bg-gradient-cyber text-white shadow-cyber"
                      : "border-border bg-secondary text-foreground/70 hover:text-foreground"
                  }`}
                >
                  {t}
                </button>
              );
            })}
            <label className="ml-auto inline-flex items-center gap-2 text-xs font-medium text-muted-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={onlyMyThemes}
                onChange={(e) => {
                  setOnlyMyThemes(e.target.checked);
                  persist(themes, e.target.checked);
                }}
                className="h-4 w-4 rounded border-border accent-[oklch(0.62_0.2_255)]"
              />
              Afficher uniquement mes thèmes
            </label>
          </div>
          <p className="text-[11px] text-muted-foreground mt-3">
            {themes.length
              ? "Vos préférences sont enregistrées sur cet appareil et remontent vos sujets favoris en tête du fil."
              : "Sélectionnez vos sujets favoris pour recevoir un fil personnalisé."}
          </p>
        </div>

        {/* Recherche + filtres */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher par mots-clés (ex. ransomware, LLM, React)…"
                aria-label="Rechercher dans le fil Tech News"
                className="w-full rounded-full border border-border bg-card pl-11 pr-4 py-3 text-sm outline-none focus:border-[oklch(0.62_0.2_255)]/60 focus:ring-2 focus:ring-[oklch(0.62_0.2_255)]/20 transition"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  aria-label="Effacer la recherche"
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-accent"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters((v) => !v)}
              aria-expanded={showFilters}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-xs font-bold uppercase tracking-wider hover:border-[oklch(0.62_0.2_255)]/60 transition"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filtres avancés
              {activeFilters > 0 && (
                <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-cyber px-1.5 text-[10px] text-white">
                  {activeFilters}
                </span>
              )}
            </button>
          </div>

          {showFilters && (
            <div className="grid gap-4 sm:grid-cols-3 rounded-2xl border border-border bg-card/60 backdrop-blur p-5">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
                  Date de publication
                </label>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value as DateFilter)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-[oklch(0.62_0.2_255)]/60"
                >
                  {DATE_FILTERS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
                  Type / thème
                </label>
                <select
                  value={cat}
                  onChange={(e) => setCat(e.target.value as "Tous" | Theme)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-[oklch(0.62_0.2_255)]/60"
                >
                  <option value="Tous">Tous les thèmes</option>
                  {THEMES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
                  Source
                </label>
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-[oklch(0.62_0.2_255)]/60"
                >
                  <option value="all">Toutes les sources</option>
                  {sources.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-3 flex items-center justify-between gap-3 pt-1">
                <span className="text-xs text-muted-foreground">
                  {list.length} article{list.length > 1 ? "s" : ""} correspondant
                  {list.length > 1 ? "s" : ""}
                </span>
                <button
                  onClick={reset}
                  className="text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition"
                >
                  Réinitialiser
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2">
            {(["Tous", ...THEMES] as const).map((c) => (
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
        ) : !list.length ? (
          <div className="text-center py-16 rounded-3xl border border-dashed border-border bg-secondary/30">
            <Globe className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {error ?? "Aucun article ne correspond à votre recherche ou à vos filtres."}
            </p>
            {!error && (
              <button
                onClick={reset}
                className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-bold uppercase tracking-wider hover:border-[oklch(0.62_0.2_255)]/60 transition"
              >
                Réinitialiser les filtres
              </button>
            )}
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
                    {themes.includes(n.category as Theme) && (
                      <Star className="h-3 w-3 text-[oklch(0.82_0.16_210)] fill-current" aria-label="Thème favori" />
                    )}
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
