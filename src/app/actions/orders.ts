"use server";

import { redirect } from "next/navigation";
import { reorderItemsFromOrder } from "@/lib/orders";

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
