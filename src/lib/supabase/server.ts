import { createClient } from "@supabase/supabase-js";
import { getSupabasePublishableKey, getSupabaseUrl, hasSupabaseConfig } from "@/lib/supabase/shared";

export { hasSupabaseConfig } from "@/lib/supabase/shared";

export function createSupabaseServerClient() {
  if (!hasSupabaseConfig()) {
    return null;
  }

  return createClient(getSupabaseUrl()!, getSupabasePublishableKey()!, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: {
        "X-Client-Info": "ixquisite-storefront-server",
      },
    },
  });
}
