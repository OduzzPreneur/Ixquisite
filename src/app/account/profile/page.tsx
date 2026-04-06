import Link from "next/link";
import { updateProfileAction } from "@/app/actions/account";
import { AccountShell } from "@/components/page-templates";
import { getAccountProfileForCurrentUser } from "@/lib/account";

export default async function AccountProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const [params, profile] = await Promise.all([searchParams, getAccountProfileForCurrentUser()]);

  return (
    <AccountShell
      title="Profile details"
      copy="Keep your account name and contact number current so checkout and delivery stay friction-free."
    >
      {params.error ? <p className="auth-notice auth-notice--error">{params.error}</p> : null}
      {params.message ? <p className="auth-notice auth-notice--success">{params.message}</p> : null}

      <form action={updateProfileAction} className="cta-stack" style={{ marginTop: "1.5rem" }}>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="full_name">Full name</label>
            <input
              id="full_name"
              name="full_name"
              defaultValue={profile?.fullName ?? ""}
              autoComplete="name"
            />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" value={profile?.email ?? ""} readOnly aria-readonly="true" />
          </div>
          <div className="field">
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              defaultValue={profile?.phone ?? ""}
              placeholder="+234 800 000 0000"
              autoComplete="tel"
            />
          </div>
          <div className="field">
            <label htmlFor="provider">Sign-in provider</label>
            <input id="provider" value={profile?.provider ?? "Email"} readOnly aria-readonly="true" />
          </div>
        </div>

        <div className="hero__actions">
          <button type="submit" className="button">
            Save profile
          </button>
          <Link href="/forgot-password" className="pill-link">
            Reset password
          </Link>
        </div>
      </form>
    </AccountShell>
  );
}
