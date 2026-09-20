import { useRef, useState, type FormEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Sparkles, Loader2, Send, MessageCircle, Phone, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Link } from "@tanstack/react-router";
import { PHONE_DISPLAY, PHONE_TEL_HREF, whatsappHref } from "@/lib/contact-info";

/** Rendu Markdown minimal (titres ##, puces, listes numérotées, gras). */
function renderLine(line: string, i: number) {
  const bold = (t: string) =>
    t.split(/\*\*(.+?)\*\*/g).map((part, k) =>
      k % 2 === 1 ? (
        <strong key={k} className="text-foreground font-semibold">
          {part}
        </strong>
      ) : (
        <span key={k}>{part}</span>
      ),
    );

  if (line.startsWith("## ")) {
    return (
      <h4
        key={i}
        className="font-display text-sm font-bold uppercase tracking-widest mt-5 first:mt-0 mb-2 text-[oklch(0.62_0.2_255)]"
      >
        {line.slice(3)}
      </h4>
    );
  }
  if (/^[-•*]\s+/.test(line)) {
    return (
      <li key={i} className="ml-4 list-disc marker:text-[oklch(0.82_0.16_210)] leading-relaxed">
        {bold(line.replace(/^[-•*]\s+/, ""))}
      </li>
    );
  }
  if (/^\d+\.\s+/.test(line)) {
    return (
      <li key={i} className="ml-4 list-decimal marker:text-[oklch(0.82_0.16_210)] leading-relaxed">
        {bold(line.replace(/^\d+\.\s+/, ""))}
      </li>
    );
  }
  if (!line.trim()) return <div key={i} className="h-2" />;
  return (
    <p key={i} className="leading-relaxed">
      {bold(line)}
    </p>
  );
}

export function ProjectOrientation() {
  const prefersReduced = useReducedMotion();
  const [description, setDescription] = useState("");
  const [sector, setSector] = useState("");
  const [budget, setBudget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const reset = () => {
    abortRef.current?.abort();
    setAnswer("");
    setLoading(false);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (description.trim().length < 20) {
      toast.error("Décrivez votre projet en quelques phrases (20 caractères minimum).");
      return;
    }
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    setAnswer("");
    try {
      const res = await fetch("/api/orientation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, sector, budget, deadline }),
        signal: controller.signal,
      });
      if (!res.ok || !res.body) {
        toast.error((await res.text()) || "Service momentanément indisponible.");
        setLoading(false);
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setAnswer(acc);
      }
      if (!acc.trim()) {
        toast.error("Aucune réponse générée. Reformulez votre description.");
      }
    } catch (err) {
      if ((err as Error)?.name !== "AbortError") {
        toast.error("Impossible de générer l'orientation pour le moment.");
      }
    } finally {
      setLoading(false);
    }
  };

  const waText = `Bonjour Well Done Services, voici mon projet : ${description.slice(0, 500)}`;

  return (
    <section id="orientation-ia" className="relative py-16 lg:py-24 overflow-hidden">
      <div aria-hidden className="absolute inset-0 bg-grid-cyber opacity-[0.15]" />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-24 right-0 h-80 w-80 rounded-full bg-[oklch(0.82_0.16_210)]/15 blur-3xl"
        animate={prefersReduced ? undefined : { y: [0, 30, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: prefersReduced ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl mb-10"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[oklch(0.82_0.16_210)]/40 bg-[oklch(0.82_0.16_210)]/10 mb-5">
            <Sparkles className="h-3.5 w-3.5 text-[oklch(0.62_0.2_255)]" />
            <span className="text-xs font-bold uppercase tracking-widest">Orientation IA — gratuite</span>
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold mb-4">
            Décrivez votre projet, recevez une <span className="text-cyber">première orientation</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Notre moteur d'analyse identifie les services Well Done Services Company SARL adaptés à votre besoin et vous
            propose un premier cadrage : périmètre, technologies, étapes et points de vigilance.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.form
            onSubmit={onSubmit}
            initial={{ opacity: 0, x: prefersReduced ? 0 : -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="p-6 lg:p-8 rounded-2xl bg-gradient-card border border-border space-y-5"
          >
            <div className="space-y-2">
              <Label htmlFor="orientation-desc">Votre projet *</Label>
              <Textarea
                id="orientation-desc"
                rows={6}
                maxLength={4000}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex. : Nous sommes une école de 800 élèves à Thiès et souhaitons gérer les inscriptions, notes et paiements en ligne, avec un accès parents sur mobile."
              />
              <p className="text-xs text-muted-foreground">{description.length}/4000 caractères</p>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="orientation-sector">Secteur</Label>
                <Input
                  id="orientation-sector"
                  maxLength={200}
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  placeholder="Éducation, commerce…"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="orientation-budget">Enveloppe</Label>
                <Input
                  id="orientation-budget"
                  maxLength={200}
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="À définir"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="orientation-deadline">Échéance</Label>
                <Input
                  id="orientation-deadline"
                  maxLength={200}
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  placeholder="3 mois"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button type="submit" size="lg" disabled={loading} className="bg-gradient-cyber text-white shadow-cyber">
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Analyse en cours…
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" /> Obtenir mon orientation
                  </>
                )}
              </Button>
              {(answer || loading) && (
                <Button type="button" variant="outline" size="lg" onClick={reset}>
                  <RotateCcw className="h-4 w-4" /> Recommencer
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Orientation indicative générée automatiquement. Le devis final est établi après échange avec un conseiller.
            </p>
          </motion.form>

          <motion.div
            initial={{ opacity: 0, x: prefersReduced ? 0 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative p-6 lg:p-8 rounded-2xl border border-border bg-card/60 backdrop-blur-sm overflow-hidden min-h-[320px]"
          >
            <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-cyber" />
            {!answer && !loading && (
              <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground gap-3 py-12">
                <Sparkles className="h-8 w-8 text-[oklch(0.62_0.2_255)]" />
                <p className="max-w-xs text-sm">
                  Votre recommandation de services et votre premier cadrage s'afficheront ici.
                </p>
              </div>
            )}
            {loading && !answer && (
              <div className="space-y-3 animate-pulse py-4">
                {[90, 75, 82, 60, 88, 70].map((w, i) => (
                  <div key={i} className="h-3 rounded bg-muted" style={{ width: `${w}%` }} />
                ))}
              </div>
            )}
            {answer && (
              <>
                <div className="text-sm text-muted-foreground space-y-1">{answer.split("\n").map(renderLine)}</div>
                <div className="mt-6 pt-5 border-t border-border flex flex-wrap gap-3">
                  <Button asChild className="bg-gradient-cyber text-white shadow-cyber">
                    <a href={whatsappHref(waText)} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="h-4 w-4" /> Poursuivre sur WhatsApp
                    </a>
                  </Button>
                  <Button asChild variant="outline">
                    <a href={PHONE_TEL_HREF}>
                      <Phone className="h-4 w-4" /> {PHONE_DISPLAY}
                    </a>
                  </Button>
                  <Button asChild variant="ghost">
                    <Link to="/contact" search={{ source: "orientation-ia" }}>
                      Demander un devis
                    </Link>
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
