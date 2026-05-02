import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Mail, Phone, Building2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/demandes")({ component: AdminContacts });

type C = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  project_type: string | null;
  message: string;
  status: string;
  created_at: string;
};

function AdminContacts() {
  const [items, setItems] = useState<C[]>([]);

  const load = async () => {
    const { data } = await supabase.from("contacts").select("*").order("created_at", { ascending: false });
    setItems((data ?? []) as C[]);
  };
  useEffect(() => { load(); }, []);

  const setStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("contacts").update({ status }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    load();
  };
  const remove = async (id: string) => {
    if (!confirm("Supprimer cette demande ?")) return;
    const { error } = await supabase.from("contacts").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Supprimé"); load();
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-2">Demandes clients</h1>
      <p className="text-muted-foreground mb-8">{items.length} demande(s) reçue(s).</p>

      <div className="space-y-4">
        {items.map((c) => (
          <div key={c.id} className="p-6 rounded-2xl bg-card border border-border">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-display text-lg font-bold">{c.name}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${c.status === "new" ? "bg-primary-glow/20 text-primary" : c.status === "done" ? "bg-muted text-muted-foreground" : "bg-accent text-accent-foreground"}`}>
                    {c.status}
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {c.email}</span>
                  {c.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {c.phone}</span>}
                  {c.company && <span className="flex items-center gap-1"><Building2 className="h-3 w-3" /> {c.company}</span>}
                  {c.project_type && <span className="px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">{c.project_type}</span>}
                </div>
              </div>
              <div className="text-xs text-muted-foreground">{new Date(c.created_at).toLocaleString("fr-FR")}</div>
            </div>
            <p className="text-sm text-foreground/85 whitespace-pre-wrap mb-4">{c.message}</p>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={() => setStatus(c.id, "in_progress")}>En cours</Button>
              <Button size="sm" variant="outline" onClick={() => setStatus(c.id, "done")}>Traité</Button>
              <a href={`mailto:${c.email}`}><Button size="sm">Répondre par email</Button></a>
              <Button size="sm" variant="ghost" onClick={() => remove(c.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="p-12 text-center text-muted-foreground bg-card rounded-2xl border border-border">Aucune demande pour le moment</div>}
      </div>
    </div>
  );
}
