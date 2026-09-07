import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

type NavigatorWithPerf = Navigator & { deviceMemory?: number };

/**
 * Detects low-power devices (few cores / little memory / small screen) and
 * combines the result with the user's reduced-motion preference.
 * Use it to downgrade 3D, parallax and continuous animations.
 */
export function usePerfTier() {
  const prefersReduced = useReducedMotion();
  const [lowPower, setLowPower] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const nav = navigator as NavigatorWithPerf;
    const cores = nav.hardwareConcurrency ?? 8;
    const memory = nav.deviceMemory ?? 8;
    const smallScreen = window.matchMedia("(max-width: 767px)").matches;

    setIsMobile(smallScreen);
    setLowPower(cores <= 4 || memory <= 4);

    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const reduce = Boolean(prefersReduced) || lowPower;

  return {
    /** Skip entrance/loop animations entirely. */
    reduce,
    /** Skip heavy effects (parallax, 3D tilt, continuous loops). */
    lite: reduce || isMobile,
    lowPower,
    isMobile,
  };
}
