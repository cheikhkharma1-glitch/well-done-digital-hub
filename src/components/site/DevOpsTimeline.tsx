import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  GitBranch,
  ShieldCheck,
  Gauge,
  Rocket,
  PackageCheck,
  type LucideIcon,
} from "lucide-react";
import { usePerfTier } from "@/hooks/usePerfTier";
import { cn } from "@/lib/utils";

type Milestone = {
  id: string;
  step: string;
  icon: LucideIcon;
  title: string;
  summary: string;
  points: string[];
  metric: { label: string; value: string };
  stack: string[];
};

const milestones: Milestone[] = [
  {
    id: "plan",
    step: "01",
    icon: PackageCheck,
    title: "Cadrage & Infrastructure as Code",
    summary:
      "Chaque environnement est décrit dans le code : reproductible, versionné, auditable.",
    points: [
      "Ateliers de cadrage et backlog priorisé",
      "Environnements dev / staging / prod identiques",
      "Terraform & conteneurs versionnés dans Git",
    ],
    metric: { label: "Mise en place d'un environnement", value: "< 30 min" },
    stack: ["Git", "Terraform", "Docker"],
  },
  {
    id: "cicd",
    step: "02",
    icon: GitBranch,
    title: "CI/CD — intégration & livraison continues",
    summary:
      "Du commit à la production : build, tests et déploiement automatisés, réversibles en un clic.",
    points: [
      "Pipelines build → tests → déploiement",
      "Revue de code obligatoire avant fusion",
      "Retour arrière instantané en cas d'incident",
    ],
    metric: { label: "Déploiements par semaine", value: "12+" },
    stack: ["GitHub Actions", "Kubernetes", "Helm"],
  },
  {
    id: "sec",
    step: "03",
    icon: ShieldCheck,
    title: "DevSecOps — la sécurité dès le premier commit",
    summary:
      "Les contrôles de sécurité sont intégrés au pipeline, pas ajoutés à la fin du projet.",
    points: [
      "Analyse des dépendances et des secrets à chaque build",
      "Tests d'intrusion et durcissement des serveurs",
      "Chiffrement des données et accès Zero-Trust",
    ],
    metric: { label: "Vulnérabilités critiques en production", value: "0" },
    stack: ["SAST", "Zero-Trust", "WAF"],
  },
  {
    id: "obs",
    step: "04",
    icon: Gauge,
    title: "Observabilité — voir avant de subir",
    summary:
      "Métriques, journaux et alertes centralisés : les incidents sont détectés avant vos utilisateurs.",
    points: [
      "Tableaux de bord temps réel et alertes intelligentes",
      "Traçabilité complète des requêtes",
      "Rapports mensuels de disponibilité",
    ],
    metric: { label: "Disponibilité constatée", value: "99,9 %" },
    stack: ["Prometheus", "Grafana", "Loki"],
  },
  {
    id: "run",
    step: "05",
    icon: Rocket,
    title: "Run & amélioration continue",
    summary:
      "Après la mise en production, l'équipe reste : support, optimisation des coûts et évolutions.",
    points: [
      "Support et astreinte selon SLA",
      "Optimisation continue des performances et des coûts",
      "Feuille de route d'évolution trimestrielle",
    ],
    metric: { label: "Délai moyen de rétablissement", value: "< 1 h" },
    stack: ["SLA", "FinOps", "Post-mortem"],
  },
];

export function DevOpsTimeline() {
  const { reduce, lite } = usePerfTier();
  const [active, setActive] = useState(0);
  const current = milestones[active]!;

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
      {/* Rail */}
      <div className="lg:col-span-5">
        <ol className="relative space-y-2">
          <span
            aria-hidden
            className="absolute left-[27px] top-4 bottom-4 w-px bg-gradient-to-b from-[color:var(--cyber-cyan)]/60 via-primary/40 to-transparent"
          />
          {milestones.map((m, i) => {
            const isActive = i === active;
            return (
              <li key={m.id} className="relative">
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  aria-current={isActive}
                  className={cn(
                    "group flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition-smooth",
                    isActive
                      ? "border-[color:var(--cyber-cyan)]/50 bg-white/10 shadow-cyber"
                      : "border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]",
                  )}
                >
                  <span
                    className={cn(
                      "relative z-10 grid h-14 w-14 shrink-0 place-items-center rounded-xl border transition-smooth",
                      isActive
                        ? "border-transparent bg-gradient-cyber text-white"
                        : "border-white/15 bg-[#0b1226] text-white/70",
                    )}
                  >
                    <m.icon className="h-6 w-6" strokeWidth={1.75} />
                    {isActive && !reduce && (
                      <motion.span
                        aria-hidden
                        layoutId="devops-ring"
                        className="absolute inset-0 rounded-xl ring-2 ring-[color:var(--cyber-cyan)]/70"
                      />
                    )}
                  </span>
                  <span className="min-w-0 pt-1">
                    <span className="block font-mono text-xs uppercase tracking-[0.3em] text-[color:var(--cyber-cyan)]">
                      étape {m.step}
                    </span>
                    <span className="mt-1 block font-display text-base font-bold text-white">
                      {m.title}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Detail panel */}
      <div className="lg:col-span-7">
        <AnimatePresence mode="wait">
          <motion.article
            key={current.id}
            initial={reduce ? false : { opacity: 0, y: 24, rotateX: lite ? 0 : -6 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -16 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            style={reduce ? undefined : { transformStyle: "preserve-3d", willChange: "transform" }}
            className="glass relative overflow-hidden rounded-3xl border border-white/12 p-7 lg:p-9"
          >
            <div aria-hidden className="absolute inset-0 bg-grid-cyber opacity-10" />
            {!lite && (
              <motion.span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-[color:var(--cyber-cyan)]/15 to-transparent"
                initial={{ y: "-30%" }}
                animate={{ y: "420%" }}
                transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
              />
            )}
            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--cyber-cyan)]/40 bg-white/5 px-3 py-1 font-mono text-xs uppercase tracking-[0.25em] text-[color:var(--cyber-cyan)]">
                pipeline · {current.step}
              </span>
              <h3 className="mt-4 font-display text-2xl font-bold text-white lg:text-3xl">
                {current.title}
              </h3>
              <p className="mt-3 leading-relaxed text-white/75">{current.summary}</p>

              <ul className="mt-6 space-y-3">
                {current.points.map((p, i) => (
                  <motion.li
                    key={p}
                    initial={reduce ? false : { opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, delay: 0.08 * i }}
                    className="flex items-start gap-3 text-sm text-white/80"
                  >
                    <span
                      aria-hidden
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--cyber-cyan)]"
                    />
                    {p}
                  </motion.li>
                ))}
              </ul>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                  <p className="font-display text-2xl font-extrabold text-white">
                    {current.metric.value}
                  </p>
                  <p className="text-xs text-white/60">{current.metric.label}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {current.stack.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-white/15 bg-white/5 px-3 py-1 font-mono text-xs uppercase tracking-wider text-white/70"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.article>
        </AnimatePresence>
      </div>
    </div>
  );
}
