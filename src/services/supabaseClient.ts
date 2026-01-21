import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('❌ Faltam variáveis de ambiente Supabase! Verifique .env.local');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('✅ Supabase Client inicializado:', supabaseUrl);
