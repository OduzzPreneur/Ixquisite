import "server-only";

import crypto from "crypto";

const PAYSTACK_API_BASE = "https://api.paystack.co";

type PaystackInitializeInput = {
  email: string;
  amount: number;
  reference: string;
  callbackUrl: string;
  metadata?: Record<string, unknown>;
  currency?: string;
};

type PaystackInitializeResponse = {
  authorization_url: string;
  access_code: string;
  reference: string;
};

type PaystackVerificationData = {
  id: number;
  status: string;
  reference: string;
  amount: number;
  currency: string;
  gateway_response: string;
  paid_at: string | null;
  channel: string | null;
  metadata?: Record<string, unknown> | string | null;
};

function getPaystackSecretKey() {
  return process.env.PAYSTACK_SECRET_KEY;
}

export function hasPaystackConfig() {
  return Boolean(getPaystackSecretKey());
}

function getBaseUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) {
    return explicit.replace(/\/$/, "");
  }

  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) {
    return `https://${vercelUrl}`;
  }

  return "http://localhost:3000";
}

async function paystackFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const secretKey = getPaystackSecretKey();

  if (!secretKey) {
    throw new Error("PAYSTACK_SECRET_KEY is not configured.");
  }

  const response = await fetch(`${PAYSTACK_API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  const payload = (await response.json()) as {
    status: boolean;
    message: string;
    data: T;
  };

  if (!response.ok || !payload.status) {
    throw new Error(payload.message || "Paystack request failed.");
  }

  return payload.data;
}

export async function initializePaystackTransaction(input: PaystackInitializeInput) {
  return paystackFetch<PaystackInitializeResponse>("/transaction/initialize", {
    method: "POST",
    body: JSON.stringify({
      email: input.email,
      amount: input.amount,
      reference: input.reference,
      callback_url: input.callbackUrl,
      metadata: input.metadata,
      currency: input.currency ?? "NGN",
    }),
  });
}

export async function verifyPaystackTransaction(reference: string) {
  return paystackFetch<PaystackVerificationData>(`/transaction/verify/${reference}`);
}

export function buildPaystackCallbackUrl(reference?: string) {
  const base = `${getBaseUrl()}/payments/paystack/callback`;
  if (!reference) {
    return base;
  }

  return `${base}?reference=${encodeURIComponent(reference)}`;
}

export function verifyPaystackSignature(rawBody: string, signature: string | null) {
  const secretKey = getPaystackSecretKey();
  if (!secretKey || !signature) {
    return false;
  }

  const hash = crypto.createHmac("sha512", secretKey).update(rawBody).digest("hex");

  if (hash.length !== signature.length) {
    return false;
  }

  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(signature));
}

export function generatePaystackReference() {
  return `IXQ-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
}
