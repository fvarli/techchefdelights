-- Per-locale full-text search on RecipeTranslation
-- Maps Locale enum (EN/TR/ES) to Postgres regconfig (english/turkish/spanish snowball)
-- and populates "searchVector" via BEFORE INSERT/UPDATE trigger with weighted tsvector.

-- 1. Locale → regconfig helper
CREATE OR REPLACE FUNCTION public.tcd_locale_to_regconfig(loc text)
RETURNS regconfig AS $$
BEGIN
  RETURN CASE loc
    WHEN 'EN' THEN 'english'::regconfig
    WHEN 'TR' THEN 'turkish'::regconfig
    WHEN 'ES' THEN 'spanish'::regconfig
    ELSE 'simple'::regconfig
  END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 2. Trigger function: weighted tsvector from title (A) + description (B) + story (C)
CREATE OR REPLACE FUNCTION public.recipe_translation_search_vector_update()
RETURNS trigger AS $$
DECLARE
  cfg regconfig := public.tcd_locale_to_regconfig(NEW.locale::text);
BEGIN
  NEW."searchVector" :=
    setweight(to_tsvector(cfg, coalesce(NEW.title, '')),       'A') ||
    setweight(to_tsvector(cfg, coalesce(NEW.description, '')), 'B') ||
    setweight(to_tsvector(cfg, coalesce(NEW.story, '')),       'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Trigger fires before insert/update of source fields
DROP TRIGGER IF EXISTS recipe_translation_search_vector_trigger
  ON public."RecipeTranslation";

CREATE TRIGGER recipe_translation_search_vector_trigger
BEFORE INSERT OR UPDATE OF title, description, story, locale
ON public."RecipeTranslation"
FOR EACH ROW EXECUTE FUNCTION public.recipe_translation_search_vector_update();

-- 4. GIN index for fast full-text queries
CREATE INDEX IF NOT EXISTS "RecipeTranslation_searchVector_idx"
ON public."RecipeTranslation"
USING GIN ("searchVector");
