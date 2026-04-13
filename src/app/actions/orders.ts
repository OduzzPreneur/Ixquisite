"use server";

import { redirect } from "next/navigation";
import { reorderItemsFromOrder, submitOrderMeasurements } from "@/lib/orders";

function readOrderId(formData: FormData) {
  const value = formData.get("order_id");
  return typeof value === "string" ? value.trim() : "";
}

export async function reorderOrderItemsAction(formData: FormData) {
  const orderId = readOrderId(formData);

  if (!orderId) {
    redirect("/account/orders?error=Choose%20an%20order%20to%20reorder.");
  }

  try {
    const result = await reorderItemsFromOrder(orderId);

    if (!result.addedCount) {
      redirect(`/account/orders/${orderId}?error=No%20available%20items%20could%20be%20reordered.`);
    }

    const message =
      result.unavailableCount > 0
        ? `Added%20${result.addedCount}%20item(s)%20to%20cart.%20${result.unavailableCount}%20item(s)%20were%20unavailable.`
        : `Added%20${result.addedCount}%20item(s)%20to%20cart.`;

    redirect(`/cart?message=${message}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to reorder this order.";
    redirect(`/account/orders/${orderId}?error=${encodeURIComponent(message)}`);
  }
}

export async function submitOrderMeasurementsAction(formData: FormData) {
  const orderId = readOrderId(formData);
  const reference = String(formData.get("order_reference") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const intent = String(formData.get("intent") ?? "submit_measurements").trim();
  const notes = String(formData.get("measurement_notes") ?? "").trim();

  if (!orderId || !reference || !email) {
    redirect("/order-confirmation?error=Missing%20order%20details%20for%20measurement%20submission.");
  }

  try {
    await submitOrderMeasurements({
      orderId,
      reference,
      email,
      status: intent === "needs_assistance" ? "needs_assistance" : "submitted",
      notes,
      measurements: {
        chest: String(formData.get("measurement_chest") ?? "").trim(),
        shoulder: String(formData.get("measurement_shoulder") ?? "").trim(),
        sleeve: String(formData.get("measurement_sleeve") ?? "").trim(),
        waist: String(formData.get("measurement_waist") ?? "").trim(),
        hips: String(formData.get("measurement_hips") ?? "").trim(),
        inseam: String(formData.get("measurement_inseam") ?? "").trim(),
        height: String(formData.get("measurement_height") ?? "").trim(),
      },
    });

    const message =
      intent === "needs_assistance"
        ? "Measurement%20help%20requested.%20The%20team%20can%20follow%20up%20using%20your%20order%20details."
        : "Measurements%20saved%20for%20your%20order.";

    redirect(`/order-confirmation?order=${encodeURIComponent(orderId)}&reference=${encodeURIComponent(reference)}&message=${message}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to save measurements.";
    redirect(`/order-confirmation?order=${encodeURIComponent(orderId)}&reference=${encodeURIComponent(reference)}&error=${encodeURIComponent(message)}`);
  }
}
