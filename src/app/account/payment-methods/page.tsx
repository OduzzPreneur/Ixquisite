import { AccountShell } from "@/components/page-templates";

export default function AccountPaymentMethodsPage() {
  return (
    <AccountShell title="Saved payment methods" copy="Payment references can be surfaced here without exposing raw card data.">
      <div className="grid grid--2">
        <article className="support-card">
          <h3 className="minor-title">Paystack card</h3>
          <p className="body-copy">Visa ending in 2045 · Default payment method</p>
        </article>
        <article className="support-card">
          <h3 className="minor-title">Bank transfer</h3>
          <p className="body-copy">Manual confirmation enabled for premium requests.</p>
        </article>
      </div>
    </AccountShell>
  );
}
