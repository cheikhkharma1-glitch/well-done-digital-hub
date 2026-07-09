import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Server, Cloud, Cpu, Database, Network, Shield, ArrowRight, RotateCcw } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useIsMobile, useMotionPref } from "@/hooks/useMotionPref";

/**
 * Interactive 3D cube — mouse parallax on desktop, drag on mobile,
 * wheel zoom, click-to-highlight face with contextual CTA.
 */
const faces = [
  { icon: Server, label: "Datacenter", sub: "24 racks · 99.99%", detail: "Racks refroidis, redondance N+1, alimentation onduleur double.", transform: "rotateY(0deg) translateZ(140px)" },
  { icon: Cloud, label: "Cloud", sub: "Multi-region", detail: "Déploiement Cloudflare / AWS multi-région avec fail-over automatique.", transform: "rotateY(90deg) translateZ(140px)" },
  { icon: Cpu, label: "IA", sub: "GPU cluster", detail: "Cluster GPU pour IA générative, LLM privés et pipelines ML.", transform: "rotateY(180deg) translateZ(140px)" },
  { icon: Database, label: "Data", sub: "PostgreSQL · Redis", detail: "Bases relationnelles, cache mémoire, sauvegardes chiffrées h+24.", transform: "rotateY(-90deg) translateZ(140px)" },
  { icon: Network, label: "Réseau", sub: "10 Gbps · SD-WAN", detail: "Backbone 10 Gbps, SD-WAN chiffré, QoS applicative.", transform: "rotateX(90deg) translateZ(140px)" },
  { icon: Shield, label: "SecOps", sub: "SOC 24/7", detail: "SOC 24/7, EDR, chasse aux menaces et réponse à incident.", transform: "rotateX(-90deg) translateZ(140px)" },
];

