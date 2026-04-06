"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

type PostCheckoutSignupPromptProps = {
  orderReference: string;
  email: string;
  createAccountHref: string;
};

export function PostCheckoutSignupPrompt({
  orderReference,
  email,
  createAccountHref,
}: PostCheckoutSignupPromptProps) {
  const storageKey = `ixq-checkout-signup-dismissed:${orderReference}`;
  const dismissedFromStorage = useSyncExternalStore(
    () => () => {},
    () => {
      try {
        return window.localStorage.getItem(storageKey) === "1";
      } catch {
        return false;
      }
    },
    () => false,
  );
  const [dismissedInSession, setDismissedInSession] = useState(false);
  const open = !dismissedFromStorage && !dismissedInSession;

  const dismiss = useCallback(() => {
    setDismissedInSession(true);

    try {
      window.localStorage.setItem(storageKey, "1");
    } catch {
      // Ignore localStorage errors and still close the prompt.
    }
  }, [storageKey]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        dismiss();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [dismiss, open]);

  if (!open) {
    return null;
  }

  return (
    <div className="checkout-signup-prompt" role="dialog" aria-modal="true" aria-label="Checkout success prompt">
      <button
        type="button"
        className="checkout-signup-prompt__backdrop"
        aria-label="Dismiss account suggestion"
        onClick={dismiss}
      />
      <div className="checkout-signup-prompt__panel">
        <p className="eyebrow">Payment successful</p>
        <h2 className="minor-title">Create your account to track this order faster.</h2>
        <p className="body-copy">
          Use <strong>{email}</strong> to save this order history, delivery details, and future checkouts.
        </p>
        <p className="muted">Order ref: {orderReference}</p>
        <div className="hero__actions">
          <Link href={createAccountHref} className="button" onClick={dismiss}>
            Create account
          </Link>
          <button type="button" className="pill-link" onClick={dismiss}>
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
