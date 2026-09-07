import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Target,
  Eye,
  Heart,
  Award,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";
import { usePerfTier } from "@/hooks/usePerfTier";
import { cn } from "@/lib/utils";

type Value = {
  id: string;
  icon: LucideIcon;
  title: string;
  tag: string;
  text: string;
  accent: string;
  bars: { label: string; value: number }[];
};

const values: Value[] = [
  {
    id: "mission",
    icon: Target,
    title: "Mission",
    tag: "mission.yml",
    text: "Accompagner PME, écoles et administrations dans leur transition numérique avec des solutions sur mesure, utiles et durables.",
    accent: "var(--cyber-cyan)",
    bars: [
      { label: "Projets menés à terme", value: 96 },
      { label: "Livraisons dans les délais", value: 92 },
    ],
  },
  {
    id: "vision",
    icon: Eye,
    title: "Vision",
    tag: "vision.json",
    text: "Devenir l'acteur de référence de la transformation digitale en Afrique de l'Ouest, avec des standards d'ingénierie internationaux.",
    accent: "var(--primary)",
    bars: [
      { label: "Compétences internes montées", value: 88 },
      { label: "Automatisation des déploiements", value: 94 },
    ],
  },
  {
    id: "valeurs",
    icon: Heart,
    title: "Valeurs",
    tag: "values.env",
    text: "Excellence, écoute, transparence et engagement long terme : nous expliquons nos choix techniques et leurs coûts, sans jargon inutile.",
    accent: "var(--primary-glow)",
    bars: [
      { label: "Satisfaction client", value: 98 },
      { label: "Clients qui renouvellent", value: 85 },
    ],
  },
  {
    id: "engagement",
    icon: Award,
    title: "Engagement",
    tag: "sla.conf",
    text: "Qualité, respect des délais et support continu après la mise en production, avec des engagements de service écrits.",
    accent: "var(--cyber-cyan)",
    bars: [
      { label: "Disponibilité garantie", value: 99 },
      { label: "Tickets traités sous 24 h", value: 93 },
    ],
  },
];

export function ValuesShowcase() {
  const { reduce } = usePerfTier();
  const [open, setOpen] = useState<string>("mission");

  return (
    <div className="space-y-4">
      {values.map((v, i) => {
        const isOpen = open === v.id;
        return (
          <motion.div
            key={v.id}
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: i * 0.06 }}
            className={cn(
              "overflow-hidden rounded-2xl border bg-gradient-card transition-smooth",
              isOpen ? "border-primary/45 shadow-elegant" : "border-border hover:border-primary/25",
            )}
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? "" : v.id)}
              aria-expanded={isOpen}
              className="flex w-full items-center gap-4 px-5 py-5 text-left sm:px-7"
            >
              <span
                className="grid h-12 w-12 shrink-0 place-items-center rounded-xl text-primary-foreground shadow-soft"
                style={{ background: `linear-gradient(135deg, ${v.accent}, var(--primary))` }}
              >
                <v.icon className="h-6 w-6" strokeWidth={1.75} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-display text-lg font-bold">{v.title}</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  {v.tag}
                </span>
              </span>
              <ChevronDown
                className={cn(
                  "h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300",
                  isOpen && "rotate-180 text-primary",
                )}
              />
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="body"
                  initial={reduce ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={reduce ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-6 sm:px-7">
                    <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
                      {v.text}
                    </p>
                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      {v.bars.map((b) => (
                        <div key={b.label}>
                          <div className="mb-1.5 flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">{b.label}</span>
                            <span className="font-mono font-bold text-primary">{b.value}%</span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-surface">
                            <motion.div
                              initial={reduce ? false : { width: 0 }}
                              animate={{ width: `${b.value}%` }}
                              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                              className="h-full rounded-full"
                              style={{
                                background: `linear-gradient(90deg, ${v.accent}, var(--primary))`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
