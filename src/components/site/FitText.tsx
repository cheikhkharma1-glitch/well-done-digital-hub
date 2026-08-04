import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Scales its content down so it always fits on a single line,
 * whatever the screen width (including very small phones).
 */
export function FitText({
  children,
  className = "",
  min = 0.2,
}: {
  children: ReactNode;
  className?: string;
  min?: number;
}) {
  const outerRef = useRef<HTMLSpanElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState<number | undefined>(undefined);

  const measure = useCallback(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;
    const available = outer.clientWidth;
    const natural = inner.scrollWidth;
    if (!available || !natural) return;
    const next = Math.max(min, Math.min(1, available / natural));
    setScale(next);
    setHeight(inner.getBoundingClientRect().height / (scale || 1) * next);
  }, [min, scale]);

  useEffect(() => {
    measure();
    const outer = outerRef.current;
    if (!outer || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => measure());
    ro.observe(outer);
    if (innerRef.current) ro.observe(innerRef.current);
    window.addEventListener("resize", measure, { passive: true });
    const t = window.setTimeout(measure, 300);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      window.clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <span
      ref={outerRef}
      className={`block w-full max-w-full overflow-hidden ${className}`}
      style={height ? { height } : undefined}
    >
      <span
        ref={innerRef}
        className="inline-block whitespace-nowrap origin-top-left"
        style={{ transform: `scale(${scale})` }}
      >
        {children}
      </span>
    </span>
  );
}
