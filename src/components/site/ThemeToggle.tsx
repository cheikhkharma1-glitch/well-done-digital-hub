import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem("theme") as Theme | null;
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const initial = getInitialTheme();
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
    setMounted(true);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem("theme", next);
    } catch {}
  };

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Activer le thème clair" : "Activer le thème sombre"}
      aria-pressed={isDark}
      className={cn(
        "relative inline-flex items-center justify-center h-9 w-9 rounded-md",
        "border border-border/60 bg-background/40 backdrop-blur-sm",
        "text-foreground/80 hover:text-primary hover:border-primary/40",
        "transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
        "hover:shadow-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
        className,
      )}
    >
      <span className="sr-only">Basculer le thème</span>
      <span className="relative block h-4 w-4">
        <Sun
          className={cn(
            "h-4 w-4 absolute inset-0 transition-all duration-500",
            mounted && isDark ? "opacity-0 -rotate-90 scale-50" : "opacity-100 rotate-0 scale-100",
          )}
        />
        <Moon
          className={cn(
            "h-4 w-4 absolute inset-0 transition-all duration-500",
            mounted && isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-90 scale-50",
          )}
        />
      </span>
    </button>
  );
}
