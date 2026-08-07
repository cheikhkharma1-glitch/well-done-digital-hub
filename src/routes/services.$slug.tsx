import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Clock,
  PackageCheck,
  Sparkles,
  Cpu,
  Target,
  MessageCircle,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Holo3DTitle } from "@/components/site/Holo3DTitle";
import { services, getService } from "@/lib/services-data";
import { WHATSAPP_NUMBER } from "@/routes/contact";

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const service = getService(params.slug);
    if (!service) throw notFound();
    return { title: service.title, intro: service.intro };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Service introuvable — Well Done Services Company" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const title = `${loaderData.title} — Well Done Services Company`;
    return {
      meta: [
        { title },
        { name: "description", content: loaderData.intro },
        { property: "og:title", content: title },
        { property: "og:description", content: loaderData.intro },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: ServiceNotFound,
  component: ServiceDetailPage,
});

function ServiceNotFound() {
  return (
    <SiteLayout>
      <section className="container mx-auto px-4 lg:px-8 py-32 text-center">
        <h1 className="font-display text-3xl font-extrabold mb-4">Service introuvable</h1>
        <p className="text-muted-foreground mb-8">Ce service n'existe pas ou a été renommé.</p>
        <Button asChild>
          <Link to="/services">Voir tous nos services</Link>
        </Button>
      </section>
    </SiteLayout>
  );
}

