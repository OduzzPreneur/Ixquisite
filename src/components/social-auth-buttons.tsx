"use client";

import { useRef, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type SocialProvider = "google" | "github";

const providers: Array<{ label: string; provider: SocialProvider }> = [
  { label: "Google", provider: "google" },
  { label: "GitHub", provider: "github" },
];

export function SocialAuthButtons({ next }: { next?: string }) {
  const clientRef = useRef<SupabaseClient | null>(null);
  const [pendingProvider, setPendingProvider] = useState<SocialProvider | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (clientRef.current === null) {
    clientRef.current = createSupabaseBrowserClient();
  }

  async function handleProviderSignIn(provider: SocialProvider) {
    const supabase = clientRef.current;

    if (!supabase) {
      setError("Add Supabase credentials to enable social sign-in.");
      return;
    }

    const redirectTo = new URL("/auth/callback", window.location.origin);

    if (next && next.startsWith("/")) {
      redirectTo.searchParams.set("next", next);
    }

    setPendingProvider(provider);
    setError(null);

    const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: redirectTo.toString(),
        skipBrowserRedirect: true,
      },
    });

    if (oauthError || !data?.url) {
      setPendingProvider(null);
      setError(oauthError?.message ?? "Unable to start social sign-in.");
      return;
    }

    window.location.assign(data.url);
  }

  return (
    <div className="social-auth">
      <div className="auth-divider" aria-hidden="true">
        <span>Or continue with</span>
      </div>
      <div className="social-auth__buttons">
        {providers.map(({ label, provider }) => (
          <button
            key={provider}
            type="button"
            className="social-button"
            onClick={() => void handleProviderSignIn(provider)}
            disabled={pendingProvider !== null}
          >
            {pendingProvider === provider ? `Redirecting to ${label}...` : `Continue with ${label}`}
          </button>
        ))}
      </div>
      {error ? <p className="auth-notice auth-notice--error">{error}</p> : null}
    </div>
  );
}
