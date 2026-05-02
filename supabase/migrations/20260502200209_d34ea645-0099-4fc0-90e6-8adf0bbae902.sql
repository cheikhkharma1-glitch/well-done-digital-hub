CREATE OR REPLACE FUNCTION public.validate_contact_input()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
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
  -- Always force status to 'new' on insert from public
  NEW.status := 'new';
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_validate_contact
  BEFORE INSERT ON public.contacts
  FOR EACH ROW EXECUTE FUNCTION public.validate_contact_input();

REVOKE EXECUTE ON FUNCTION public.validate_contact_input() FROM PUBLIC, anon, authenticated;