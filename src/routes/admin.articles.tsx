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

export const Route = createFileRoute("/admin/articles")({ component: AdminArticles });

type A = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  cover_image_url: string | null;
  published: boolean;
  published_at: string | null;
};

const empty: A = { title: "", slug: "", excerpt: "", content: "", category: "", cover_image_url: "", published: false, published_at: null };

function slugify(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function AdminArticles() {
  const [items, setItems] = useState<A[]>([]);
  const [editing, setEditing] = useState<A | null>(null);
  const [open, setOpen] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("articles").select("*").order("created_at", { ascending: false });
    setItems((data ?? []) as A[]);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!editing) return;
    const payload = {
      ...editing,
      slug: editing.slug || slugify(editing.title),
      published_at: editing.published && !editing.published_at ? new Date().toISOString() : editing.published_at,
    };
    const { id, ...rest } = payload;
    const res = id
      ? await supabase.from("articles").update(rest).eq("id", id)
      : await supabase.from("articles").insert(rest);
    if (res.error) { toast.error(res.error.message); return; }
    toast.success("Enregistré");
    setOpen(false); setEditing(null); load();
  };

  const remove = async (id: string) => {
    if (!confirm("Supprimer cet article ?")) return;
    const { error } = await supabase.from("articles").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Supprimé"); load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold">Articles</h1>
          <p className="text-muted-foreground">Publiez vos contenus blog.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditing(empty)} className="bg-gradient-primary"><Plus className="h-4 w-4 mr-1" /> Nouveau</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing?.id ? "Modifier" : "Nouvel article"}</DialogTitle></DialogHeader>
            {editing && (
              <div className="space-y-4">
                <div><Label>Titre</Label><Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value, slug: editing.slug || slugify(e.target.value) })} /></div>
                <div><Label>Slug</Label><Input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: slugify(e.target.value) })} /></div>
                <div><Label>Catégorie</Label><Input value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} /></div>
                <div><Label>Image de couverture (URL)</Label><Input value={editing.cover_image_url ?? ""} onChange={(e) => setEditing({ ...editing, cover_image_url: e.target.value })} /></div>
                <div><Label>Extrait</Label><Textarea rows={2} value={editing.excerpt} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} /></div>
                <div><Label>Contenu (markdown simple : ## titre, lignes vides)</Label><Textarea rows={10} value={editing.content} onChange={(e) => setEditing({ ...editing, content: e.target.value })} /></div>
                <div className="flex items-center gap-3">
                  <Switch checked={editing.published} onCheckedChange={(v) => setEditing({ ...editing, published: v })} />
                  <Label>Publier</Label>
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
            {items.map((a) => (
              <tr key={a.id} className="border-t border-border">
                <td className="px-4 py-3 font-medium">{a.title}</td>
                <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">{a.category}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${a.published ? "bg-primary-glow/20 text-primary" : "bg-muted text-muted-foreground"}`}>
                    {a.published ? "Publié" : "Brouillon"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Button size="sm" variant="ghost" onClick={() => { setEditing(a); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                  <Button size="sm" variant="ghost" onClick={() => remove(a.id!)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={4} className="px-4 py-12 text-center text-muted-foreground">Aucun article</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
