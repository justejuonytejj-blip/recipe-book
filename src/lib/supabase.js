import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Trūksta Supabase aplinkos kintamųjų. Nurodykite VITE_SUPABASE_URL ir VITE_SUPABASE_ANON_KEY faile .env',
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
