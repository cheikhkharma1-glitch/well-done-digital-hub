import { Sparkles, Zap } from "lucide-react";
import { useMotionPref } from "@/hooks/useMotionPref";

/**
 * Floating toggle that lets visitors reduce or restore animations,
 * on top of the native `prefers-reduced-motion` media query.
 */
export function MotionToggle() {
  const { reduce, setReduce } = useMotionPref();
  const label = reduce ? "Activer les animations" : "Réduire les animations";

  return (
    <button
      type="button"
      onClick={() => setReduce(!reduce)}
      aria-pressed={reduce}
      aria-label={label}
      title={label}
      className="fixed bottom-4 right-4 z-40 inline-flex h-11 min-w-11 items-center gap-2 rounded-full border border-white/20 bg-[#0f172a]/85 px-3 text-xs font-semibold text-white shadow-cyber backdrop-blur transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cyber-cyan)] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      {reduce ? <Sparkles className="h-4 w-4 text-[color:var(--cyber-cyan)]" aria-hidden /> : <Zap className="h-4 w-4 text-[color:var(--cyber-cyan)]" aria-hidden />}
      <span className="hidden sm:inline">{reduce ? "Animations réduites" : "Animations actives"}</span>
    </button>
  );
}
