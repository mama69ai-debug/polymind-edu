-- Auto-generate courses.slug from title when not provided
-- Notes:
-- - Only sets slug when NEW.slug is NULL/empty
-- - Keeps existing slug unchanged on updates

CREATE OR REPLACE FUNCTION public.slugify(input TEXT)
RETURNS TEXT
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT trim(both '-' from regexp_replace(lower(coalesce(input, '')), '[^a-z0-9]+', '-', 'g'))
$$;

CREATE OR REPLACE FUNCTION public.courses_set_slug()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  base_slug TEXT;
  candidate TEXT;
  suffix INT := 1;
BEGIN
  IF NEW.slug IS NOT NULL AND NEW.slug <> '' THEN
    RETURN NEW;
  END IF;

  base_slug := public.slugify(NEW.title);
  IF base_slug IS NULL OR base_slug = '' THEN
    base_slug := 'course';
  END IF;

  candidate := base_slug;

  WHILE EXISTS (SELECT 1 FROM public.courses c WHERE c.slug = candidate) LOOP
    suffix := suffix + 1;
    candidate := base_slug || '-' || suffix::text;
  END LOOP;

  NEW.slug := candidate;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_courses_set_slug ON public.courses;
CREATE TRIGGER trg_courses_set_slug
BEFORE INSERT ON public.courses
FOR EACH ROW
EXECUTE FUNCTION public.courses_set_slug();
