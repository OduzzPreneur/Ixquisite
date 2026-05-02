import { createClient } from "@supabase/supabase-js";
import { getSupabasePublishableKey, getSupabaseUrl, hasSupabaseConfig } from "@/lib/supabase/shared";

export { hasSupabaseConfig } from "@/lib/supabase/shared";

const SUPABASE_SERVER_TIMEOUT_MS = 15_000;
const SUPABASE_UNAVAILABLE_COOLDOWN_MS = 15_000;
const SUPABASE_SERVER_RETRY_COUNT = 2;

let supabaseUnavailableUntil = 0;

function readPositiveInt(value: string | undefined, fallback: number) {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

const RESOLVED_SUPABASE_SERVER_TIMEOUT_MS = readPositiveInt(process.env.SUPABASE_SERVER_TIMEOUT_MS, SUPABASE_SERVER_TIMEOUT_MS);
const RESOLVED_SUPABASE_UNAVAILABLE_COOLDOWN_MS = readPositiveInt(
  process.env.SUPABASE_UNAVAILABLE_COOLDOWN_MS,
  SUPABASE_UNAVAILABLE_COOLDOWN_MS,
);
const RESOLVED_SUPABASE_SERVER_RETRY_COUNT = readPositiveInt(
  process.env.SUPABASE_SERVER_RETRY_COUNT,
  SUPABASE_SERVER_RETRY_COUNT,
);

function isSupabaseTemporarilyUnavailable() {
  return supabaseUnavailableUntil > Date.now();
}

function markSupabaseTemporarilyUnavailable() {
  supabaseUnavailableUntil = Date.now() + RESOLVED_SUPABASE_UNAVAILABLE_COOLDOWN_MS;
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
  const upstreamSignal = init?.signal;
  let lastError: unknown = null;

  for (let attempt = 0; attempt <= RESOLVED_SUPABASE_SERVER_RETRY_COUNT; attempt += 1) {
    const controller = new AbortController();
    let didTimeout = false;
    const timeoutId = setTimeout(() => {
      didTimeout = true;
      controller.abort();
    }, RESOLVED_SUPABASE_SERVER_TIMEOUT_MS);

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
      const isNetworkFailure = didTimeout || isSupabaseNetworkFailure(error);
      lastError = error;

      if (!isNetworkFailure || attempt >= RESOLVED_SUPABASE_SERVER_RETRY_COUNT || upstreamSignal?.aborted) {
        if (isNetworkFailure) {
          markSupabaseTemporarilyUnavailable();
        }
        throw error;
      }
    } finally {
      clearTimeout(timeoutId);
      removeAbortListener();
    }
  }

  throw lastError;
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
