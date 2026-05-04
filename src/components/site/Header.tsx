import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { to: "/", label: "Accueil" },
  { to: "/services", label: "Services" },
  { to: "/realisations", label: "Réalisations" },
  { to: "/blog", label: "Blog" },
  { to: "/a-propos", label: "À propos" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      // Hide on scroll down past threshold, show on scroll up
      if (y > 120 && y > lastY + 4) setHidden(true);
      else if (y < lastY - 4) setHidden(false);
      lastY = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50",
        "transition-[transform,background-color,backdrop-filter,box-shadow,border-color,height] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        "transform-gpu will-change-transform",
        mounted ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0",
        hidden && !open ? "-translate-y-full" : "translate-y-0",
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border/60 shadow-soft"
          : "bg-transparent border-b border-transparent",
      )}
    >
      <div
        className={cn(
          "container mx-auto px-4 lg:px-8 flex items-center justify-between",
          "transition-[height] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          scrolled ? "h-14 lg:h-16" : "h-16 lg:h-20",
        )}
      >
        <Link to="/" className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-md">
          <span
            className={cn(
              "inline-flex items-center justify-center rounded-md transition-all duration-500",
              "dark:bg-background/90 dark:p-1.5 dark:shadow-sog dark:ring-1 dark:ring-border/40",
            )}
          >
            <img
              src={logo}
              alt="Well Done Services Company"
              className={cn(
                "w-auto transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                "group-hover:scale-105 group-hover:drop-shadow-[0_4px_12px_hsl(var(--primary)/0.25)]",
                scrolled ? "h-9 lg:h-10" : "h-11 lg:h-14",
              )}
            />
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l, i) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              style={{ animationDelay: `${i * 60}ms` }}
              className={cn(
                "relative px-4 py-2 text-sm font-medium rounded-md transition-colors duration-300",
                "hover:text-primary animate-fade-in",
                "after:content-[''] after:absolute after:left-3 after:right-3 after:-bottom-0.5 after:h-0.5",
                "after:bg-gradient-primary after:rounded-full after:origin-center",
                "after:scale-x-0 after:transition-transform after:duration-300 after:ease-out",
                "hover:after:scale-x-100",
              )}
              activeProps={{
                className:
                  "text-primary font-semibold bg-primary/5 after:scale-x-100",
              }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <ThemeToggle />
          <Button
            asChild
            variant="default"
            className="bg-gradient-primary shadow-soft hover:shadow-glow hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
          >
            <Link to="/contact">Demander un devis</Link>
          </Button>
        </div>

        <div className="lg:hidden flex items-center gap-1">
        <ThemeToggle />

        <button
          className="lg:hidden p-2 rounded-md hover:bg-accent transition-colors relative"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
          aria-expanded={open}
        >
          <span className="relative block h-5 w-5">
            <Menu
              className={cn(
                "h-5 w-5 absolute inset-0 transition-all duration-300",
                open ? "opacity-0 rotate-90 scale-75" : "opacity-100 rotate-0 scale-100",
              )}
            />
            <X
              className={cn(
                "h-5 w-5 absolute inset-0 transition-all duration-300",
                open ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-75",
              )}
            />
          </span>
        </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "lg:hidden overflow-hidden border-t border-border/60 bg-background/95 backdrop-blur-xl",
          "transition-[max-height,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <nav className="container mx-auto px-4 py-4 flex flex-col gap-1">
          {links.map((l, i) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              style={{ animationDelay: open ? `${i * 50}ms` : "0ms" }}
              className={cn(
                "px-3 py-2.5 rounded-md hover:bg-accent text-sm font-medium transition-colors",
                open && "animate-fade-in",
              )}
              activeProps={{ className: "bg-accent text-primary font-semibold" }}
            >
              {l.label}
            </Link>
          ))}
          <Button asChild className="mt-2 bg-gradient-primary shadow-soft hover:shadow-glow transition-all">
            <Link to="/contact" onClick={() => setOpen(false)}>Demander un devis</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
