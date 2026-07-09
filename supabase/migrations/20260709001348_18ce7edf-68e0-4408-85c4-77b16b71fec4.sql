ALTER TABLE public.contacts ADD COLUMN IF NOT EXISTS source text;

-- Update validation trigger to accept and cap `source`
CREATE OR REPLACE FUNCTION public.validate_contact_input()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  IF length(NEW.name) < 2 OR length(NEW.name) > 120 THEN
    RAISE EXCEPTION 'Invalid name length';
  END IF;
  IF NEW.email !~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' OR length(NEW.email) > 200 THEN
    RAISE EXCEPTION 'Invalid email';
  END IF;
  IF length(NEW.message) < 5 OR length(NEW.message) > 4000 THEN
    RAISE EXCEPTION 'Invalid message length';
  END IF;
  IF NEW.phone IS NOT NULL AND length(NEW.phone) > 40 THEN
    RAISE EXCEPTION 'Invalid phone';
  END IF;
  IF NEW.company IS NOT NULL AND length(NEW.company) > 200 THEN
    RAISE EXCEPTION 'Invalid company';
  END IF;
  IF NEW.project_type IS NOT NULL AND length(NEW.project_type) > 100 THEN
    RAISE EXCEPTION 'Invalid project type';
  END IF;
  IF NEW.source IS NOT NULL AND length(NEW.source) > 60 THEN
    RAISE EXCEPTION 'Invalid source';
  END IF;
  NEW.status := 'new';
  RETURN NEW;
END;
$function$;