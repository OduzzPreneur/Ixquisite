import Link from "next/link";
import { AuthPage } from "@/components/page-templates";
import { signInAction } from "@/app/actions/auth";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string; next?: string; email?: string }>;
}) {
  const params = await searchParams;
  const createAccountQuery = new URLSearchParams();

  if (params.next) {
    createAccountQuery.set("next", params.next);
  }

  if (params.email) {
    createAccountQuery.set("email", params.email);
  }

  const nextQuery = createAccountQuery.size ? `?${createAccountQuery.toString()}` : "";

  return (
    <AuthPage
      eyebrow="Sign in"
      title="Return to your account, orders, and saved pieces."
      copy="Account access stays calm and direct, with no friction beyond the essentials."
      fields={[
        {
          name: "email",
          label: "Email",
          type: "email",
          placeholder: "you@example.com",
          autoComplete: "email",
          defaultValue: params.email ?? "",
        },
        {
          name: "password",
          label: "Password",
          type: "password",
          placeholder: "••••••••",
          autoComplete: "current-password",
        },
      ]}
      cta="Sign in"
      action={signInAction}
      next={params.next}
      error={params.error}
      message={params.message}
      showSocialAuth
      footer={
        <p className="muted">
          Need an account? <Link href={`/create-account${nextQuery}`}>Create one</Link> ·{" "}
          <Link href={`/forgot-password${nextQuery}`}>Forgot password</Link>
        </p>
      }
    />
  );
}
