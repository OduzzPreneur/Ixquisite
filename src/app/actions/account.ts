"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAuthenticatedUser } from "@/lib/auth";
import { createSupabaseAuthServerClient } from "@/lib/supabase/auth-server";
import { hasSupabaseConfig } from "@/lib/supabase/shared";

function normalizeAddressField(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

export async function updateProfileAction(formData: FormData) {
  if (!hasSupabaseConfig()) {
    redirect("/account/profile?error=Add%20Supabase%20credentials%20to%20enable%20profile%20updates.");
  }

  const user = await requireAuthenticatedUser("/account/profile");
  const supabase = await createSupabaseAuthServerClient();
  const fullName = String(formData.get("full_name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();

  if (!supabase || !fullName) {
    redirect("/account/profile?error=Full%20name%20is%20required.");
  }

  const { error: authError } = await supabase.auth.updateUser({
    data: {
      full_name: fullName,
      phone,
    },
  });

  if (authError) {
    redirect(`/account/profile?error=${encodeURIComponent(authError.message)}`);
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .upsert({
      id: user.id,
      email: user.email,
      full_name: fullName,
      phone: phone || null,
    });

  if (profileError) {
    redirect(`/account/profile?error=${encodeURIComponent(profileError.message)}`);
  }

  revalidatePath("/account");
  revalidatePath("/account/profile");
  revalidatePath("/account/addresses");
  redirect("/account/profile?message=Profile%20updated.");
}

export async function addAddressAction(formData: FormData) {
  if (!hasSupabaseConfig()) {
    redirect("/account/addresses?error=Add%20Supabase%20credentials%20to%20enable%20address%20management.");
  }

  const user = await requireAuthenticatedUser("/account/addresses");
  const supabase = await createSupabaseAuthServerClient();

  if (!supabase) {
    redirect("/account/addresses?error=Address%20management%20is%20not%20configured.");
  }

  const label = normalizeAddressField(formData.get("label")) || "Saved address";
  const recipientName = normalizeAddressField(formData.get("recipient_name"));
  const phone = normalizeAddressField(formData.get("phone"));
  const city = normalizeAddressField(formData.get("city"));
  const addressLine = normalizeAddressField(formData.get("address_line"));
  const deliveryNotes = normalizeAddressField(formData.get("delivery_notes"));
  const { data: existingDefault } = await supabase
    .from("user_addresses")
    .select("id")
    .eq("user_id", user.id)
    .eq("is_default", true)
    .limit(1)
    .maybeSingle<{ id: string }>();
  const shouldSetDefault = formData.get("is_default") === "on" || !existingDefault;

  if (!recipientName || !addressLine) {
    redirect("/account/addresses?error=Recipient%20name%20and%20address%20are%20required.");
  }

  if (shouldSetDefault) {
    await supabase.from("user_addresses").update({ is_default: false }).eq("user_id", user.id);
  }

  const { error } = await supabase.from("user_addresses").insert({
    user_id: user.id,
    label,
    recipient_name: recipientName,
    phone: phone || null,
    city: city || null,
    address_line: addressLine,
    delivery_notes: deliveryNotes || null,
    is_default: shouldSetDefault,
  });

  if (error) {
    redirect(`/account/addresses?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/account");
  revalidatePath("/account/addresses");
  revalidatePath("/checkout");
  redirect("/account/addresses?message=Address%20saved.");
}

export async function updateAddressAction(formData: FormData) {
  if (!hasSupabaseConfig()) {
    redirect("/account/addresses?error=Add%20Supabase%20credentials%20to%20enable%20address%20management.");
  }

  const user = await requireAuthenticatedUser("/account/addresses");
  const supabase = await createSupabaseAuthServerClient();
  const addressId = normalizeAddressField(formData.get("address_id"));

  if (!supabase || !addressId) {
    redirect("/account/addresses?error=Choose%20an%20address%20to%20update.");
  }

  const label = normalizeAddressField(formData.get("label")) || "Saved address";
  const recipientName = normalizeAddressField(formData.get("recipient_name"));
  const phone = normalizeAddressField(formData.get("phone"));
  const city = normalizeAddressField(formData.get("city"));
  const addressLine = normalizeAddressField(formData.get("address_line"));
  const deliveryNotes = normalizeAddressField(formData.get("delivery_notes"));
  const { data: currentAddress } = await supabase
    .from("user_addresses")
    .select("id,is_default")
    .eq("id", addressId)
    .eq("user_id", user.id)
    .maybeSingle<{ id: string; is_default: boolean }>();
  const { data: otherDefault } = await supabase
    .from("user_addresses")
    .select("id")
    .eq("user_id", user.id)
    .eq("is_default", true)
    .neq("id", addressId)
    .limit(1)
    .maybeSingle<{ id: string }>();
  const shouldSetDefault =
    formData.get("is_default") === "on" ||
    (!otherDefault && Boolean(currentAddress?.is_default));

  if (!recipientName || !addressLine) {
    redirect("/account/addresses?error=Recipient%20name%20and%20address%20are%20required.");
  }

  if (shouldSetDefault) {
    await supabase.from("user_addresses").update({ is_default: false }).eq("user_id", user.id);
  }

  const { error } = await supabase
    .from("user_addresses")
    .update({
      label,
      recipient_name: recipientName,
      phone: phone || null,
      city: city || null,
      address_line: addressLine,
      delivery_notes: deliveryNotes || null,
      is_default: shouldSetDefault,
    })
    .eq("id", addressId)
    .eq("user_id", user.id);

  if (error) {
    redirect(`/account/addresses?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/account");
  revalidatePath("/account/addresses");
  revalidatePath("/checkout");
  redirect("/account/addresses?message=Address%20updated.");
}

export async function setDefaultAddressAction(formData: FormData) {
  if (!hasSupabaseConfig()) {
    redirect("/account/addresses?error=Add%20Supabase%20credentials%20to%20enable%20address%20management.");
  }

  const user = await requireAuthenticatedUser("/account/addresses");
  const supabase = await createSupabaseAuthServerClient();
  const addressId = normalizeAddressField(formData.get("address_id"));

  if (!supabase || !addressId) {
    redirect("/account/addresses?error=Choose%20an%20address%20to%20set%20as%20default.");
  }

  await supabase.from("user_addresses").update({ is_default: false }).eq("user_id", user.id);

  const { error } = await supabase
    .from("user_addresses")
    .update({ is_default: true })
    .eq("id", addressId)
    .eq("user_id", user.id);

  if (error) {
    redirect(`/account/addresses?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/account");
  revalidatePath("/account/addresses");
  revalidatePath("/checkout");
  redirect("/account/addresses?message=Default%20address%20updated.");
}

export async function deleteAddressAction(formData: FormData) {
  if (!hasSupabaseConfig()) {
    redirect("/account/addresses?error=Add%20Supabase%20credentials%20to%20enable%20address%20management.");
  }

  const user = await requireAuthenticatedUser("/account/addresses");
  const supabase = await createSupabaseAuthServerClient();
  const addressId = normalizeAddressField(formData.get("address_id"));
  const wasDefault = formData.get("was_default") === "true";

  if (!supabase || !addressId) {
    redirect("/account/addresses?error=Choose%20an%20address%20to%20delete.");
  }

  const { error } = await supabase.from("user_addresses").delete().eq("id", addressId).eq("user_id", user.id);

  if (error) {
    redirect(`/account/addresses?error=${encodeURIComponent(error.message)}`);
  }

  if (wasDefault) {
    const { data: nextAddress } = await supabase
      .from("user_addresses")
      .select("id")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle<{ id: string }>();

    if (nextAddress?.id) {
      await supabase.from("user_addresses").update({ is_default: true }).eq("id", nextAddress.id);
    }
  }

  revalidatePath("/account");
  revalidatePath("/account/addresses");
  revalidatePath("/checkout");
  redirect("/account/addresses?message=Address%20removed.");
}
