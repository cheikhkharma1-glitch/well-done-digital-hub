import { motion, useReducedMotion } from "framer-motion";
import { Server, Cloud, Cpu, Database, Network, Shield } from "lucide-react";

/**
 * Interactive 3D rotating cube with datacenter/cloud/AI faces.
 * Pure CSS 3D transforms + framer-motion. No three.js dependency.
 */
const faces = [
  { icon: Server, label: "Datacenter", sub: "24 racks · 99.99%", transform: "rotateY(0deg) translateZ(140px)" },
  { icon: Cloud, label: "Cloud", sub: "Multi-region", transform: "rotateY(90deg) translateZ(140px)" },
  { icon: Cpu, label: "IA", sub: "GPU cluster", transform: "rotateY(180deg) translateZ(140px)" },
  { icon: Database, label: "Data", sub: "PostgreSQL · Redis", transform: "rotateY(-90deg) translateZ(140px)" },
  { icon: Network, label: "Réseau", sub: "10 Gbps · SD-WAN", transform: "rotateX(90deg) translateZ(140px)" },
  { icon: Shield, label: "SecOps", sub: "SOC 24/7", transform: "rotateX(-90deg) translateZ(140px)" },
];

export function DataCube3D({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();

  return (
    <div className={`relative aspect-square w-full max-w-lg mx-auto ${className}`}>
      {/* Ambient glow */}
      <div aria-hidden className="absolute inset-0 rounded-full bg-gradient-cyber opacity-25 blur-3xl" />

      {/* Scene */}
      <div
        className="absolute inset-0 grid place-items-center"
        style={{ perspective: 1400 }}
      >
        <motion.div
          className="relative"
          style={{
            width: 280,
            height: 280,
            transformStyle: "preserve-3d",
          }}
          initial={{ rotateX: -18, rotateY: 0 }}
          animate={reduce ? undefined : { rotateY: [0, 360], rotateX: [-18, -22, -18] }}
          transition={{
            rotateY: { duration: 22, repeat: Infinity, ease: "linear" },
            rotateX: { duration: 8, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          {faces.map((f) => (
            <div
              key={f.label}
              className="absolute inset-0 rounded-2xl border border-[color:var(--cyber-cyan)]/40 bg-[#0f172a]/85 backdrop-blur-md shadow-cyber flex flex-col items-center justify-center gap-3 text-white"
              style={{
                transform: f.transform,
                backgroundImage:
                  "linear-gradient(135deg, rgb(37 99 235 / 0.35) 0%, rgb(6 182 212 / 0.15) 60%, transparent 100%), radial-gradient(circle at 20% 20%, rgb(6 182 212 / 0.35), transparent 60%)",
              }}
            >
              {/* micro grid */}
              <div
                aria-hidden
                className="absolute inset-3 rounded-xl opacity-40"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, rgb(6 182 212 / 0.25) 1px, transparent 1px), linear-gradient(to bottom, rgb(6 182 212 / 0.25) 1px, transparent 1px)",
                  backgroundSize: "22px 22px",
                }}
              />
              {/* corner ticks */}
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
            </div>
          ))}
        </motion.div>
      </div>

      {/* Orbiting nodes (outside the cube, in scene space) */}
      {!reduce && (
        <motion.div
          aria-hidden
          className="absolute inset-0"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {[0, 72, 144, 216, 288].map((deg, i) => (
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
          ))}
        </motion.div>
      )}

      {/* Floating telemetry chips */}
      {!reduce &&
        [
          { t: "CPU 42%", x: "4%", y: "12%", d: 0 },
          { t: "LAT 12ms", x: "82%", y: "16%", d: 0.8 },
          { t: "RPS 8.4k", x: "2%", y: "72%", d: 1.4 },
          { t: "UP 99.99%", x: "78%", y: "78%", d: 2.1 },
        ].map((c) => (
          <motion.span
            key={c.t}
            className="absolute rounded-md border border-[color:var(--cyber-cyan)]/40 bg-white/80 px-2.5 py-1 font-mono text-[10px] font-semibold text-primary shadow-sm backdrop-blur dark:bg-white/10 dark:text-white"
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
