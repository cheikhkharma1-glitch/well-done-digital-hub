DROP POLICY IF EXISTS "Anyone submits contact" ON public.contacts;

CREATE POLICY "Anyone submits contact"
ON public.contacts
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(btrim(name)) BETWEEN 2 AND 120
  AND length(email) <= 200
  AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  AND length(btrim(message)) BETWEEN 5 AND 4000
  AND (phone IS NULL OR length(phone) <= 40)
  AND (company IS NULL OR length(company) <= 200)
  AND (project_type IS NULL OR length(project_type) <= 100)
  AND (source IS NULL OR length(source) <= 60)
  AND status = 'new'
);

ALTER TABLE public.contacts
  ADD CONSTRAINT contacts_name_len CHECK (length(btrim(name)) BETWEEN 2 AND 120),
  ADD CONSTRAINT contacts_email_fmt CHECK (length(email) <= 200 AND email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  ADD CONSTRAINT contacts_message_len CHECK (length(btrim(message)) BETWEEN 5 AND 4000),
  ADD CONSTRAINT contacts_phone_len CHECK (phone IS NULL OR length(phone) <= 40),
  ADD CONSTRAINT contacts_company_len CHECK (company IS NULL OR length(company) <= 200),
  ADD CONSTRAINT contacts_project_type_len CHECK (project_type IS NULL OR length(project_type) <= 100),
  ADD CONSTRAINT contacts_source_len CHECK (source IS NULL OR length(source) <= 60);