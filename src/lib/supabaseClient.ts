import { createClient, SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

const getEnv = (key: string) => {
  if (typeof window === "undefined") {
    return process.env[key];
  }
  return (window as unknown as Record<string, string | undefined>)[key] ?? process.env[key];
};

export const getSupabaseClient = () => {
  if (client) return client;

  const url = getEnv("NEXT_PUBLIC_SUPABASE_URL");
  const anonKey = getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  if (!url || !anonKey) {
    return null;
  }

  client = createClient(url, anonKey, {
    auth: {
      persistSession: false
    }
  });

  return client;
};
