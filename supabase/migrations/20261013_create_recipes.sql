-- ============================================
-- RECIPE BOOK DATABASE
-- Supabase PostgreSQL
-- ============================================

-- Vartotoju registracija ir prisijungima
-- tvarko Supabase Auth.

-- 1. RECEPTU LENTELE

CREATE TABLE IF NOT EXISTS public.recipes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    user_id UUID NOT NULL
        REFERENCES auth.users(id) ON DELETE CASCADE,

    title TEXT NOT NULL,
    ingredients TEXT NOT NULL,
    instructions TEXT NOT NULL,
    image_url TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT recipe_title_not_empty
        CHECK (length(trim(title)) > 0),

    CONSTRAINT recipe_ingredients_not_empty
        CHECK (length(trim(ingredients)) > 0),

    CONSTRAINT recipe_instructions_not_empty
        CHECK (length(trim(instructions)) > 0)
);

-- 2. SAUGUMAS (RLS)

ALTER TABLE public.recipes
ENABLE ROW LEVEL SECURITY;

-- 3. API PRIEIGOS TEISES

REVOKE ALL ON public.recipes FROM anon;

GRANT SELECT, INSERT, UPDATE, DELETE
ON public.recipes TO authenticated;

-- 4. RECEPTU PERZIURA

DROP POLICY IF EXISTS "Users can view own recipes"
ON public.recipes;

CREATE POLICY "Users can view own recipes"
ON public.recipes
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- 5. RECEPTU PRIDEJIMAS

DROP POLICY IF EXISTS "Users can create own recipes"
ON public.recipes;

CREATE POLICY "Users can create own recipes"
ON public.recipes
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 6. RECEPTU REDAGAVIMAS

DROP POLICY IF EXISTS "Users can update own recipes"
ON public.recipes;

CREATE POLICY "Users can update own recipes"
ON public.recipes
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 7. RECEPTU ISTRYNIMAS

DROP POLICY IF EXISTS "Users can delete own recipes"
ON public.recipes;

CREATE POLICY "Users can delete own recipes"
ON public.recipes
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- 8. INDEKSAS

CREATE INDEX IF NOT EXISTS idx_recipes_user_id
ON public.recipes(user_id);

-- 9. PATIKRINIMAS

SELECT
    table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name = 'recipes';
