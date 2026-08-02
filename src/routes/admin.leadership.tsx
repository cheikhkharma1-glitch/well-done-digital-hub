import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/leadership")({
  component: AdminLeadership,
});

type Stat = { k: string; v: string };
type PortraitVariant = {
  id: string;
  label: string;
  url: string;
  fit: "contain" | "cover";
  scale: number;
  pos_x: number;
  pos_y: number;
};
type Row = {
  id: string;
  badge: string;
  title_prefix: string;
  title_highlight: string;
  title_suffix: string;
  quote1: string;
  quote2: string;
  quote3: string;
  ceo_name: string;
  ceo_role: string;
  ceo_initials: string;
  portrait_url: string | null;
  portraits: PortraitVariant[];
  active_portrait: string | null;
  stats: Stat[];
};

const newVariant = (): PortraitVariant => ({
  id: (globalThis.crypto?.randomUUID?.() ?? String(Date.now() + Math.random())),
  label: "Nouveau portrait",
  url: "",
  fit: "contain",
  scale: 1,
  pos_x: 50,
  pos_y: 50,
});

const EMPTY: Row = {
  id: "main",
  badge: "Mot du Président",
  title_prefix: "Bâtir l'Afrique",
  title_highlight: "numérique",
  title_suffix: "de demain.",
  quote1: "",
  quote2: "",
  quote3: "",
  ceo_name: "",
  ceo_role: "",
  ceo_initials: "",
  portrait_url: "",
  portraits: [],
  active_portrait: null,
  stats: [{ k: "", v: "" }, { k: "", v: "" }, { k: "", v: "" }],
};


