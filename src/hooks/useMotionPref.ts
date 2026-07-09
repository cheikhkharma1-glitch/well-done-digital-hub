import { useEffect, useState } from "react";

const KEY = "wds:reduce-motion";

/**
 * Combines native `prefers-reduced-motion` with a user-controlled override
 * persisted in localStorage. Returns `true` when animations should be reduced.
 */
export function useMotionPref() {
  const [override, setOverride] = useState<boolean | null>(null);
  const [systemReduce, setSystemReduce] = useState(false);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem(KEY) : null;
    if (stored === "1") setOverride(true);
    else if (stored === "0") setOverride(false);

    if (typeof window !== "undefined" && window.matchMedia) {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      setSystemReduce(mq.matches);
      const onChange = (e: MediaQueryListEvent) => setSystemReduce(e.matches);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    }
  }, []);

  const reduce = override ?? systemReduce;

  const setReduce = (v: boolean) => {
    setOverride(v);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(KEY, v ? "1" : "0");
      document.documentElement.dataset.reduceMotion = v ? "1" : "0";
    }
  };

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.dataset.reduceMotion = reduce ? "1" : "0";
    }
  }, [reduce]);

  return { reduce, setReduce, override, systemReduce };
}

/**
 * SSR-safe mobile detection based on viewport width.
 * Used to downgrade animation density on small devices.
 */
export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);
  return isMobile;
}
