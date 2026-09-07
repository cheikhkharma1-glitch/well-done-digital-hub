import { useState } from "react";
import { motion } from "framer-motion";
import { BadgeCheck, Sparkles, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePerfTier } from "@/hooks/usePerfTier";
import team1 from "@/assets/team-1.jpg";
import team2 from "@/assets/team-2.jpg";
import team3 from "@/assets/team-3.jpg";
import team4 from "@/assets/team-4.jpg";

type Member = {
  name: string;
  role: string;
  unit: string;
  photo: string;
  bio: string;
  expertises: string[];
  certifications: string[];
};

const team: Member[] = [
  {
    name: "Mamadou Diallo",
    role: "Lead Developer",
    unit: "Ingénierie logicielle",
    photo: team1,
    bio: "Il conçoit les architectures applicatives et encadre la qualité du code sur l'ensemble des projets web et mobile.",
    expertises: ["React & TypeScript", "Node.js / API", "Architecture microservices", "PostgreSQL"],
    certifications: ["AWS Certified Developer", "Scrum Master (PSM I)"],
  },
  {
    name: "Awa Ndiaye",
    role: "Analyste Cybersécurité",
    unit: "Sécurité & conformité",
    photo: team2,
    bio: "Elle pilote les audits, les tests d'intrusion et la mise en conformité des systèmes d'information de nos clients.",
    expertises: ["Tests d'intrusion", "Zero-Trust", "Réponse à incident", "Sensibilisation des équipes"],
    certifications: ["CEH", "ISO 27001 Lead Implementer"],
  },
  {
    name: "Ibrahima Sarr",
    role: "Ingénieur DevOps & Cloud",
    unit: "Infrastructure",
    photo: team3,
    bio: "Il industrialise les déploiements, l'observabilité et la résilience des plateformes en production.",
    expertises: ["Kubernetes", "CI/CD", "Terraform", "Supervision & FinOps"],
    certifications: ["CKA", "Azure Administrator (AZ-104)"],
  },
  {
    name: "Fatou Sow",
    role: "Product & UX Designer",
    unit: "Expérience utilisateur",
    photo: team4,
    bio: "Elle transforme les besoins métier en parcours clairs, accessibles et mesurables, du prototype au produit livré.",
    expertises: ["Recherche utilisateur", "Design system", "Prototypage Figma", "Accessibilité"],
    certifications: ["Google UX Design", "Accessibilité WCAG 2.2"],
  },
];

export function TeamGallery() {
  const { reduce, lite } = usePerfTier();
  const [selected, setSelected] = useState<Member | null>(null);

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {team.map((m, i) => (
          <motion.button
            key={m.name}
            type="button"
            onClick={() => setSelected(m)}
            initial={reduce ? false : { opacity: 0, y: 28 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.07 }}
            whileHover={lite ? undefined : { y: -8, rotateX: 5, rotateY: -5 }}
            style={lite ? undefined : { transformStyle: "preserve-3d", perspective: 900 }}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card text-left shadow-soft transition-smooth hover:border-primary/40 hover:shadow-elegant focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              <img
                src={m.photo}
                alt={`${m.name}, ${m.role} chez Well Done Services Company`}
                width={768}
                height={768}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-[#0b1226] via-[#0b1226]/25 to-transparent"
              />
              <span className="absolute left-3 top-3 rounded-full border border-white/20 bg-black/40 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-white/85 backdrop-blur">
                {m.unit}
              </span>
              <div className="absolute inset-x-4 bottom-4">
                <p className="font-display text-lg font-bold text-white">{m.name}</p>
                <p className="text-sm text-[color:var(--cyber-cyan)]">{m.role}</p>
              </div>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                {m.certifications.length} certification{m.certifications.length > 1 ? "s" : ""}
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
                Voir le profil <Sparkles className="h-3.5 w-3.5" />
              </span>
            </div>
          </motion.button>
        ))}
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-2xl overflow-hidden p-0">
          {selected && (
            <div className="grid sm:grid-cols-5">
              <div className="relative sm:col-span-2">
                <img
                  src={selected.photo}
                  alt={`Portrait de ${selected.name}`}
                  width={768}
                  height={768}
                  className="h-48 w-full object-cover sm:h-full"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent"
                />
              </div>
              <div className="sm:col-span-3 p-6">
                <DialogHeader className="text-left">
                  <DialogTitle className="font-display text-2xl">{selected.name}</DialogTitle>
                  <DialogDescription className="text-primary">
                    {selected.role} · {selected.unit}
                  </DialogDescription>
                </DialogHeader>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{selected.bio}</p>

                <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  Expertises
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selected.expertises.map((e) => (
                    <span
                      key={e}
                      className="rounded-full border border-border bg-surface px-3 py-1 text-xs"
                    >
                      {e}
                    </span>
                  ))}
                </div>

                <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  Certifications
                </p>
                <ul className="mt-2 space-y-2">
                  {selected.certifications.map((c) => (
                    <li key={c} className="flex items-center gap-2 text-sm">
                      <BadgeCheck className="h-4 w-4 text-primary" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          <span className="sr-only">
            <X className="h-4 w-4" />
          </span>
        </DialogContent>
      </Dialog>
    </>
  );
}
