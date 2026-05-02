import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/projets")({
  component: AdminProjects,
});

type P = {
  id?: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  image_url: string | null;
  technologies: string[] | null;
  results: string | null;
  client_name: string | null;
  project_url: string | null;
  published: boolean;
  display_order: number;
};

const empty: P = { title: "", slug: "", description: "", category: "", image_url: "", technologies: [], results: "", client_name: "", project_url: "", published: true, display_order: 0 };

function slugify(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function AdminProjects() {
  const [items, setItems] = useState<P[]>([]);
  const [editing, setEditing] = useState<P | null>(null);
  const [open, setOpen] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("projects").select("*").order("display_order");
    setItems((data ?? []) as P[]);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    const payload = { ...editing, slug: editing.slug || slugify(editing.title), technologies: editing.technologies ?? [] };
    const { id, ...rest } = payload;
    const res = id
      ? await supabase.from("projects").update(rest).eq("id", id)
      : await supabase.from("projects").insert(rest);
    if (res.error) { toast.error(res.error.message); return; }
    toast.success("Enregistré");
    setOpen(false); setEditing(null); load();
  };

  const remove = async (id: string) => {
    if (!confirm("Supprimer ce projet ?")) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Supprimé"); load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold">Projets</h1>
          <p className="text-muted-foreground">Gérez votre portfolio.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditing(empty)} className="bg-gradient-primary"><Plus className="h-4 w-4 mr-1" /> Nouveau</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing?.id ? "Modifier" : "Nouveau projet"}</DialogTitle></DialogHeader>
            {editing && (
              <div className="space-y-4">
                <div><Label>Titre</Label><Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value, slug: editing.slug || slugify(e.target.value) })} /></div>
                <div><Label>Slug</Label><Input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: slugify(e.target.value) })} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Catégorie</Label><Input value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} /></div>
                  <div><Label>Client</Label><Input value={editing.client_name ?? ""} onChange={(e) => setEditing({ ...editing, client_name: e.target.value })} /></div>
                </div>
                <div><Label>Description</Label><Textarea rows={3} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></div>
                <div><Label>Image (URL)</Label><Input value={editing.image_url ?? ""} onChange={(e) => setEditing({ ...editing, image_url: e.target.value })} /></div>
                <div><Label>URL du projet</Label><Input value={editing.project_url ?? ""} onChange={(e) => setEditing({ ...editing, project_url: e.target.value })} /></div>
                <div><Label>Technologies (séparées par virgule)</Label><Input value={(editing.technologies ?? []).join(", ")} onChange={(e) => setEditing({ ...editing, technologies: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} /></div>
                <div><Label>Résultats</Label><Textarea rows={2} value={editing.results ?? ""} onChange={(e) => setEditing({ ...editing, results: e.target.value })} /></div>
                <div className="flex items-center gap-3">
                  <Switch checked={editing.published} onCheckedChange={(v) => setEditing({ ...editing, published: v })} />
                  <Label>Publié</Label>
                  <div className="ml-auto"><Label>Ordre</Label><Input type="number" className="w-24" value={editing.display_order} onChange={(e) => setEditing({ ...editing, display_order: Number(e.target.value) })} /></div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
              <Button onClick={save} className="bg-gradient-primary">Enregistrer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-2xl bg-card border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface text-left">
            <tr>
              <th className="px-4 py-3">Titre</th>
              <th className="px-4 py-3 hidden md:table-cell">Catégorie</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id} className="border-t border-border">
                <td className="px-4 py-3 font-medium">{p.title}</td>
                <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">{p.category}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${p.published ? "bg-primary-glow/20 text-primary" : "bg-muted text-muted-foreground"}`}>
                    {p.published ? "Publié" : "Brouillon"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Button size="sm" variant="ghost" onClick={() => { setEditing(p); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => remove(p.id!)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={4} className="px-4 py-12 text-center text-muted-foreground">Aucun projet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