function ServiceDetailPage() {
  const { slug } = Route.useParams();
  const reduce = useReducedMotion();
  const service = getService(slug)!;
  const others = services.filter((s) => s.slug !== slug);
  const Icon = service.icon;

  const titleWords = service.title.split(" ").map((t, i) => ({
    t,
    c: i === 0 ? "text-holo" : "",
  }));

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-hero text-primary-foreground">
        <img
          src={service.image}
          alt={service.alt}
          className="absolute inset-0 h-full w-full object-cover opacity-25"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
        <div aria-hidden className={`absolute inset-0 bg-gradient-to-br ${service.accent} opacity-20 mix-blend-overlay`} />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#0b1226] via-[#0b1226]/70 to-[#0b1226]/40" />
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:48px_48px]"
        />

        <div className="relative container mx-auto px-4 lg:px-8 py-20 lg:py-28">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" /> Tous les services
          </Link>

          <div className="flex items-center gap-3 mb-6">
            <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${service.accent} flex items-center justify-center shadow-glow`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
            <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest backdrop-blur">
              {service.tag}
            </span>
          </div>

          <Holo3DTitle
            as="h1"
            animateOnView={false}
            words={titleWords}
            className="font-display font-extrabold leading-[1.05] mb-6 text-[clamp(1.75rem,5vw,3.75rem)]"
          />

          <p className="text-lg lg:text-xl text-white/80 max-w-2xl leading-relaxed mb-8">
            {service.intro}
          </p>

          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-gradient-cyber text-white hover:opacity-90 shadow-cyber hover:-translate-y-0.5 transition-all">
              <Link to="/contact">
                Demander un devis <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white">
              <Link to="/realisations">Voir nos réalisations</Link>
            </Button>
          </div>

          <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-md px-5 py-4">
              <div className="flex items-center gap-2 text-white/70 text-xs mb-1">
                <Clock className="h-3.5 w-3.5" /> Délai moyen
              </div>
              <div className="font-bold">{service.duration}</div>
            </div>
            {service.deliverables.slice(0, 3).map((d) => (
              <div key={d} className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-md px-5 py-4">
                <div className="flex items-center gap-2 text-white/70 text-xs mb-1">
                  <PackageCheck className="h-3.5 w-3.5" /> Livrable
                </div>
                <div className="font-bold text-sm">{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DESCRIPTION */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8 grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7">
            <p className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-3">Description</p>
            <Holo3DTitle
              words={[
                { t: "Ce", c: "" },
                { t: "que", c: "" },
                { t: "nous", c: "" },
                { t: "réalisons", c: "text-holo" },
                { t: "pour", c: "text-muted-foreground font-light" },
                { t: "vous.", c: "text-muted-foreground font-light" },
              ]}
              className="font-display font-extrabold leading-[1.1] mb-6 text-[clamp(1.4rem,4vw,2.75rem)]"
            />
            <div className="space-y-5 text-muted-foreground text-lg leading-relaxed">
              {service.description.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>

            <ul className="mt-8 grid sm:grid-cols-2 gap-3">
              {service.items.map((it) => (
                <li key={it} className="flex items-start gap-3 text-sm">
                  <span className={`mt-0.5 h-5 w-5 rounded-full bg-gradient-to-br ${service.accent} flex items-center justify-center shrink-0`}>
                    <Check className="h-3 w-3 text-white" strokeWidth={3} />
                  </span>
                  <span className="text-foreground/85">{it}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Technologies */}
          <aside className="lg:col-span-5">
            <div className="rounded-3xl border border-border bg-gradient-card p-8 shadow-soft">
              <div className="flex items-center gap-2 mb-6">
                <Cpu className="h-5 w-5 text-primary" />
                <h2 className="font-display text-xl font-bold">Technologies</h2>
              </div>
              <div className="space-y-6">
                {service.technologies.map((g) => (
                  <div key={g.group}>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                      {g.group}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {g.list.map((t) => (
                        <span
                          key={t}
                          className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* EXEMPLES */}
      <section className="py-20 lg:py-28 bg-secondary/40">
        <div className="container mx-auto px-4 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-3">Exemples concrets</p>
          <Holo3DTitle
            words={[
              { t: "Des", c: "" },
              { t: "projets", c: "" },
              { t: "livrés,", c: "text-holo" },
              { t: "des", c: "text-muted-foreground font-light" },
              { t: "résultats", c: "text-muted-foreground font-light" },
              { t: "mesurés.", c: "text-muted-foreground font-light" },
            ]}
            className="font-display font-extrabold leading-[1.1] mb-12 text-[clamp(1.4rem,4vw,2.75rem)]"
          />
          <div className="grid md:grid-cols-3 gap-6">
            {service.examples.map((ex, i) => (
              <motion.article
                key={ex.title}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="rounded-2xl bg-card border border-border p-7 shadow-soft hover:shadow-elegant transition-all hover:-translate-y-1 duration-500"
              >
                <span className={`inline-block h-1 w-10 rounded-full bg-gradient-to-r ${service.accent} mb-5`} />
                <h3 className="font-display text-lg font-bold mb-2">{ex.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{ex.context}</p>
                <p className="text-sm font-semibold text-primary">{ex.result}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFICES */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-3">Bénéfices</p>
          <Holo3DTitle
            words={[
              { t: "Ce", c: "" },
              { t: "que", c: "" },
              { t: "vous", c: "" },
              { t: "y", c: "" },
              { t: "gagnez", c: "text-holo" },
              { t: "concrètement.", c: "text-muted-foreground font-light" },
            ]}
            className="font-display font-extrabold leading-[1.1] mb-12 text-[clamp(1.4rem,4vw,2.75rem)]"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {service.benefits.map((b, i) => (
              <motion.div
                key={b.label}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="rounded-2xl bg-gradient-card border border-border p-7"
              >
                <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${service.accent} text-white flex items-center justify-center mb-4`}>
                  <Target className="h-5 w-5" />
                </div>
                <h3 className="font-display text-lg font-bold mb-2">{b.label}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{b.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA DEVIS */}
      <section className="pb-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-hero text-primary-foreground p-10 lg:p-16">
            <div aria-hidden className={`absolute -top-24 -right-24 h-72 w-72 rounded-full ${service.glow} blur-3xl`} />
            <div className="relative max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 mb-5">
                <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                <span className="text-xs font-bold uppercase tracking-widest">Devis gratuit</span>
              </div>
              <h2 className="font-display text-2xl lg:text-4xl font-extrabold mb-4">
                Parlons de votre projet {service.title.toLowerCase()}.
              </h2>
              <p className="text-white/80 mb-8">
                Décrivez-nous votre besoin : nous revenons vers vous sous 48 h avec une proposition chiffrée et un planning.
              </p>
              <Button asChild size="lg" className="bg-white text-foreground hover:bg-white/90 shadow-elegant hover:-translate-y-0.5 transition-all">
                <Link to="/contact">
                  Demander un devis <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Autres services */}
          <div className="mt-16">
            <h2 className="font-display text-xl font-bold mb-6">Autres services</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {others.map((o) => (
                <Link
                  key={o.slug}
                  to="/services/$slug"
                  params={{ slug: o.slug }}
                  className="group rounded-2xl border border-border bg-card p-6 hover:shadow-elegant transition-all hover:-translate-y-1 duration-500"
                >
                  <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${o.accent} text-white flex items-center justify-center mb-4`}>
                    <o.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display font-bold mb-1">{o.title}</h3>
                  <p className="text-sm text-muted-foreground">{o.desc}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-primary">
                    Découvrir
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
