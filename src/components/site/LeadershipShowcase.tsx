import { motion, useReducedMotion } from "framer-motion";
import { Quote, Sparkles, ShieldCheck, Cpu, Network, TrendingUp } from "lucide-react";
import { ParticleField } from "@/components/site/ParticleField";
import ceoImg from "@/assets/costume.png";

/**
 * Immersive leadership section: cut-out portrait composited over a live
 * "IT company" 3D backdrop (datacenter racks, orbiting nodes, holo grid,
 * floating KPI cards) with a motivational speech.
 */
export function LeadershipShowcase() {
  const reduce = useReducedMotion();

  const floats = [
    { icon: ShieldCheck, label: "Cybersécurité", value: "24/7", side: "left" as const, top: "12%" },
    { icon: Cpu, label: "Infrastructure", value: "99.9%", side: "right" as const, top: "22%" },
    { icon: Network, label: "Réseaux", value: "10 Gbps", side: "left" as const, top: "58%" },
    { icon: TrendingUp, label: "Croissance client", value: "+180%", side: "right" as const, top: "66%" },
  ];

  return (
    <section
      aria-labelledby="leadership-heading"
      className="relative overflow-hidden py-24 lg:py-32 bg-[#05070f] text-white"
    >
      {/* Deep gradient sky */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.25),transparent_60%),radial-gradient(ellipse_at_bottom_right,rgba(6,182,212,0.18),transparent_55%)]" />

      {/* Datacenter grid floor */}
      <div
        className="absolute inset-x-0 bottom-0 h-2/3 opacity-40"
        style={{
          background:
            "linear-gradient(180deg, transparent, rgba(6,182,212,0.08)), repeating-linear-gradient(90deg, rgba(6,182,212,0.18) 0 1px, transparent 1px 60px), repeating-linear-gradient(0deg, rgba(37,99,235,0.14) 0 1px, transparent 1px 60px)",
          transform: "perspective(900px) rotateX(62deg)",
          transformOrigin: "top",
          maskImage: "linear-gradient(180deg, rgba(0,0,0,0.9), transparent 85%)",
          WebkitMaskImage: "linear-gradient(180deg, rgba(0,0,0,0.9), transparent 85%)",
        }}
        aria-hidden
      />

      {/* Server rack silhouettes */}
      <div className="absolute inset-x-0 top-16 bottom-24 flex justify-between px-6 lg:px-20 pointer-events-none" aria-hidden>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <motion.div
            key={i}
            className="hidden md:flex flex-col gap-1.5 w-8 lg:w-10 opacity-30"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 0.3, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.8 }}
          >
            {Array.from({ length: 14 }).map((_, r) => (
              <span
                key={r}
                className="h-2 rounded-sm"
                style={{
                  background:
                    r % 3 === 0
                      ? "linear-gradient(90deg, rgba(6,182,212,0.7), rgba(37,99,235,0.3))"
                      : "rgba(148,163,184,0.15)",
                }}
              />
            ))}
          </motion.div>
        ))}
      </div>

      <ParticleField density={22} />

      <div className="container mx-auto px-4 lg:px-8 relative">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* PORTRAIT + 3D RIG */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="relative mx-auto max-w-md lg:max-w-lg aspect-[3/4]">
              {/* Orbiting rings behind subject */}
              <div className="absolute inset-0" style={{ perspective: 1200 }} aria-hidden>
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute inset-0 rounded-full border"
                    style={{
                      borderColor: i % 2 ? "rgba(6,182,212,0.35)" : "rgba(37,99,235,0.35)",
                      margin: `${8 + i * 6}%`,
                      transformStyle: "preserve-3d",
                    }}
                    initial={{ rotateX: 70, rotateZ: i * 40 }}
                    animate={reduce ? undefined : { rotateZ: [i * 40, i * 40 + 360] }}
                    transition={{ duration: 24 + i * 6, repeat: Infinity, ease: "linear" }}
                  >
                    <span
                      className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full"
                      style={{
                        background: i % 2 ? "#06B6D4" : "#2563EB",
                        boxShadow: `0 0 14px ${i % 2 ? "#06B6D4" : "#2563EB"}`,
                      }}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Cyan glow spot */}
              <div className="absolute inset-x-8 bottom-4 h-40 rounded-full bg-cyan-400/25 blur-3xl" aria-hidden />
              <div className="absolute inset-x-16 bottom-0 h-20 rounded-full bg-blue-600/40 blur-2xl" aria-hidden />

              {/* Holo pedestal */}
              <div
                className="absolute inset-x-4 bottom-0 h-8 rounded-[50%]"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(6,182,212,0.55), transparent 70%)",
                }}
                aria-hidden
              />

              {/* Portrait cutout */}
              <motion.img
                src={ceoImg}
                alt="M. Cheikh Mbacke Kharma — Président Directeur Général de Well Done Services Company"
                className="relative z-10 w-full h-full object-contain drop-shadow-[0_25px_45px_rgba(6,182,212,0.35)]"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: "easeOut" }}
                loading="lazy"
              />

              {/* Floating KPI cards */}
              {floats.map((f, idx) => {
                const Icon = f.icon;
                const isLeft = f.side === "left";
                return (
                  <motion.div
                    key={f.label}
                    className={`absolute z-20 hidden sm:flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md px-3.5 py-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.4)]`}
                    style={{
                      top: f.top,
                      [isLeft ? "left" : "right"]: "-8%",
                    } as React.CSSProperties}
                    initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + idx * 0.15, duration: 0.6 }}
                    animate={
                      reduce
                        ? undefined
                        : { y: [0, -8, 0] }
                    }
                    {...(!reduce && {
                      transition: {
                        delay: 0.4 + idx * 0.15,
                        duration: 4 + idx * 0.6,
                        repeat: Infinity,
                        ease: "easeInOut",
                      },
                    })}
                  >
                    <span className="grid place-items-center h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-400/30 to-blue-500/30 border border-cyan-300/30">
                      <Icon className="h-4 w-4 text-cyan-300" />
                    </span>
                    <div className="leading-tight">
                      <div className="text-[10px] uppercase tracking-widest text-white/60">{f.label}</div>
                      <div className="text-sm font-bold text-white">{f.value}</div>
                    </div>
                  </motion.div>
                );
              })}

              {/* Scanline sweep */}
              {!reduce && (
                <motion.div
                  className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none"
                  aria-hidden
                >
                  <motion.div
                    className="absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-cyan-300/15 to-transparent"
                    initial={{ y: "-20%" }}
                    animate={{ y: "120%" }}
                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                  />
                </motion.div>
              )}
            </div>
          </div>

          {/* SPEECH */}
          <div className="lg:col-span-6 order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-300 mb-6">
                <Sparkles className="h-3.5 w-3.5" />
                Mot du Président
              </div>
              <h2
                id="leadership-heading"
                className="font-display text-4xl lg:text-6xl font-bold leading-[1.05] tracking-tight mb-8"
              >
                Bâtir l'Afrique{" "}
                <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 bg-clip-text text-transparent">
                  numérique
                </span>{" "}
                de demain.
              </h2>

              <div className="relative pl-6 border-l-2 border-cyan-400/40 space-y-5">
                <Quote className="absolute -top-3 -left-4 h-8 w-8 text-cyan-300 bg-[#05070f] p-1" aria-hidden />
                <p className="text-base lg:text-lg text-white/85 leading-relaxed">
                  «&nbsp;La technologie n'est puissante que lorsqu'elle sert l'humain. Chez{" "}
                  <span className="font-semibold text-white">Well Done Services Company</span>, chaque
                  ligne de code, chaque serveur déployé et chaque système sécurisé porte une ambition :
                  transformer les entreprises africaines en champions du numérique mondial.&nbsp;»
                </p>
                <p className="text-base lg:text-lg text-white/75 leading-relaxed">
                  «&nbsp;Nous croyons en une <span className="text-cyan-300 font-medium">excellence sans compromis</span>,
                  en une <span className="text-cyan-300 font-medium">innovation responsable</span>, et en des équipes
                  passionnées qui bâtissent, ligne après ligne, un continent connecté, sécurisé et
                  souverain sur ses données.&nbsp;»
                </p>
                <p className="text-base lg:text-lg text-white/75 leading-relaxed">
                  «&nbsp;Rejoignez-nous. Ensemble, faisons de la transformation digitale un{" "}
                  <span className="text-white font-semibold">levier de performance</span>, un{" "}
                  <span className="text-white font-semibold">moteur de croissance</span> et une{" "}
                  <span className="text-white font-semibold">promesse tenue</span>.&nbsp;»
                </p>
              </div>

              <div className="mt-10 flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 grid place-items-center text-white font-display font-bold text-lg shadow-[0_10px_30px_rgba(6,182,212,0.4)]">
                  CK
                </div>
                <div>
                  <div className="font-display font-bold text-lg text-white">M. Cheikh Mbacke Kharma</div>
                  <div className="text-sm text-cyan-300/80 uppercase tracking-widest">Président Directeur Général</div>
                </div>
              </div>

              {/* Stats strip */}
              <div className="mt-10 grid grid-cols-3 gap-3">
                {[
                  { k: "+10 ans", v: "d'expertise IT" },
                  { k: "50+", v: "clients accompagnés" },
                  { k: "3 pays", v: "de présence" },
                ].map((s) => (
                  <div
                    key={s.k}
                    className="rounded-xl border border-white/10 bg-white/5 backdrop-blur px-4 py-3"
                  >
                    <div className="font-display text-2xl font-bold bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                      {s.k}
                    </div>
                    <div className="text-xs text-white/60 mt-1">{s.v}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
