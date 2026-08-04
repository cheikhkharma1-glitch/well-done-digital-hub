import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import { Search, Compass, Hammer, Rocket, LifeBuoy, ArrowRight } from "lucide-react";
import { useMotionPref } from "@/hooks/useMotionPref";

const steps = [
  { icon: Search, title: "Audit & découverte", desc: "Nous cartographions vos processus, votre stack et vos objectifs business.", kpi: "S1 · 2 semaines" },
  { icon: Compass, title: "Conception", desc: "Architecture, UX/UI et roadmap technique co-construites avec vos équipes.", kpi: "S2 · maquettes validées" },
  { icon: Hammer, title: "Build", desc: "Développement itératif avec revues hebdomadaires et démonstrations live.", kpi: "S3-S8 · sprints agiles" },
  { icon: Rocket, title: "Déploiement", desc: "Mise en production sécurisée, migration des données, formation utilisateurs.", kpi: "S9 · go-live" },
  { icon: LifeBuoy, title: "Support & évolution", desc: "SLA 24/7, monitoring proactif, évolutions et optimisations continues.", kpi: "365 j · SOC + support" },
];

export function Timeline3D() {
  const { reduce } = useMotionPref();
  const rootRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ["start end", "end start"],
  });
  const railHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      ref={rootRef}
      className="relative overflow-hidden bg-[#0b1226] py-24 lg:py-32 text-white"
      aria-labelledby="timeline-heading"
    >
      <div aria-hidden className="absolute inset-0 bg-gradient-mesh opacity-40" />
      <div aria-hidden className="absolute inset-0 bg-grid-cyber opacity-25 [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_75%)]" />

      <div className="container mx-auto px-4 lg:px-8 relative">
        <div className="max-w-5xl mb-16 lg:mb-20">
          <p className="text-xs font-bold text-[color:var(--cyber-cyan)] uppercase tracking-[0.35em] mb-5">
            Méthodologie
          </p>
          <h2
            id="timeline-heading"
            className="font-display font-bold leading-tight mb-6 text-[clamp(1.5rem,4.2vw,3rem)]"
            style={{ perspective: "900px" }}
          >
            <FitText>
            {[
              { t: "La", c: "" },
              { t: "transformation", c: "text-holo" },
              { t: "digitale,", c: "text-holo" },
              { t: "en", c: "" },
              { t: "5", c: "" },
              { t: "étapes.", c: "" },
            ].map((w, i) => (
              <motion.span
                key={w.t}
                className={`inline-block mr-[0.25em] ${w.c}`}
                style={{ transformStyle: "preserve-3d" }}
                initial={{ opacity: 0, rotateX: -85, y: 18 }}
                whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.6, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ rotateX: 12, rotateY: -10, scale: 1.06 }}
              >
                {w.t}
              </motion.span>
            ))}
            </FitText>
          </h2>


          <p className="text-white/75 text-base lg:text-lg leading-relaxed">
            Une méthode éprouvée pour livrer vite, bien, et pérenniser dans le temps.
          </p>
        </div>

        <div className="relative mx-auto max-w-4xl" style={{ perspective: 1200 }}>
          {/* Vertical rail */}
          <div aria-hidden className="pointer-events-none absolute left-6 top-0 bottom-0 w-px bg-white/10 md:left-1/2 md:-translate-x-1/2">
            <motion.div
              className="absolute inset-x-0 top-0 bg-gradient-to-b from-[color:var(--cyber-cyan)] via-[color:var(--cyber-blue)] to-transparent shadow-[0_0_18px_var(--cyber-cyan)]"
              style={{ height: reduce ? "100%" : railHeight, width: 2, left: -0.5 }}
            />
          </div>

          <ol className="space-y-14 lg:space-y-20">
            {steps.map((s, i) => (
              <TimelineCard key={s.title} step={s} index={i} reduce={reduce} />
            ))}
          </ol>

          <div className="mt-16 flex justify-center">
            <Link
              to="/contact"
              search={{ source: "timeline" } as never}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-cyber px-6 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-cyber transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b1226]"
            >
              Démarrer votre transformation <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function TimelineCard({
  step,
  index,
  reduce,
}: {
  step: (typeof steps)[number];
  index: number;
  reduce: boolean;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "end 0.3"],
  });
  const rotY = useTransform(scrollYProgress, [0, 0.5, 1], [index % 2 ? 18 : -18, 0, index % 2 ? -6 : 6]);
  const y = useTransform(scrollYProgress, [0, 1], [40, -20]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 1], [0.15, 1, 1]);
  const Icon = step.icon;
  const isRight = index % 2 === 1;

  return (
    <li ref={ref} className="relative pl-16 md:pl-0 md:grid md:grid-cols-2 md:gap-10 md:items-center">
      {/* Node dot */}
      <span
        aria-hidden
        className="absolute left-6 top-6 -translate-x-1/2 md:left-1/2 z-10 grid h-4 w-4 place-items-center rounded-full bg-[color:var(--cyber-cyan)] shadow-[0_0_16px_var(--cyber-cyan)]"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-white" />
      </span>

      {/* Card */}
      <motion.div
        style={
          reduce
            ? undefined
            : { rotateY: rotY, y, opacity, transformStyle: "preserve-3d", willChange: "transform" }
        }
        className={`glass rounded-2xl border border-white/10 p-6 lg:p-8 shadow-cyber ${
          isRight ? "md:col-start-2" : "md:col-start-1"
        }`}
      >
        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-cyber shadow-cyber">
            <Icon className="h-6 w-6 text-white" strokeWidth={1.75} />
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[color:var(--cyber-cyan)]">
              Étape {index + 1} · {step.kpi}
            </div>
            <h3 className="font-display text-xl font-bold mt-1">{step.title}</h3>
            <p className="mt-2 text-sm text-white/75 leading-relaxed">{step.desc}</p>
          </div>
        </div>
      </motion.div>
    </li>
  );
}
