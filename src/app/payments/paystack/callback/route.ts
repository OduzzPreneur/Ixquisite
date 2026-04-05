import { NextResponse } from "next/server";
import { finalizePaystackPayment } from "@/lib/orders";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const reference = searchParams.get("reference");

  if (!reference) {
    return NextResponse.redirect(new URL("/checkout?error=Missing%20payment%20reference.", request.url));
  }

  try {
    const result = await finalizePaystackPayment(reference);
    return NextResponse.redirect(
      new URL(`/order-confirmation?order=${result.orderId}&reference=${encodeURIComponent(reference)}`, request.url),
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to verify payment.";
    return NextResponse.redirect(new URL(`/checkout?error=${encodeURIComponent(message)}`, request.url));
  }
}
