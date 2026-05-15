import { createClient, type User } from "@supabase/supabase-js";

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

const INVALID_REFRESH_TOKEN_PATTERN = /Invalid Refresh Token|Refresh Token Not Found/i;

const isInvalidRefreshTokenError = (error: unknown) =>
  error instanceof Error && INVALID_REFRESH_TOKEN_PATTERN.test(error.message);

const clearStoredSupabaseAuth = () => {
  if (typeof window === "undefined") return;

  try {
    const targetUrl = isSupabaseConfigured ? supabaseUrl! : fallbackUrl;
    const projectRef = new URL(targetUrl).hostname.split(".")[0];
    localStorage.removeItem(`sb-${projectRef}-auth-token`);
  } catch {
    // Ignore URL parsing/storage errors and continue generic cleanup
  }

  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("sb-") && key.endsWith("-auth-token")) {
      localStorage.removeItem(key);
    }
  });
};

export const getSafeUser = async (): Promise<{ user: User | null }> => {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error && isInvalidRefreshTokenError(error)) {
      clearStoredSupabaseAuth();
      await supabase.auth.signOut({ scope: "local" }).catch(() => undefined);
      return { user: null };
    }

    return { user: user ?? null };
  } catch (error) {
    if (isInvalidRefreshTokenError(error)) {
      clearStoredSupabaseAuth();
      await supabase.auth.signOut({ scope: "local" }).catch(() => undefined);
      return { user: null };
    }

    throw error;
  }
};
