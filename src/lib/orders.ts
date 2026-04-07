import "server-only";

import { getAuthenticatedUser } from "@/lib/auth";
import { addItemToCart, clearCart, getCurrentCartContext } from "@/lib/cart";
import { createSupabaseAdminClient, hasSupabaseAdminConfig } from "@/lib/supabase/admin";
import {
  buildPaystackCallbackUrl,
  generatePaystackReference,
  hasPaystackConfig,
  initializePaystackTransaction,
  verifyPaystackTransaction,
} from "@/lib/paystack";
import { accountOrders as fallbackOrders } from "@/data/site";
import { getProduct } from "@/lib/catalog";

export type CheckoutPayload = {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  shippingAddress: string;
  shippingMethod: string;
  paymentMethod: string;
};

type StoredOrder = {
  id: string;
  reference: string;
  status: string;
  payment_status: string;
  total: number;
  subtotal: number;
  delivery_fee: number;
  email: string;
  full_name: string;
  phone: string | null;
  city: string | null;
  shipping_address: string | null;
  shipping_method: string | null;
  payment_method: string | null;
  currency: string;
  paid_at: string | null;
  created_at: string;
  user_id: string | null;
  cart_id: string | null;
};

type StoredOrderItem = {
  id: string;
  order_id: string;
  product_slug: string;
  product_title: string;
  unit_price: number;
  quantity: number;
  selected_size: string | null;
  selected_color: string | null;
  line_total: number;
};

type OrderDetail = StoredOrder & {
  items: StoredOrderItem[];
};

export type PaymentSummary = {
  label: string;
  detail: string;
  helper: string;
};

function requirePaymentsReady() {
  if (!hasSupabaseAdminConfig()) {
    throw new Error("Supabase service-role credentials are required before checkout can create orders.");
  }

  if (!hasPaystackConfig()) {
    throw new Error("PAYSTACK_SECRET_KEY is required before checkout can initialize payment.");
  }
}

