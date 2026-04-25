import Link from "next/link";
import { requestPasswordResetAction } from "@/app/actions/auth";
import { AuthPage } from "@/components/page-templates";
import { buildNoIndexMetadata } from "@/lib/seo";

export const metadata = buildNoIndexMetadata(
  "Forgot password",
  "Private password recovery page for Ixquisite customers.",
);

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string; next?: string }>;
}) {
  const params = await searchParams;
  const nextQuery = params.next ? `?next=${encodeURIComponent(params.next)}` : "";

  return (
    <AuthPage
      eyebrow="Password recovery"
      title="Reset account access without contacting support."
      copy="Enter the email on your account and we will send a secure reset link to your inbox."
      fields={[
        {
          name: "email",
          label: "Email",
          type: "email",
          placeholder: "you@example.com",
          autoComplete: "email",
        },
      ]}
      cta="Send reset link"
      action={requestPasswordResetAction}
      next={params.next}
      error={params.error}
      message={params.message}
      footer={
        <p className="muted">
          Remembered it? <Link href={`/sign-in${nextQuery}`}>Return to sign in</Link>
        </p>
      }
    />
  );
}
