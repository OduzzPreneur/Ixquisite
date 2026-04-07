import { AccountShell } from "@/components/page-templates";
import { getPaymentSummariesForCurrentUser } from "@/lib/orders";

export default async function AccountPaymentMethodsPage() {
  const paymentSummaries = await getPaymentSummariesForCurrentUser();

  return (
    <AccountShell title="Payment methods" copy="Ixquisite surfaces truthful payment history and method usage without storing or exposing raw card details.">
      <div className="grid grid--2">
        {paymentSummaries.map((summary) => (
          <article key={summary.label} className="support-card">
            <h3 className="minor-title">{summary.label}</h3>
            <p className="body-copy">{summary.detail}</p>
            <p className="muted" style={{ marginTop: "0.75rem" }}>{summary.helper}</p>
          </article>
        ))}
      </div>
    </AccountShell>
  );
}
