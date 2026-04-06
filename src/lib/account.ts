import "server-only";

import type { User } from "@supabase/supabase-js";
import { getAuthenticatedUser } from "@/lib/auth";
import { createSupabaseAuthServerClient } from "@/lib/supabase/auth-server";
import { createSupabaseAdminClient, hasSupabaseAdminConfig } from "@/lib/supabase/admin";
import { hasSupabaseConfig } from "@/lib/supabase/shared";
import { getOrdersForCurrentUser } from "@/lib/orders";

type StoredProfile = {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  created_at?: string | null;
};

export type AccountProfile = {
  id: string;
  email: string | null;
  fullName: string;
  phone: string;
  provider: string;
  avatarUrl: string | null;
  createdAt: string | null;
};

export type SavedAddress = {
  id: string;
  label: string;
  recipientName: string;
  phone: string;
  addressLine: string;
  body: string;
  city: string | null;
  isDefault: boolean;
  notes: string | null;
};

type StoredAddress = {
  id: string;
  label: string;
  recipient_name: string | null;
  phone: string | null;
  city: string | null;
  address_line: string;
  delivery_notes: string | null;
  is_default: boolean;
  created_at?: string | null;
};

function mapStoredAddress(address: StoredAddress): SavedAddress {
  return {
    id: address.id,
    label: address.label,
    recipientName: address.recipient_name?.trim() || "Ixquisite Client",
    phone: address.phone?.trim() || "",
    addressLine: address.address_line,
    body: address.city ? `${address.address_line}, ${address.city}.` : address.address_line,
    city: address.city?.trim() || null,
    isDefault: address.is_default,
    notes: address.delivery_notes?.trim() || null,
  };
}

function deriveSavedAddressesFromOrders(
  orders: Awaited<ReturnType<typeof getOrdersForCurrentUser>>,
): SavedAddress[] {
  const seen = new Set<string>();

  return orders
    .filter((order) => order.shipping_address)
    .map((order): SavedAddress | null => {
      const address = order.shipping_address?.trim() ?? "";
      const city = order.city?.trim() || null;
      const key = `${address}::${city ?? ""}`;

      if (!address || seen.has(key)) {
        return null;
      }

      seen.add(key);

      return {
        id: key,
        label: order.shipping_method ? `${order.shipping_method} address` : "Saved address",
        recipientName: order.full_name || "Ixquisite Client",
        phone: order.phone || "",
        addressLine: address,
        body: city ? `${address}, ${city}.` : address,
        city,
        isDefault: seen.size === 1,
        notes: null,
      };
    })
    .filter((address): address is SavedAddress => address !== null);
}

function getUserMetadataValue(user: User, ...keys: string[]) {
  for (const key of keys) {
    const value = user.user_metadata?.[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return null;
}

function getDisplayName(user: User, profile: StoredProfile | null) {
  return (
    profile?.full_name?.trim() ||
    getUserMetadataValue(user, "full_name", "name", "user_name", "preferred_username") ||
    user.email?.split("@")[0] ||
    "Ixquisite Client"
  );
}

function getPhone(user: User, profile: StoredProfile | null) {
  return profile?.phone?.trim() || getUserMetadataValue(user, "phone", "phone_number") || "";
}

function getProvider(user: User) {
  const provider =
    typeof user.app_metadata?.provider === "string" && user.app_metadata.provider
      ? user.app_metadata.provider
      : "email";

  return provider.charAt(0).toUpperCase() + provider.slice(1);
}

function getAvatarUrl(user: User) {
  return getUserMetadataValue(user, "avatar_url", "picture");
}

async function getAuthenticatedAuthUser() {
  if (!hasSupabaseConfig()) {
    return null;
  }

  const supabase = await createSupabaseAuthServerClient();
  const {
    data: { user },
  } = (await supabase?.auth.getUser()) ?? { data: { user: null } };

  return user ?? null;
}

export async function ensureProfileForUser(user: User) {
  const fullName = getDisplayName(user, null);
  const phone = getPhone(user, null);
  const admin = createSupabaseAdminClient();

  if (!admin) {
    return null;
  }

  const profilePayload = {
    id: user.id,
    email: user.email ?? null,
    full_name: fullName,
    phone: phone || null,
  };

  const { data, error } = await admin
    .from("profiles")
    .upsert(profilePayload, { onConflict: "id" })
    .select("id,email,full_name,phone,created_at")
    .single<StoredProfile>();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function ensureProfileForCurrentUser() {
  const user = await getAuthenticatedAuthUser();
  if (!user) {
    return null;
  }

  return ensureProfileForUser(user);
}

export async function getAccountProfileForCurrentUser(): Promise<AccountProfile | null> {
  const user = await getAuthenticatedAuthUser();

  if (!user) {
    return null;
  }

  let profile: StoredProfile | null = null;
  const supabase = await createSupabaseAuthServerClient();

  if (supabase) {
    const { data } = await supabase
      .from("profiles")
      .select("id,email,full_name,phone,created_at")
      .eq("id", user.id)
      .maybeSingle<StoredProfile>();

    profile = data ?? null;
  }

  if (!profile && hasSupabaseAdminConfig()) {
    profile = await ensureProfileForUser(user);
  }

  return {
    id: user.id,
    email: profile?.email ?? user.email ?? null,
    fullName: getDisplayName(user, profile),
    phone: getPhone(user, profile),
    provider: getProvider(user),
    avatarUrl: getAvatarUrl(user),
    createdAt: profile?.created_at ?? user.created_at ?? null,
  };
}

export async function getSavedAddressesForCurrentUser(): Promise<SavedAddress[]> {
  const user = await getAuthenticatedUser();

  if (!user || !hasSupabaseConfig()) {
    const orders = await getOrdersForCurrentUser();
    return deriveSavedAddressesFromOrders(orders);
  }

  const supabase = await createSupabaseAuthServerClient();

  if (!supabase) {
    const orders = await getOrdersForCurrentUser();
    return deriveSavedAddressesFromOrders(orders);
  }

  const { data, error } = await supabase
    .from("user_addresses")
    .select("id,label,recipient_name,phone,city,address_line,delivery_notes,is_default,created_at")
    .eq("user_id", user.id)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    const orders = await getOrdersForCurrentUser();
    return deriveSavedAddressesFromOrders(orders);
  }

  const storedAddresses = (data as StoredAddress[] | null) ?? [];

  if (!storedAddresses.length) {
    return [];
  }

  return storedAddresses.map(mapStoredAddress);
}

export async function getCheckoutDefaultsForCurrentUser() {
  const [profile, addresses] = await Promise.all([
    getAccountProfileForCurrentUser(),
    getSavedAddressesForCurrentUser(),
  ]);
  const primaryAddress = addresses.find((address) => address.isDefault) ?? addresses[0] ?? null;

  return {
    fullName: profile?.fullName ?? "",
    email: profile?.email ?? "",
    phone: primaryAddress?.phone || profile?.phone || "",
    city: primaryAddress?.city ?? "",
    shippingAddress: primaryAddress?.addressLine || "",
    shippingMethod:
      primaryAddress?.label.toLowerCase().includes("express") ? "express" : "standard",
    paymentMethod: "paystack",
  };
}

export async function getAccountDashboardData() {
  const [user, profile, orders] = await Promise.all([
    getAuthenticatedUser(),
    getAccountProfileForCurrentUser(),
    getOrdersForCurrentUser(),
  ]);
  const addresses = await getSavedAddressesForCurrentUser();

  return {
    user,
    profile,
    orders,
    recentOrder: orders[0] ?? null,
    addressCount: addresses.length,
    addresses,
  };
}
