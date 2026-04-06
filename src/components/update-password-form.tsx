"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type RecoveryState = "checking" | "ready" | "missing" | "success";

export function UpdatePasswordForm() {
  const [supabase] = useState(() => createSupabaseBrowserClient());
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState<string | null>(null);
  const [status, setStatus] = useState<RecoveryState>(supabase ? "checking" : "missing");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    let isMounted = true;

    const syncRecoverySession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!isMounted) {
        return;
      }

      if (session?.user) {
        setEmail(session.user.email ?? null);
        setStatus("ready");
      } else {
        setStatus("missing");
      }
    };

    void syncRecoverySession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) {
        return;
      }

      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN" || event === "INITIAL_SESSION") {
        if (session?.user) {
          setEmail(session.user.email ?? null);
          setStatus("ready");
          setError(null);
        }
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  if (!supabase) {
    return (
      <div className="surface-panel cta-stack">
        <p className="auth-notice auth-notice--error">
          Add Supabase credentials to enable password recovery.
        </p>
        <div className="hero__actions">
          <Link href="/sign-in" className="pill-link">
            Return to sign in
          </Link>
        </div>
      </div>
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!supabase) {
      setError("Add Supabase credentials to enable password recovery.");
      return;
    }

    if (password.length < 8) {
      setError("Use at least 8 characters for the new password.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Password confirmation does not match.");
      return;
    }

    setPending(true);
    setError(null);
    setMessage(null);

    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setPending(false);
      setError(updateError.message);
      return;
    }

    setPending(false);
    setStatus("success");
    setMessage("Password updated. You can continue into your account with the new password.");
    setPassword("");
    setConfirmPassword("");
  }

  if (status === "checking") {
    return (
      <div className="surface-panel">
        <p className="muted">Checking your recovery link…</p>
      </div>
    );
  }

  if (status === "missing") {
    return (
      <div className="surface-panel cta-stack">
        <p className="auth-notice auth-notice--error">
          This recovery link is missing or has expired. Request a fresh reset email to continue.
        </p>
        <div className="hero__actions">
          <Link href="/forgot-password" className="button">
            Request new link
          </Link>
          <Link href="/sign-in" className="pill-link">
            Return to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="surface-panel cta-stack">
      {email ? <p className="muted">Updating access for {email}</p> : null}
      {error ? <p className="auth-notice auth-notice--error">{error}</p> : null}
      {message ? <p className="auth-notice auth-notice--success">{message}</p> : null}

      {status === "success" ? (
        <div className="hero__actions">
          <Link href="/account" className="button">
            Open account
          </Link>
          <Link href="/sign-in" className="pill-link">
            Sign in screen
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="cta-stack">
          <div className="form-grid">
            <div className="field">
              <label htmlFor="password">New password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
                placeholder="Create a new password"
              />
            </div>
            <div className="field">
              <label htmlFor="confirm-password">Confirm password</label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                autoComplete="new-password"
                placeholder="Repeat the new password"
              />
            </div>
          </div>
          <div className="hero__actions">
            <button className="button" type="submit" disabled={pending}>
              {pending ? "Updating password..." : "Update password"}
            </button>
            <Link href="/sign-in" className="pill-link">
              Return to sign in
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
