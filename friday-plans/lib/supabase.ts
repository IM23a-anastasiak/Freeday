import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function createPlaceholderClient(): SupabaseClient {
  return new Proxy(
    {},
    {
      get() {
        throw new Error(
          "Supabase environment variables are missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your deployment.",
        );
      },
    },
  ) as SupabaseClient;
}

export const supabase: SupabaseClient =
  url && anonKey ? createClient(url, anonKey, { auth: { persistSession: false } }) : createPlaceholderClient();
