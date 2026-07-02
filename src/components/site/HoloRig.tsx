import { motion, useReducedMotion } from "framer-motion";

/**
 * Decorative "3D" holographic rig — pure CSS/SVG (no three.js).
 * Suggests a datacenter node / network sphere in the hero background.
 */
export function HoloRig({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();
  return (
    <div className={`relative aspect-square w-full ${className}`} aria-hidden>
      <div className="absolute inset-0 rounded-full bg-gradient-cyber opacity-20 blur-3xl" />

      {/* Rotating ring stack (fake 3D via perspective + rotateX) */}
      <div className="absolute inset-0" style={{ perspective: 1200 }}>
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border"
            style={{
              borderColor: i % 2 ? "rgb(6 182 212 / 0.5)" : "rgb(37 99 235 / 0.5)",
              transformStyle: "preserve-3d",
              margin: `${i * 6}%`,
            }}
            initial={{ rotateX: 65, rotateZ: i * 30 }}
            animate={reduce ? undefined : { rotateZ: [i * 30, i * 30 + 360] }}
            transition={{ duration: 20 + i * 5, repeat: Infinity, ease: "linear" }}
          >
            <span
              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-2 w-2 rounded-full shadow-cyber"
              style={{ background: i % 2 ? "var(--cyber-cyan)" : "var(--cyber-blue)" }}
            />
          </motion.div>
        ))}
      </div>

      {/* Wireframe globe */}
      <svg viewBox="0 0 200 200" className="absolute inset-[10%] w-4/5 h-4/5 text-[color:var(--cyber-cyan)]/50">
        <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="0.6" />
        {[20, 40, 60, 80].map((r) => (
          <ellipse key={r} cx="100" cy="100" rx="90" ry={r} fill="none" stroke="currentColor" strokeWidth="0.4" />
        ))}
        {[0, 30, 60, 90, 120, 150].map((a) => (
          <line
            key={a}
            x1="100"
            y1="10"
            x2="100"
            y2="190"
            stroke="currentColor"
            strokeWidth="0.35"
            transform={`rotate(${a} 100 100)`}
          />
        ))}
      </svg>

      {/* Node cluster (fake datacenter racks) */}
      <motion.div
        className="absolute inset-0 grid place-items-center"
        animate={reduce ? undefined : { rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      >
        {[0, 60, 120, 180, 240, 300].map((deg, i) => (
          <span
            key={deg}
            className="absolute h-2.5 w-2.5 rounded-full shadow-cyber"
            style={{
              transform: `rotate(${deg}deg) translate(140px) rotate(-${deg}deg)`,
              background: i % 2 ? "var(--cyber-cyan)" : "var(--cyber-blue)",
            }}
          />
        ))}
      </motion.div>

      {/* Core */}
      <div className="absolute inset-0 grid place-items-center">
        <div className="h-20 w-20 rounded-2xl bg-gradient-cyber shadow-cyber grid place-items-center">
          <div className="h-10 w-10 rounded-lg bg-[#0f172a] grid place-items-center">
            <span className="text-[10px] font-mono text-[color:var(--cyber-cyan)]">WDS</span>
          </div>
        </div>
      </div>
    </div>
  );
}
