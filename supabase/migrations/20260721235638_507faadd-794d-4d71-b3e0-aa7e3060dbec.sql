
CREATE TABLE public.site_leadership (
  id TEXT PRIMARY KEY DEFAULT 'main',
  badge TEXT NOT NULL DEFAULT 'Mot du Président',
  title_prefix TEXT NOT NULL DEFAULT 'Bâtir l''Afrique',
  title_highlight TEXT NOT NULL DEFAULT 'numérique',
  title_suffix TEXT NOT NULL DEFAULT 'de demain.',
  quote1 TEXT NOT NULL DEFAULT '',
  quote2 TEXT NOT NULL DEFAULT '',
  quote3 TEXT NOT NULL DEFAULT '',
  ceo_name TEXT NOT NULL DEFAULT 'M. Cheikh Mbacke Kharma',
  ceo_role TEXT NOT NULL DEFAULT 'Président Directeur Général',
  ceo_initials TEXT NOT NULL DEFAULT 'CK',
  portrait_url TEXT,
  stats JSONB NOT NULL DEFAULT '[{"k":"+10 ans","v":"d''expertise IT"},{"k":"50+","v":"clients accompagnés"},{"k":"3 pays","v":"de présence"}]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.site_leadership TO anon, authenticated;
GRANT ALL ON public.site_leadership TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.site_leadership TO authenticated;

ALTER TABLE public.site_leadership ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read leadership" ON public.site_leadership FOR SELECT USING (true);
CREATE POLICY "Admins can insert leadership" ON public.site_leadership FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update leadership" ON public.site_leadership FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete leadership" ON public.site_leadership FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_site_leadership_updated_at BEFORE UPDATE ON public.site_leadership FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.site_leadership (id, quote1, quote2, quote3) VALUES (
  'main',
  'La technologie n''est puissante que lorsqu''elle sert l''humain. Chez Well Done Services Company, chaque ligne de code, chaque serveur déployé et chaque système sécurisé porte une ambition : transformer les entreprises africaines en champions du numérique mondial.',
  'Nous croyons en une excellence sans compromis, en une innovation responsable, et en des équipes passionnées qui bâtissent, ligne après ligne, un continent connecté, sécurisé et souverain sur ses données.',
  'Rejoignez-nous. Ensemble, faisons de la transformation digitale un levier de performance, un moteur de croissance et une promesse tenue.'
);
