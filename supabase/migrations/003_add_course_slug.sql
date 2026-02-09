-- courses.slug: 公開用識別碼（用於 URL），避免直接暴露 DB UUID
ALTER TABLE courses
ADD COLUMN IF NOT EXISTS slug TEXT;

-- 允許多筆 NULL，但 slug 若有值必須唯一
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_indexes
    WHERE schemaname = 'public'
      AND indexname = 'courses_slug_unique_idx'
  ) THEN
    CREATE UNIQUE INDEX courses_slug_unique_idx ON courses (slug) WHERE slug IS NOT NULL;
  END IF;
END $$;