function estimateDeliveryDate() {
  const target = new Date();
  target.setDate(target.getDate() + 3);
  return target.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

async function syncAddressFromCheckout(
  userId: string | null,
  payload: CheckoutPayload,
  admin: ReturnType<typeof createSupabaseAdminClient>,
) {
  if (!userId || !admin) {
    return;
  }

  const addressLine = payload.shippingAddress.trim();
  if (!addressLine) {
    return;
  }

  const label = payload.shippingMethod === "express" ? "Express delivery" : "Primary delivery";

  const { data: existingAddresses } = await admin
    .from("user_addresses")
    .select("id,is_default,city")
    .eq("user_id", userId)
    .eq("address_line", addressLine)
    .limit(10);

  const existingAddress =
    ((existingAddresses as Array<{ id: string; is_default: boolean; city: string | null }> | null) ?? []).find(
      (address) => (address.city ?? "") === (payload.city || ""),
    ) ?? null;

  const { data: defaultAddress } = await admin
    .from("user_addresses")
    .select("id")
    .eq("user_id", userId)
    .eq("is_default", true)
    .limit(1)
    .maybeSingle<{ id: string }>();

  const isDefault = Boolean(existingAddress?.is_default || !defaultAddress);

  if (isDefault) {
    await admin.from("user_addresses").update({ is_default: false }).eq("user_id", userId);
  }

  const payloadToStore = {
    user_id: userId,
    label,
    recipient_name: payload.fullName,
    phone: payload.phone || null,
    city: payload.city || null,
    address_line: addressLine,
    delivery_notes: null,
    is_default: isDefault,
  };

  if (existingAddress?.id) {
    await admin.from("user_addresses").update(payloadToStore).eq("id", existingAddress.id);
    return;
  }

  await admin.from("user_addresses").insert(payloadToStore);
}

export async function createCheckoutOrder(payload: CheckoutPayload) {
  requirePaymentsReady();

  const admin = createSupabaseAdminClient();
  const user = await getAuthenticatedUser();
  const cart = await getCurrentCartContext();

  if (!admin) {
    throw new Error("Supabase admin client is not available.");
  }

  if (!cart.state.items.length) {
    throw new Error("Your cart is empty.");
  }

  const reference = generatePaystackReference();
  const deliveryFee = 8000;
  const subtotal = cart.state.subtotal;
  const total = subtotal + deliveryFee;

  await syncAddressFromCheckout(user?.id ?? null, payload, admin);

  const { data: createdOrder, error: orderError } = await admin
    .from("orders")
    .insert({
      user_id: user?.id ?? null,
      cart_id: cart.cartId,
      reference,
      email: payload.email,
      full_name: payload.fullName,
      phone: payload.phone || null,
      city: payload.city || null,
      shipping_address: payload.shippingAddress,
      shipping_method: payload.shippingMethod,
      payment_method: payload.paymentMethod,
      status: "pending_payment",
      payment_status: "initialized",
      currency: "NGN",
      subtotal,
      delivery_fee: deliveryFee,
      total,
    })
    .select("id,reference")
    .single<{ id: string; reference: string }>();

  if (orderError || !createdOrder) {
    throw new Error(orderError?.message || "Unable to create order.");
  }

  const orderItemsPayload = cart.state.items.map((item) => ({
    order_id: createdOrder.id,
    product_slug: item.productSlug,
    product_title: item.product.title,
    unit_price: item.product.price,
    quantity: item.quantity,
    selected_size: item.selectedSize,
    selected_color: item.selectedColor,
    line_total: item.lineTotal,
  }));

  const { error: orderItemsError } = await admin.from("order_items").insert(orderItemsPayload);

  if (orderItemsError) {
    throw new Error(orderItemsError.message || "Unable to create order items.");
  }

  const paymentInit = await initializePaystackTransaction({
    email: payload.email,
    amount: total * 100,
    reference,
    callbackUrl: buildPaystackCallbackUrl(reference),
    metadata: {
      order_id: createdOrder.id,
      reference,
      source: "ixquisite-storefront",
    },
  });

  await admin.from("orders").update({
    paystack_access_code: paymentInit.access_code,
    paystack_authorization_url: paymentInit.authorization_url,
  }).eq("id", createdOrder.id);

  await admin.from("payments").upsert({
    order_id: createdOrder.id,
    provider: "paystack",
    reference,
    status: "initialized",
    amount: total,
    currency: "NGN",
    access_code: paymentInit.access_code,
    authorization_url: paymentInit.authorization_url,
  }, { onConflict: "reference" });

  return {
    orderId: createdOrder.id,
    reference,
    authorizationUrl: paymentInit.authorization_url,
  };
}

export async function getOrderByReference(reference: string) {
  const admin = createSupabaseAdminClient();
  if (!admin) {
    return null;
  }

  const { data } = await admin.from("orders").select("*").eq("reference", reference).maybeSingle<StoredOrder>();
  return data ?? null;
}

export async function getTrackedOrder(reference: string, email?: string | null) {
  const normalizedReference = reference.trim();
  const normalizedEmail = email?.trim().toLowerCase() || null;

  if (!normalizedReference) {
    return null;
  }

  if (!hasSupabaseAdminConfig()) {
    const fallback = fallbackOrders.find((order) => order.id.toLowerCase() === normalizedReference.toLowerCase());
    if (!fallback) {
      return null;
    }

    return {
      id: fallback.id,
      reference: fallback.id,
      status: fallback.status.toLowerCase().replace(/\s+/g, "_"),
      payment_status: fallback.status === "Delivered" ? "paid" : "pending",
      total: fallback.total,
      subtotal: fallback.total,
      delivery_fee: 0,
      email: "client@example.com",
      full_name: "Client Name",
      phone: null,
      city: null,
      shipping_address: null,
      shipping_method: null,
      payment_method: "paystack",
      currency: "NGN",
      paid_at: null,
      created_at: new Date().toISOString(),
      user_id: null,
      cart_id: null,
      items: fallback.items.map((title, index) => ({
        id: `${fallback.id}-${index}`,
        order_id: fallback.id,
        product_slug: title.toLowerCase().replace(/\s+/g, "-"),
        product_title: title,
        unit_price: Math.round(fallback.total / fallback.items.length),
        quantity: 1,
        selected_size: null,
        selected_color: null,
        line_total: Math.round(fallback.total / fallback.items.length),
      })),
    } satisfies OrderDetail;
  }

  const admin = createSupabaseAdminClient();
  if (!admin) {
    return null;
  }

  const signedInUser = await getAuthenticatedUser();
  let query = admin.from("orders").select("*").eq("reference", normalizedReference).limit(1);

  if (signedInUser) {
    query = query.eq("user_id", signedInUser.id);
  } else if (normalizedEmail) {
    query = query.ilike("email", normalizedEmail);
  } else {
    return null;
  }

  const { data: order } = await query.maybeSingle<StoredOrder>();

  if (!order) {
    return null;
  }

  const { data: items } = await admin
    .from("order_items")
    .select("*")
    .eq("order_id", order.id)
    .order("created_at", { ascending: true });

  return {
    ...order,
    items: (items as StoredOrderItem[] | null) ?? [],
  } satisfies OrderDetail;
}

export async function getOrderById(orderId: string) {
  const admin = createSupabaseAdminClient();
  if (!admin) {
    return null;
  }

  const { data: order } = await admin.from("orders").select("*").eq("id", orderId).maybeSingle<StoredOrder>();
  if (!order) {
    return null;
  }

  const { data: items } = await admin
    .from("order_items")
    .select("*")
    .eq("order_id", order.id)
    .order("created_at", { ascending: true });

  return {
    ...order,
    items: (items as StoredOrderItem[] | null) ?? [],
  } satisfies OrderDetail;
}

export async function getOrdersForCurrentUser() {
  if (!hasSupabaseAdminConfig()) {
    return fallbackOrders.map((order) => ({
      id: order.id,
      reference: order.id,
      status: order.status,
      payment_status: order.status === "Delivered" ? "paid" : "pending",
      total: order.total,
      subtotal: order.total,
      delivery_fee: 0,
      email: "client@example.com",
      full_name: "Client Name",
      phone: null,
      city: null,
      shipping_address: null,
      shipping_method: null,
      payment_method: "paystack",
      currency: "NGN",
      paid_at: null,
      created_at: new Date().toISOString(),
      user_id: null,
      cart_id: null,
    })) as StoredOrder[];
  }

  const admin = createSupabaseAdminClient();
  const user = await getAuthenticatedUser();

  if (!admin || !user) {
    return [] as StoredOrder[];
  }

  const { data } = await admin
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (data as StoredOrder[] | null) ?? [];
}

export async function getOrderForCurrentUser(orderId: string) {
  if (!hasSupabaseAdminConfig()) {
    const fallback = fallbackOrders.find((order) => order.id === orderId);
    if (!fallback) {
      return null;
    }

    return {
      id: fallback.id,
      reference: fallback.id,
      status: fallback.status,
      payment_status: fallback.status === "Delivered" ? "paid" : "pending",
      total: fallback.total,
      subtotal: fallback.total,
      delivery_fee: 0,
      email: "client@example.com",
      full_name: "Client Name",
      phone: null,
      city: null,
      shipping_address: null,
      shipping_method: null,
      payment_method: "paystack",
      currency: "NGN",
      paid_at: null,
      created_at: new Date().toISOString(),
      user_id: null,
      cart_id: null,
      items: fallback.items.map((title, index) => ({
        id: `${fallback.id}-${index}`,
        order_id: fallback.id,
        product_slug: title.toLowerCase().replace(/\s+/g, "-"),
        product_title: title,
        unit_price: Math.round(fallback.total / fallback.items.length),
        quantity: 1,
        selected_size: null,
        selected_color: null,
        line_total: Math.round(fallback.total / fallback.items.length),
      })),
    } satisfies OrderDetail;
  }

  const admin = createSupabaseAdminClient();
  const user = await getAuthenticatedUser();

  if (!admin || !user) {
    return null;
  }

  const { data: order } = await admin
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .eq("user_id", user.id)
    .maybeSingle<StoredOrder>();

  if (!order) {
    return null;
  }

  const { data: items } = await admin
    .from("order_items")
    .select("*")
    .eq("order_id", order.id)
    .order("created_at", { ascending: true });

  return {
    ...order,
    items: (items as StoredOrderItem[] | null) ?? [],
  } satisfies OrderDetail;
}

export async function reorderItemsFromOrder(orderId: string) {
  const order = await getOrderForCurrentUser(orderId);

  if (!order) {
    throw new Error("Order not found.");
  }

  let addedCount = 0;
  let unavailableCount = 0;

  for (const item of order.items) {
    if (!item.product_slug) {
      unavailableCount += 1;
      continue;
    }

    const product = await getProduct(item.product_slug);
    if (!product) {
      unavailableCount += 1;
      continue;
    }

    await addItemToCart({
      productSlug: item.product_slug,
      quantity: item.quantity,
      selectedSize: item.selected_size,
      selectedColor: item.selected_color,
    });
    addedCount += 1;
  }

  return { order, addedCount, unavailableCount };
}

export async function finalizePaystackPayment(reference: string) {
  requirePaymentsReady();

  const admin = createSupabaseAdminClient();
  if (!admin) {
    throw new Error("Supabase admin client is not available.");
  }

  const verified = await verifyPaystackTransaction(reference);
  const order = await getOrderByReference(reference);

  if (!order) {
    throw new Error("Order not found for payment reference.");
  }

  const status = verified.status === "success" ? "paid" : verified.status;
  const orderStatus = verified.status === "success" ? "confirmed" : "payment_failed";
  const paidAt = verified.paid_at ?? null;

  await admin.from("payments").upsert({
    order_id: order.id,
    provider: "paystack",
    reference,
    status,
    amount: Math.round(verified.amount / 100),
    currency: verified.currency,
    transaction_id: verified.id,
    paid_at: paidAt,
    gateway_response: verified.gateway_response,
    raw_response: verified,
  }, { onConflict: "reference" });

  await admin.from("orders").update({
    status: orderStatus,
    payment_status: status,
    paid_at: paidAt,
  }).eq("id", order.id);

  if (verified.status === "success") {
    await clearCart(order.cart_id);
  }

  return {
    orderId: order.id,
    reference,
    status: orderStatus,
    paymentStatus: status,
  };
}

export function getOrderEtaLabel() {
  return estimateDeliveryDate();
}

export function getTrackingStages(status: string, paymentStatus: string) {
  const normalizedStatus = status.toLowerCase();
  const normalizedPayment = paymentStatus.toLowerCase();

  if (normalizedStatus === "payment_failed" || normalizedPayment === "failed") {
    return ["Payment issue", "Awaiting resolution"];
  }

  if (normalizedStatus === "delivered") {
    return ["Confirmed", "In transit", "Delivered"];
  }

  if (normalizedStatus === "in_transit" || normalizedStatus === "shipped") {
    return ["Confirmed", "In transit", "Out for delivery next"];
  }

  if (normalizedStatus === "confirmed" || normalizedPayment === "paid") {
    return ["Confirmed", "Preparing dispatch", "Tracking available soon"];
  }

  return ["Awaiting payment", "Confirmation pending"];
}

export async function getPaymentSummariesForCurrentUser(): Promise<PaymentSummary[]> {
  const orders = await getOrdersForCurrentUser();

  if (!orders.length) {
    return [
      {
        label: "No saved payment instruments",
        detail: "Ixquisite uses secure Paystack checkout and does not expose or store raw card details in the account area.",
        helper: "Your next completed order will surface the payment method used.",
      },
    ];
  }

  const latestOrder = orders[0];
  const paymentMethods = [...new Set(orders.map((order) => order.payment_method || "paystack"))];

  return paymentMethods.map((method) => {
    const matching = orders.find((order) => (order.payment_method || "paystack") === method) ?? latestOrder;
    const normalizedMethod = method === "paystack" ? "Paystack checkout" : method;

    return {
      label: normalizedMethod,
      detail: `Last used on order ${matching.reference}. Status: ${matching.payment_status}.`,
      helper: "Stored payment methods are represented as payment history only. Raw card details are not retained in Ixquisite.",
    };
  });
}
