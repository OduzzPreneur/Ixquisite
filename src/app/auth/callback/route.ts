import { NextResponse } from "next/server";
import { ensureProfileForCurrentUser } from "@/lib/account";
import { createSupabaseAuthServerClient } from "@/lib/supabase/auth-server";
import { hasSupabaseConfig } from "@/lib/supabase/shared";

function getNextPath(searchParams: URLSearchParams) {
  const next = searchParams.get("next");
  return next && next.startsWith("/") ? next : "/account";
}

function buildSignInRedirect(origin: string, message: string, next: string) {
  const redirectUrl = new URL("/sign-in", origin);
  redirectUrl.searchParams.set("error", message);

  if (next !== "/account") {
    redirectUrl.searchParams.set("next", next);
  }

  return redirectUrl;
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const next = getNextPath(requestUrl.searchParams);

  if (!hasSupabaseConfig()) {
    return NextResponse.redirect(
      buildSignInRedirect(requestUrl.origin, "Add Supabase credentials to enable authentication.", next),
    );
  }

  const providerError =
    requestUrl.searchParams.get("error_description") ?? requestUrl.searchParams.get("error");

  if (providerError) {
    return NextResponse.redirect(buildSignInRedirect(requestUrl.origin, providerError, next));
  }

  const code = requestUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(
      buildSignInRedirect(requestUrl.origin, "Authentication could not be completed.", next),
    );
  }

  const supabase = await createSupabaseAuthServerClient();

  if (!supabase) {
    return NextResponse.redirect(
      buildSignInRedirect(requestUrl.origin, "Authentication is not configured yet.", next),
    );
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(buildSignInRedirect(requestUrl.origin, error.message, next));
  }

  try {
    await ensureProfileForCurrentUser();
  } catch {
    // OAuth sign-in should still complete if profile sync needs follow-up.
  }
  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
