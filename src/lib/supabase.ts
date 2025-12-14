import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client for public/authenticated user operations (Frontend)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for backend/worker operations (Bypass RLS)
// Only use this in API routes or Worker, NEVER on the client side
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey);