function AdminLeadership() {
  const [row, setRow] = useState<Row>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("site_leadership").select("*").eq("id", "main").maybeSingle();
      if (data) {
        setRow({
          ...(data as any),
          stats: Array.isArray((data as any).stats) ? (data as any).stats : EMPTY.stats,
          portraits: Array.isArray((data as any).portraits) ? (data as any).portraits : [],
          active_portrait: (data as any).active_portrait ?? null,
        });
      }
      setLoading(false);
    })();
  }, []);

  const update = <K extends keyof Row>(k: K, v: Row[K]) => setRow((r) => ({ ...r, [k]: v }));
  const setStat = (i: number, field: keyof Stat, v: string) =>
    setRow((r) => ({ ...r, stats: r.stats.map((s, idx) => (idx === i ? { ...s, [field]: v } : s)) }));
  const addStat = () => setRow((r) => ({ ...r, stats: [...r.stats, { k: "", v: "" }] }));
  const rmStat = (i: number) => setRow((r) => ({ ...r, stats: r.stats.filter((_, idx) => idx !== i) }));

  // --- Variantes de portrait ---
  const setVariant = (id: string, patch: Partial<PortraitVariant>) =>
    setRow((r) => ({ ...r, portraits: r.portraits.map((p) => (p.id === id ? { ...p, ...patch } : p)) }));
  const addVariant = () =>
    setRow((r) => {
      const v = newVariant();
      return { ...r, portraits: [...r.portraits, v], active_portrait: r.active_portrait ?? v.id };
    });
  const rmVariant = (id: string) =>
    setRow((r) => {
      const portraits = r.portraits.filter((p) => p.id !== id);
      return { ...r, portraits, active_portrait: r.active_portrait === id ? (portraits[0]?.id ?? null) : r.active_portrait };
    });
  const uploadVariant = (id: string, file: File) => {
    const reader = new FileReader();
    reader.onload = () => setVariant(id, { url: String(reader.result) });
    reader.readAsDataURL(file);
  };

  const save = async () => {
    setSaving(true);
    const payload = {
      ...row,
      portrait_url: row.portrait_url?.trim() || null,
      portraits: row.portraits.filter((p) => p.url.trim()),
      stats: row.stats.filter((s) => s.k.trim() || s.v.trim()),
    };
    const { error } = await supabase.from("site_leadership").upsert(payload as any, { onConflict: "id" });
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success("Section « Mot du Président » enregistrée");
  };

  const uploadPortrait = async (file: File) => {
    // Store portraits inline as data URL for simplicity (no bucket setup required).
    const reader = new FileReader();
    reader.onload = () => update("portrait_url", String(reader.result));
    reader.readAsDataURL(file);
  };


  if (loading) return <div className="text-muted-foreground">Chargement…</div>;

  return (
    <div className="max-w-4xl">
      <h1 className="font-display text-3xl font-bold mb-2">Mot du Président</h1>
      <p className="text-muted-foreground mb-8">
        Modifiez le portrait, le discours en trois temps et les statistiques affichés sur la page d'accueil.
      </p>

      <div className="space-y-8 p-6 rounded-2xl bg-card border border-border">
        <section className="grid md:grid-cols-2 gap-5">
          <div>
            <Label>Badge</Label>
            <Input value={row.badge} onChange={(e) => update("badge", e.target.value)} />
          </div>
          <div>
            <Label>Initiales (avatar)</Label>
            <Input value={row.ceo_initials} onChange={(e) => update("ceo_initials", e.target.value)} maxLength={4} />
          </div>
          <div>
            <Label>Titre — début</Label>
            <Input value={row.title_prefix} onChange={(e) => update("title_prefix", e.target.value)} />
          </div>
          <div>
            <Label>Titre — mot en dégradé</Label>
            <Input value={row.title_highlight} onChange={(e) => update("title_highlight", e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <Label>Titre — fin</Label>
            <Input value={row.title_suffix} onChange={(e) => update("title_suffix", e.target.value)} />
          </div>
          <div>
            <Label>Nom du dirigeant</Label>
            <Input value={row.ceo_name} onChange={(e) => update("ceo_name", e.target.value)} />
          </div>
          <div>
            <Label>Fonction</Label>
            <Input value={row.ceo_role} onChange={(e) => update("ceo_role", e.target.value)} />
          </div>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold mb-3">Portrait</h2>
          <div className="flex flex-col md:flex-row gap-4 items-start">
            <div className="w-40 h-52 rounded-xl bg-muted overflow-hidden flex items-center justify-center border">
              {row.portrait_url ? (
                <img src={row.portrait_url} alt="Portrait" className="w-full h-full object-contain" />
              ) : (
                <span className="text-xs text-muted-foreground">Aperçu</span>
              )}
            </div>
            <div className="flex-1 space-y-3 w-full">
              <div>
                <Label>URL du portrait (facultatif)</Label>
                <Input
                  value={row.portrait_url ?? ""}
                  onChange={(e) => update("portrait_url", e.target.value)}
                  placeholder="https://… ou uploader ci-dessous"
                />
              </div>
              <div>
                <Label>Ou téléverser une image</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && uploadPortrait(e.target.files[0])}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Pour une meilleure intégration, utilisez une image détourée (fond transparent).
                </p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="font-display text-lg font-semibold">Variantes de portrait</h2>
              <p className="text-xs text-muted-foreground">
                Créez plusieurs versions (URL, recadrage, taille) et choisissez celle affichée sur le site.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={addVariant}>
              <Plus className="h-4 w-4 mr-1" /> Ajouter une variante
            </Button>
          </div>

          <div className="space-y-4">
            {row.portraits.map((p) => {
              const active = row.active_portrait === p.id;
              return (
                <div
                  key={p.id}
                  className={`rounded-xl border p-4 ${active ? "border-primary ring-1 ring-primary/30" : "border-border"}`}
                >
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-40 h-52 shrink-0 rounded-lg bg-muted overflow-hidden border">
                      {p.url ? (
                        <img
                          src={p.url}
                          alt={p.label}
                          className="w-full h-full"
                          style={{
                            objectFit: p.fit,
                            objectPosition: `${p.pos_x}% ${p.pos_y}%`,
                            transform: `scale(${p.scale})`,
                            transformOrigin: "bottom center",
                          }}
                        />
                      ) : (
                        <div className="w-full h-full grid place-items-center text-xs text-muted-foreground">
                          Aperçu
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-3">
                      <div className="grid md:grid-cols-2 gap-3">
                        <div>
                          <Label className="text-xs">Nom de la variante</Label>
                          <Input value={p.label} onChange={(e) => setVariant(p.id, { label: e.target.value })} />
                        </div>
                        <div>
                          <Label className="text-xs">Cadrage</Label>
                          <select
                            className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                            value={p.fit}
                            onChange={(e) => setVariant(p.id, { fit: e.target.value as "contain" | "cover" })}
                          >
                            <option value="contain">Entier (contain)</option>
                            <option value="cover">Rempli / recadré (cover)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <Label className="text-xs">URL de l'image</Label>
                        <Input
                          value={p.url}
                          onChange={(e) => setVariant(p.id, { url: e.target.value })}
                          placeholder="https://…"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Ou téléverser</Label>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => e.target.files?.[0] && uploadVariant(p.id, e.target.files[0])}
                        />
                      </div>

                      <div className="grid sm:grid-cols-3 gap-3">
                        <div>
                          <Label className="text-xs">Taille ({p.scale.toFixed(2)}×)</Label>
                          <input
                            type="range"
                            min={0.5}
                            max={1.6}
                            step={0.05}
                            value={p.scale}
                            onChange={(e) => setVariant(p.id, { scale: Number(e.target.value) })}
                            className="w-full accent-primary"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Position horizontale ({p.pos_x}%)</Label>
                          <input
                            type="range"
                            min={0}
                            max={100}
                            value={p.pos_x}
                            onChange={(e) => setVariant(p.id, { pos_x: Number(e.target.value) })}
                            className="w-full accent-primary"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Position verticale ({p.pos_y}%)</Label>
                          <input
                            type="range"
                            min={0}
                            max={100}
                            value={p.pos_y}
                            onChange={(e) => setVariant(p.id, { pos_y: Number(e.target.value) })}
                            className="w-full accent-primary"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <Button
                          type="button"
                          size="sm"
                          variant={active ? "default" : "outline"}
                          onClick={() => update("active_portrait", p.id)}
                        >
                          {active ? "Variante affichée" : "Afficher cette variante"}
                        </Button>
                        <Button type="button" size="sm" variant="ghost" onClick={() => rmVariant(p.id)}>
                          <Trash2 className="h-4 w-4 mr-1" /> Supprimer
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {row.portraits.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Aucune variante. Le portrait ci-dessus est utilisé par défaut.
              </p>
            )}
          </div>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold mb-3">Discours en trois temps</h2>
          <div className="space-y-4">
            {(["quote1", "quote2", "quote3"] as const).map((f, i) => (
              <div key={f}>
                <Label>Paragraphe {i + 1}</Label>
                <Textarea rows={4} value={row[f]} onChange={(e) => update(f, e.target.value)} />
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-lg font-semibold">Statistiques</h2>
            <Button variant="outline" size="sm" onClick={addStat}>
              <Plus className="h-4 w-4 mr-1" /> Ajouter
            </Button>
          </div>
          <div className="space-y-3">
            {row.stats.map((s, i) => (
              <div key={i} className="grid grid-cols-[1fr_2fr_auto] gap-2 items-end">
                <div>
                  <Label className="text-xs">Valeur</Label>
                  <Input value={s.k} onChange={(e) => setStat(i, "k", e.target.value)} placeholder="+10 ans" />
                </div>
                <div>
                  <Label className="text-xs">Libellé</Label>
                  <Input value={s.v} onChange={(e) => setStat(i, "v", e.target.value)} placeholder="d'expertise IT" />
                </div>
                <Button variant="ghost" size="icon" onClick={() => rmStat(i)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {row.stats.length === 0 && <p className="text-sm text-muted-foreground">Aucune statistique.</p>}
            <p className="text-xs text-muted-foreground">Seules les 3 premières s'affichent sur le site.</p>
          </div>
        </section>

        <div className="flex justify-end">
          <Button onClick={save} disabled={saving}>
            <Save className="h-4 w-4 mr-2" /> {saving ? "Enregistrement…" : "Enregistrer"}
          </Button>
        </div>
      </div>
    </div>
  );
}
