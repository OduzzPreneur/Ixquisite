import { NextResponse } from "next/server";
import { finalizePaystackPayment } from "@/lib/orders";
import { verifyPaystackSignature } from "@/lib/paystack";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature");

  if (!verifyPaystackSignature(rawBody, signature)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  try {
    const event = JSON.parse(rawBody) as {
      event?: string;
      data?: { reference?: string };
    };

    if (event.event === "charge.success" && event.data?.reference) {
      await finalizePaystackPayment(event.data.reference);
    }

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ received: false }, { status: 400 });
  }
}
