"use server";

import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/auth";
import { createSupabaseAdminClient, hasSupabaseAdminConfig } from "@/lib/supabase/admin";

function readRequired(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function submitContactRequestAction(formData: FormData) {
  if (!hasSupabaseAdminConfig()) {
    redirect("/contact?error=Support%20submissions%20are%20not%20configured%20yet.");
  }

  const admin = createSupabaseAdminClient();
  const user = await getAuthenticatedUser();
  const name = readRequired(formData, "name");
  const email = readRequired(formData, "email");
  const message = readRequired(formData, "message");

  if (!admin || !name || !email || !message) {
    redirect("/contact?error=Complete%20all%20contact%20fields.");
  }

  const { error } = await admin.from("contact_requests").insert({
    user_id: user?.id ?? null,
    name,
    email,
    message,
    status: "new",
  });

  if (error) {
    redirect(`/contact?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/contact?message=Message%20received.%20Ixquisite%20support%20will%20follow%20up.");
}

export async function submitWeddingInquiryAction(formData: FormData) {
  if (!hasSupabaseAdminConfig()) {
    redirect("/wedding-inquiry?error=Wedding%20inquiry%20submission%20is%20not%20configured%20yet.");
  }

  const admin = createSupabaseAdminClient();
  const user = await getAuthenticatedUser();
  const name = readRequired(formData, "name");
  const email = readRequired(formData, "email");
  const timeline = readRequired(formData, "timeline");
  const message = readRequired(formData, "message");

  if (!admin || !name || !email || !message) {
    redirect("/wedding-inquiry?error=Complete%20all%20required%20wedding%20inquiry%20fields.");
  }

  const { error } = await admin.from("wedding_inquiries").insert({
    user_id: user?.id ?? null,
    name,
    email,
    timeline: timeline || null,
    message,
    status: "new",
  });

  if (error) {
    redirect(`/wedding-inquiry?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/wedding-inquiry?message=Wedding%20inquiry%20received.%20The%20Ixquisite%20team%20will%20reach%20out.");
}
