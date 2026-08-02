ALTER TABLE public.site_leadership
  ADD COLUMN IF NOT EXISTS portraits jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS active_portrait text;