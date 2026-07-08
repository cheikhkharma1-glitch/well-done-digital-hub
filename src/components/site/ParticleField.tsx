import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";

/**
 * Decorative animated particle / node field background.
 * Suggests network traffic + tech ambiance. Pure DOM + framer-motion.
 */
export function ParticleField({ className = "", density = 28 }: { className?: string; density?: number }) {
  const reduce = useReducedMotion();

  const particles = useMemo(
    () =>
      Array.from({ length: density }).map((_, i) => {
        const seed = (i + 1) * 9301;
        const rand = (n: number) => ((Math.sin(seed * (n + 1)) + 1) / 2);
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
    [density],
  );

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: p.cyan ? "var(--cyber-cyan)" : "var(--cyber-blue)",
            boxShadow: `0 0 ${p.size * 3}px ${p.cyan ? "var(--cyber-cyan)" : "var(--cyber-blue)"}`,
            opacity: 0.55,
          }}
          animate={
            reduce
              ? undefined
              : {
                  y: [0, -p.drift, 0],
                  x: [0, p.drift / 2, 0],
                  opacity: [0.2, 0.8, 0.2],
                }
          }
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* Scanning line */}
      {!reduce && (
        <motion.div
          className="absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-[color:var(--cyber-cyan)]/10 to-transparent"
          initial={{ y: "-20%" }}
          animate={{ y: "120%" }}
          transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
        />
      )}
    </div>
  );
}