export function DataCube3D({ className = "" }: { className?: string }) {
  const { reduce } = useMotionPref();
  const isMobile = useIsMobile();
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const [showCta, setShowCta] = useState(false);
  const [inView, setInView] = useState(true);

  // Motion values for interactive rotation and zoom
  const rotY = useMotionValue(0);
  const rotX = useMotionValue(-18);
  const scale = useMotionValue(1);
  const smoothY = useSpring(rotY, { stiffness: 60, damping: 18, mass: 0.6 });
  const smoothX = useSpring(rotX, { stiffness: 60, damping: 18, mass: 0.6 });
  const smoothScale = useSpring(scale, { stiffness: 120, damping: 20 });

  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: "80px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Auto-rotation loop (disabled when user has interacted or reduced motion)
  const [autoSpin, setAutoSpin] = useState(true);
  useEffect(() => {
    if (!autoSpin || reduce || !inView) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      rotY.set(rotY.get() + dt * 22); // ~16s / rotation
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [autoSpin, reduce, inView, rotY]);

  // Show CTA after 3s of interaction
  useEffect(() => {
    if (autoSpin) return;
    const t = setTimeout(() => setShowCta(true), 2200);
    return () => clearTimeout(t);
  }, [autoSpin]);

  const stopAuto = () => setAutoSpin(false);

  // Desktop: mouse-follow parallax
  const onPointerMove = (e: React.PointerEvent) => {
    if (reduce || isMobile) return;
    if (e.pointerType !== "mouse") return;
    const rect = rootRef.current?.getBoundingClientRect();
    if (!rect) return;
    const nx = (e.clientX - rect.left) / rect.width - 0.5; // -0.5..0.5
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    stopAuto();
    rotY.set(nx * 90);
    rotX.set(-18 + ny * -30);
  };

  // Wheel zoom (small clamp)
  const onWheel = (e: React.WheelEvent) => {
    if (reduce) return;
    e.preventDefault();
    stopAuto();
    const next = Math.min(1.18, Math.max(0.85, scale.get() - e.deltaY * 0.0015));
    scale.set(next);
  };

  // Touch drag rotation
  const dragStart = useRef<{ x: number; y: number; ry: number; rx: number } | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    if (reduce) return;
    stopAuto();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragStart.current = { x: e.clientX, y: e.clientY, ry: rotY.get(), rx: rotX.get() };
  };
  const onPointerMoveDrag = (e: React.PointerEvent) => {
    if (!dragStart.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    rotY.set(dragStart.current.ry + dx * 0.4);
    rotX.set(Math.max(-70, Math.min(20, dragStart.current.rx - dy * 0.3)));
  };
  const onPointerUp = () => {
    dragStart.current = null;
  };

  const resetView = () => {
    scale.set(1);
    rotX.set(-18);
    rotY.set(0);
    setActive(null);
    setAutoSpin(true);
    setShowCta(false);
  };

  const transform = useTransform([smoothX, smoothY, smoothScale], (values: number[]) => {
    const [x, y, s] = values;
    return `rotateX(${x}deg) rotateY(${y}deg) scale(${s})`;
  });

  const orbitCount = isMobile ? 3 : 5;

  return (
    <div
      ref={rootRef}
      className={`relative aspect-square w-full max-w-lg mx-auto touch-none ${className}`}
      onPointerMove={onPointerMove}
      onWheel={onWheel}
    >
      {/* Ambient glow */}
      <div aria-hidden className="absolute inset-0 rounded-full bg-gradient-cyber opacity-25 blur-3xl" />

      {/* Reset button */}
      {!autoSpin && (
        <button
          type="button"
          onClick={resetView}
          aria-label="Réinitialiser la vue du cube"
          className="absolute top-2 right-2 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-[#0f172a]/80 text-white backdrop-blur transition-colors hover:bg-[#0f172a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cyber-cyan)]"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      )}

      {/* Interactive scene */}
      <div
        className="absolute inset-0 grid place-items-center select-none"
        style={{ perspective: 1400 }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMoveDrag}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        role="group"
        aria-label="Cube 3D interactif — glissez pour tourner, cliquez une face pour la sélectionner"
      >
        <motion.div
          className="relative cursor-grab active:cursor-grabbing"
          style={{
            width: 280,
            height: 280,
            transformStyle: "preserve-3d",
            transform,
            willChange: "transform",
          }}
        >
          {faces.map((f, i) => {
            const isActive = active === i;
            return (
              <button
                type="button"
                key={f.label}
                onClick={(e) => {
                  e.stopPropagation();
                  stopAuto();
                  setActive(isActive ? null : i);
                }}
                className={`absolute inset-0 rounded-2xl border text-white flex flex-col items-center justify-center gap-3 shadow-cyber transition-colors ${
                  isActive
                    ? "border-[color:var(--cyber-cyan)] bg-[#0b1226]/95"
                    : "border-[color:var(--cyber-cyan)]/40 bg-[#0f172a]/85"
                } backdrop-blur-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cyber-cyan)]`}
                style={{
                  transform: f.transform,
                  backgroundImage: isActive
                    ? "linear-gradient(135deg, rgb(6 182 212 / 0.45) 0%, rgb(37 99 235 / 0.25) 60%, transparent 100%)"
                    : "linear-gradient(135deg, rgb(37 99 235 / 0.35) 0%, rgb(6 182 212 / 0.15) 60%, transparent 100%), radial-gradient(circle at 20% 20%, rgb(6 182 212 / 0.35), transparent 60%)",
                }}
                aria-label={`Face ${f.label} — ${f.sub}`}
                aria-pressed={isActive}
              >
                <div
                  aria-hidden
                  className="absolute inset-3 rounded-xl opacity-40"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, rgb(6 182 212 / 0.25) 1px, transparent 1px), linear-gradient(to bottom, rgb(6 182 212 / 0.25) 1px, transparent 1px)",
                    backgroundSize: "22px 22px",
                  }}
                />
                {["top-2 left-2", "top-2 right-2", "bottom-2 left-2", "bottom-2 right-2"].map((p) => (
                  <span
                    key={p}
                    aria-hidden
                    className={`absolute ${p} h-2 w-2 border border-[color:var(--cyber-cyan)]`}
                  />
                ))}
                <div className="relative grid h-16 w-16 place-items-center rounded-xl bg-gradient-cyber shadow-cyber">
                  <f.icon className="h-8 w-8 text-white" strokeWidth={1.5} />
                </div>
                <div className="relative text-center">
                  <div className="font-display text-lg font-bold tracking-tight">{f.label}</div>
                  <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--cyber-cyan)]">
                    {f.sub}
                  </div>
                </div>
              </button>
            );
          })}
        </motion.div>
      </div>

      {/* Orbiting nodes */}
      {!reduce && inView && (
        <motion.div
          aria-hidden
          className="absolute inset-0 will-change-transform"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {Array.from({ length: orbitCount }).map((_, i) => {
            const deg = (360 / orbitCount) * i;
            return (
              <span
                key={deg}
                className="absolute left-1/2 top-1/2 h-2 w-2 rounded-full"
                style={{
                  background: i % 2 ? "var(--cyber-cyan)" : "var(--cyber-blue)",
                  boxShadow: "0 0 12px currentColor",
                  color: i % 2 ? "var(--cyber-cyan)" : "var(--cyber-blue)",
                  transform: `rotate(${deg}deg) translate(180px) rotate(-${deg}deg) translate(-50%, -50%)`,
                }}
              />
            );
          })}
        </motion.div>
      )}

      {/* Active face detail panel */}
      <AnimatePresence>
        {active !== null && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="absolute inset-x-2 bottom-2 z-10 rounded-2xl border border-[color:var(--cyber-cyan)]/40 bg-[#0b1226]/95 p-4 text-white shadow-cyber backdrop-blur"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[color:var(--cyber-cyan)]">
                  Brique sélectionnée
                </div>
                <div className="font-display text-lg font-bold">{faces[active].label}</div>
                <p className="mt-1 text-sm text-white/80">{faces[active].detail}</p>
              </div>
              <Link
                to="/contact"
                search={{ source: `cube3d:${faces[active].label.toLowerCase()}` } as never}
                className="inline-flex shrink-0 items-center gap-1 rounded-full bg-gradient-cyber px-3 py-1.5 text-xs font-semibold text-white shadow-cyber focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Devis <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating CTA that appears after interaction */}
      <AnimatePresence>
        {showCta && active === null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute -top-3 left-1/2 -translate-x-1/2 z-10"
          >
            <Link
              to="/contact"
              search={{ source: "cube3d" } as never}
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-cyber px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-cyber focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Demander un devis <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating telemetry chips */}
      {!reduce && inView &&
        [
          { t: "CPU 42%", x: "4%", y: "12%", d: 0 },
          { t: "LAT 12ms", x: "82%", y: "16%", d: 0.8 },
          { t: "RPS 8.4k", x: "2%", y: "72%", d: 1.4 },
          { t: "UP 99.99%", x: "78%", y: "78%", d: 2.1 },
        ].map((c) => (
          <motion.span
            key={c.t}
            className="pointer-events-none absolute rounded-md border border-[color:var(--cyber-cyan)]/40 bg-white/80 px-2.5 py-1 font-mono text-[10px] font-semibold text-primary shadow-sm backdrop-blur dark:bg-white/10 dark:text-white will-change-transform"
            style={{ left: c.x, top: c.y }}
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4.5, delay: c.d, repeat: Infinity, ease: "easeInOut" }}
          >
            {c.t}
          </motion.span>
        ))}
    </div>
  );
}
