import { createClient } from "@supabase/supabase-js";
import { getSupabasePublishableKey, getSupabaseUrl, hasSupabaseConfig } from "@/lib/supabase/shared";

export { hasSupabaseConfig } from "@/lib/supabase/shared";

const SUPABASE_SERVER_TIMEOUT_MS = 3_000;
const SUPABASE_UNAVAILABLE_COOLDOWN_MS = 60_000;

let supabaseUnavailableUntil = 0;

function isSupabaseTemporarilyUnavailable() {
  return supabaseUnavailableUntil > Date.now();
}

function markSupabaseTemporarilyUnavailable() {
  supabaseUnavailableUntil = Date.now() + SUPABASE_UNAVAILABLE_COOLDOWN_MS;
}

function describeError(error: unknown): string {
  if (!error) {
    return "";
  }

  if (typeof error === "string") {
    return error;
  }

  if (typeof error !== "object") {
    return String(error);
  }

  const errorRecord = error as Record<string, unknown>;
  const fields = ["name", "message", "details", "hint", "code"]
    .map((key) => errorRecord[key])
    .filter((value): value is string => typeof value === "string" && Boolean(value.trim()));

  const cause = "cause" in errorRecord ? describeError(errorRecord.cause) : "";

  return [...fields, cause].filter(Boolean).join(" ");
}

function isSupabaseNetworkFailure(error: unknown) {
  const message = describeError(error).toLowerCase();

  return [
    "fetch failed",
    "connect timeout",
    "timed out",
    "networkerror",
    "econnrefused",
    "econnreset",
    "enotfound",
    "etimedout",
    "und_err",
    "aborterror",
  ].some((token) => message.includes(token));
}

const supabaseServerFetch: typeof fetch = async (input, init) => {
  const controller = new AbortController();
  const upstreamSignal = init?.signal;
  let didTimeout = false;

  const timeoutId = setTimeout(() => {
    didTimeout = true;
    controller.abort();
  }, SUPABASE_SERVER_TIMEOUT_MS);

  let removeAbortListener = () => {};

  if (upstreamSignal) {
    if (upstreamSignal.aborted) {
      controller.abort();
    } else {
      const abortFromUpstream = () => controller.abort();
      upstreamSignal.addEventListener("abort", abortFromUpstream, { once: true });
      removeAbortListener = () => upstreamSignal.removeEventListener("abort", abortFromUpstream);
    }
  }

  try {
    return await globalThis.fetch(input, {
      ...init,
      signal: controller.signal,
    });
  } catch (error) {
    if (didTimeout || isSupabaseNetworkFailure(error)) {
      markSupabaseTemporarilyUnavailable();
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
    removeAbortListener();
  }
};

export function createSupabaseServerClient() {
  if (!hasSupabaseConfig() || isSupabaseTemporarilyUnavailable()) {
    return null;
  }

  return createClient(getSupabaseUrl()!, getSupabasePublishableKey()!, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      fetch: supabaseServerFetch,
      headers: {
        "X-Client-Info": "ixquisite-storefront-server",
      },
    },
  });
}
