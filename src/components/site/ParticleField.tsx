import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { useIsMobile, useMotionPref } from "@/hooks/useMotionPref";

/**
 * Decorative animated particle / node field background.
 * - Downgrades density on mobile
 * - Pauses when scrolled out of view (IntersectionObserver)
 * - Respects `prefers-reduced-motion` + user toggle
 */
export function ParticleField({
  className = "",
  density = 28,
}: {
  className?: string;
  density?: number;
}) {
  const { reduce } = useMotionPref();
  const isMobile = useIsMobile();
  const rootRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "120px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const effectiveDensity = isMobile ? Math.max(8, Math.round(density * 0.4)) : density;

  const particles = useMemo(
    () =>
      Array.from({ length: effectiveDensity }).map((_, i) => {
        const seed = (i + 1) * 9301;
        const rand = (n: number) => (Math.sin(seed * (n + 1)) + 1) / 2;
        return {
          id: i,
          x: rand(1) * 100,
          y: rand(2) * 100,
          size: 2 + rand(3) * 4,
          delay: rand(4) * 6,
          duration: 8 + rand(5) * 10,
          drift: 20 + rand(6) * 40,
          cyan: i % 3 === 0,
        };
      }),
    [effectiveDensity],
  );

  const animate = !reduce && inView;

  return (
    <div
      ref={rootRef}
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full will-change-transform"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.cyan ? "var(--cyber-cyan)" : "var(--cyber-blue)",
            boxShadow: `0 0 ${p.size * 3}px ${p.cyan ? "var(--cyber-cyan)" : "var(--cyber-blue)"}`,
            opacity: 0.55,
            transform: "translate3d(0,0,0)",
          }}
          animate={
            animate
              ? {
                  y: [0, -p.drift, 0],
                  x: [0, p.drift / 2, 0],
                  opacity: [0.2, 0.8, 0.2],
                }
              : undefined
          }
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {animate && (
        <motion.div
          className="absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-[color:var(--cyber-cyan)]/10 to-transparent will-change-transform"
          initial={{ y: "-20%" }}
          animate={{ y: "120%" }}
          transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
        />
      )}
    </div>
  );
}
