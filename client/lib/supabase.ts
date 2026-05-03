import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.warn("Supabase environment variables are missing. Falling back to a disabled client.");
}

const fallbackUrl = "https://example.supabase.co";
const fallbackAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJmYWtlIiwicm9sZSI6ImFub24iLCJpYXQiOjAsImV4cCI6OTk5OTk5OTk5OX0.fake";

export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl! : fallbackUrl,
  isSupabaseConfigured ? supabaseAnonKey! : fallbackAnonKey,
);
