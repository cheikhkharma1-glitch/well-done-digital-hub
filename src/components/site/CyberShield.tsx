import { motion, useReducedMotion } from "framer-motion";
import { Shield, Lock } from "lucide-react";

export function CyberShield({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();
  return (
    <div className={`relative aspect-square w-full max-w-md mx-auto ${className}`}>
      {/* Glow */}
      <div aria-hidden className="absolute inset-0 rounded-full bg-gradient-cyber opacity-25 blur-3xl" />

      {/* Orbits */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          aria-hidden
          className="absolute inset-0 rounded-full border border-[color:var(--cyber-cyan)]/30"
          style={{ margin: `${i * 8}%` }}
          animate={reduce ? undefined : { rotate: i % 2 === 0 ? 360 : -360 }}
          transition={{ duration: 22 + i * 6, repeat: Infinity, ease: "linear" }}
        >
          <span className="absolute -top-1 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-[color:var(--cyber-cyan)] shadow-cyber" />
          <span className="absolute top-1/2 -right-1 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-primary shadow-glow" />
        </motion.div>
      ))}

      {/* Grid dome */}
      <svg
        aria-hidden
        viewBox="0 0 200 200"
        className="absolute inset-0 w-full h-full text-[color:var(--cyber-cyan)]/40"
      >
        <defs>
          <radialGradient id="dome" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="70%" stopColor="currentColor" stopOpacity="0.15" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.5" />
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="90" fill="url(#dome)" />
        {Array.from({ length: 8 }).map((_, i) => (
          <ellipse
            key={i}
            cx="100"
            cy="100"
            rx="90"
            ry={10 + i * 10}
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
          />
        ))}
        {Array.from({ length: 12 }).map((_, i) => (
          <line
            key={i}
            x1="100"
            y1="10"
            x2="100"
            y2="190"
            stroke="currentColor"
            strokeWidth="0.4"
            transform={`rotate(${(i * 180) / 12} 100 100)`}
          />
        ))}
      </svg>

      {/* Scan line */}
      {!reduce && (
        <div aria-hidden className="absolute inset-6 rounded-full overflow-hidden pointer-events-none">
          <motion.div
            className="absolute inset-x-0 h-16 bg-gradient-to-b from-transparent via-[color:var(--cyber-cyan)]/40 to-transparent"
            initial={{ y: "-100%" }}
            animate={{ y: "220%" }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "linear" }}
          />
        </div>
      )}

      {/* Shield core */}
      <motion.div
        className="absolute inset-0 grid place-items-center"
        animate={reduce ? undefined : { y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="relative">
          <div className="absolute inset-0 -m-4 rounded-3xl bg-gradient-cyber blur-2xl opacity-70" />
          <div className="relative h-28 w-28 sm:h-36 sm:w-36 rounded-3xl bg-gradient-to-br from-[#0f172a] to-[#1e3a8a] grid place-items-center shadow-elegant ring-1 ring-white/10">
            <Shield className="h-14 w-14 sm:h-16 sm:w-16 text-[color:var(--cyber-cyan)]" strokeWidth={1.5} />
            <Lock className="absolute h-6 w-6 sm:h-7 sm:w-7 text-white" />
          </div>
        </div>
      </motion.div>

      {/* Floating chips */}
      {!reduce &&
        [
          { t: "AES-256", x: "10%", y: "18%", d: 0 },
          { t: "SOC 2", x: "82%", y: "22%", d: 1 },
          { t: "TLS 1.3", x: "8%", y: "78%", d: 2 },
          { t: "MFA", x: "84%", y: "76%", d: 1.5 },
        ].map((c) => (
          <motion.span
            key={c.t}
            className="absolute px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold bg-white/80 dark:bg-white/10 text-primary dark:text-white backdrop-blur border border-[color:var(--cyber-cyan)]/40 shadow-sm"
            style={{ left: c.x, top: c.y }}
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, delay: c.d, repeat: Infinity, ease: "easeInOut" }}
          >
            {c.t}
          </motion.span>
        ))}
    </div>
  );
}
