import { AccountShell } from "@/components/page-templates";

export default function AccountAddressesPage() {
  return (
    <AccountShell title="Address book" copy="Saved addresses reduce friction for repeat purchases and help the checkout flow stay short.">
      <div className="grid grid--2">
        <article className="support-card">
          <h3 className="minor-title">Primary address</h3>
          <p className="body-copy">14 Admiralty Way, Lekki Phase 1, Lagos.</p>
        </article>
        <article className="support-card">
          <h3 className="minor-title">Office delivery</h3>
          <p className="body-copy">Suite 21, Victoria Island, Lagos.</p>
        </article>
      </div>
    </AccountShell>
  );
}
