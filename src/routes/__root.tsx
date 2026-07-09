import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { MotionToggle } from "@/components/site/MotionToggle";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Well Done Services Company — Solutions IT & transformation digitale" },
      { name: "description", content: "Well Done Services Company SARL : développement web, ERP/CRM, gestion scolaire, maintenance et réseaux. Acteur de la transformation digitale au Sénégal et en Afrique." },
      { name: "author", content: "Well Done Services Company SARL" },
      { property: "og:title", content: "Well Done Services Company — Solutions IT & transformation digitale" },
      { property: "og:description", content: "Well Done Services Company SARL : développement web, ERP/CRM, gestion scolaire, maintenance et réseaux. Acteur de la transformation digitale au Sénégal et en Afrique." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Well Done Services Company — Solutions IT & transformation digitale" },
      { name: "twitter:description", content: "Well Done Services Company SARL : développement web, ERP/CRM, gestion scolaire, maintenance et réseaux. Acteur de la transformation digitale au Sénégal et en Afrique." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/81825bfa-3fd4-4951-b733-d54fc8301a19/id-preview-77a163da--11705bce-94e6-408b-b1f2-0182e744b6b1.lovable.app-1777752611989.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/81825bfa-3fd4-4951-b733-d54fc8301a19/id-preview-77a163da--11705bce-94e6-408b-b1f2-0182e744b6b1.lovable.app-1777752611989.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700;800&family=Manrope:wght@400;500;600;700&display=swap" },
    ],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Well Done Services Company",
        legalName: "Well Done Services Company SARL",
        url: "https://well-done-digital-hub.lovable.app",
        description: "Cybersécurité, développement web & mobile, ERP/CRM et transformation digitale au Sénégal et en Afrique.",
        areaServed: ["SN", "Africa"],
        contactPoint: { "@type": "ContactPoint", contactType: "customer support", availableLanguage: ["French", "English"] },
      }),
    }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <HeadContent />
      </head>
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cyber-cyan)]"
        >
          Aller au contenu principal
        </a>
        {children}
        <MotionToggle />
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return <Outlet />;
}
