"use server";

import { redirect } from "next/navigation";
import { createCheckoutOrder } from "@/lib/orders";

export async function beginCheckoutAction(formData: FormData) {
  const fullName = String(formData.get("full_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const shippingAddress = String(formData.get("shipping_address") ?? "").trim();
  const shippingMethod = String(formData.get("shipping_method") ?? "standard").trim();
  const paymentMethod = String(formData.get("payment_method") ?? "paystack").trim();

  if (!fullName || !email || !shippingAddress) {
    redirect("/checkout?error=Complete%20the%20required%20checkout%20fields.");
  }

  try {
    const checkout = await createCheckoutOrder({
      fullName,
      email,
      phone,
      city,
      shippingAddress,
      shippingMethod,
      paymentMethod,
    });

    redirect(checkout.authorizationUrl);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to initialize payment.";
    redirect(`/checkout?error=${encodeURIComponent(message)}`);
  }
}
