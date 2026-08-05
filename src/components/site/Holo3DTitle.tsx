import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { FitText } from "@/components/site/FitText";

export type HoloWord = { t: string; c?: string };

/**
 * Word-by-word 3D reveal with holographic IT accents.
 * - Always fits on a single line (FitText).
 * - Automatically degrades on small phones / reduced-motion:
 *   no 3D rotation, no hover transforms, shorter stagger → no jank.
 */
export function Holo3DTitle({
  words,
  as: Tag = "h2",
  className = "",
  animateOnView = true,
  baseDelay = 0.1,
}: {
  words: HoloWord[];
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  animateOnView?: boolean;
  baseDelay?: number;
}) {
  const reduce = useReducedMotion();
  const [isSmall, setIsSmall] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px), (max-height: 480px)");
    const update = () => setIsSmall(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const light = reduce || isSmall;
  const stagger = light ? 0.035 : 0.07;
  const duration = light ? 0.4 : 0.6;

  const hidden = light
    ? { opacity: 0, y: 10 }
    : { opacity: 0, rotateX: -85, y: 18 };
  const shown = light ? { opacity: 1, y: 0 } : { opacity: 1, rotateX: 0, y: 0 };

  return (
    <Tag
      className={className}
      style={light ? undefined : { perspective: "900px" }}
    >
      <FitText>
        {words.map((w, i) => (
          <motion.span
            key={w.t + i}
            className={`inline-block mr-[0.25em] ${w.c ?? ""}`}
            style={
              light
                ? { willChange: "opacity, transform" }
                : { transformStyle: "preserve-3d", willChange: "transform, opacity" }
            }
            initial={hidden}
            {...(animateOnView
              ? { whileInView: shown, viewport: { once: true, amount: 0.5 } }
              : { animate: shown })}
            transition={{
              duration,
              delay: baseDelay + i * stagger,
              ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={light ? undefined : { rotateX: 12, rotateY: -10, scale: 1.06 }}
            onAnimationComplete={(def) => {
              void def;
            }}
          >
            {w.t}
          </motion.span>
        ))}
      </FitText>
    </Tag>
  );
}
