import Link from "next/link";
import { AuthPage } from "@/components/page-templates";
import { signUpAction } from "@/app/actions/auth";

export default async function CreateAccountPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string; next?: string; email?: string }>;
}) {
  const params = await searchParams;
  const signInQuery = new URLSearchParams();

  if (params.next) {
    signInQuery.set("next", params.next);
  }

  if (params.email) {
    signInQuery.set("email", params.email);
  }

  const nextQuery = signInQuery.size ? `?${signInQuery.toString()}` : "";

  return (
    <AuthPage
      eyebrow="Create account"
      title="Start your account before the first order."
      copy="Creating an account helps clients save addresses, review orders, and move faster on future purchases."
      fields={[
        {
          name: "full_name",
          label: "Full name",
          type: "text",
          placeholder: "Client Name",
          autoComplete: "name",
        },
        {
          name: "email",
          label: "Email",
          type: "email",
          placeholder: "you@example.com",
          autoComplete: "email",
          defaultValue: params.email ?? "",
        },
        {
          name: "phone",
          label: "Phone",
          type: "tel",
          placeholder: "+234 800 000 0000",
          autoComplete: "tel",
        },
        {
          name: "password",
          label: "Password",
          type: "password",
          placeholder: "Create a password",
          autoComplete: "new-password",
        },
      ]}
      cta="Create account"
      action={signUpAction}
      next={params.next}
      error={params.error}
      message={params.message}
      showSocialAuth
      footer={
        <p className="muted">
          Already registered? <Link href={`/sign-in${nextQuery}`}>Sign in here</Link>
        </p>
      }
    />
  );
}
