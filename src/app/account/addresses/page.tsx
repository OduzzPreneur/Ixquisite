import {
  addAddressAction,
  deleteAddressAction,
  setDefaultAddressAction,
  updateAddressAction,
} from "@/app/actions/account";
import { AccountShell } from "@/components/page-templates";
import { getAccountProfileForCurrentUser, getSavedAddressesForCurrentUser } from "@/lib/account";

export default async function AccountAddressesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const [params, profile, addresses] = await Promise.all([
    searchParams,
    getAccountProfileForCurrentUser(),
    getSavedAddressesForCurrentUser(),
  ]);

  return (
    <AccountShell
      title="Address book"
      copy="Saved delivery addresses now live in your account so repeat orders start prefilled and stay short."
    >
      {params.error ? <p className="auth-notice auth-notice--error">{params.error}</p> : null}
      {params.message ? <p className="auth-notice auth-notice--success">{params.message}</p> : null}

      <form action={addAddressAction} className="support-card" style={{ marginBottom: "1.5rem" }}>
        <h3 className="minor-title">Add a new address</h3>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="label">Label</label>
            <input id="label" name="label" defaultValue="Primary delivery" placeholder="Primary delivery" />
          </div>
          <div className="field">
            <label htmlFor="recipient_name">Recipient name</label>
            <input
              id="recipient_name"
              name="recipient_name"
              defaultValue={profile?.fullName ?? ""}
              placeholder="Client Name"
            />
          </div>
          <div className="field">
            <label htmlFor="phone">Phone</label>
            <input id="phone" name="phone" defaultValue={profile?.phone ?? ""} placeholder="+234 800 000 0000" />
          </div>
          <div className="field">
            <label htmlFor="city">City</label>
            <input id="city" name="city" placeholder="Lagos" />
          </div>
          <div className="field" style={{ gridColumn: "1 / -1" }}>
            <label htmlFor="address_line">Address</label>
            <textarea
              id="address_line"
              name="address_line"
              placeholder="Street address, building, landmark"
            />
          </div>
          <div className="field" style={{ gridColumn: "1 / -1" }}>
            <label htmlFor="delivery_notes">Delivery notes</label>
            <textarea
              id="delivery_notes"
              name="delivery_notes"
              placeholder="Optional delivery note"
            />
          </div>
        </div>
        <label className="muted" style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem" }}>
          <input type="checkbox" name="is_default" defaultChecked={addresses.length === 0} />
          Set as default address
        </label>
        <div className="hero__actions">
          <button type="submit" className="button">
            Save address
          </button>
        </div>
      </form>

      {addresses.length > 0 ? (
        <div className="grid grid--2">
          {addresses.map((address) => (
            <article key={address.id} className="support-card">
              <div className="price-row" style={{ alignItems: "start" }}>
                <h3 className="minor-title">{address.label}</h3>
                {address.isDefault ? <span className="pill-link">Default</span> : null}
              </div>
              <p className="body-copy">{address.recipientName}</p>
              {address.phone ? <p className="muted">{address.phone}</p> : null}
              <p className="body-copy">{address.body}</p>
              {address.notes ? <p className="muted">{address.notes}</p> : null}
              <form action={updateAddressAction} className="cta-stack" style={{ marginTop: "0.5rem" }}>
                <input type="hidden" name="address_id" value={address.id} />
                <div className="form-grid">
                  <div className="field">
                    <label htmlFor={`label-${address.id}`}>Label</label>
                    <input id={`label-${address.id}`} name="label" defaultValue={address.label} />
                  </div>
                  <div className="field">
                    <label htmlFor={`recipient-${address.id}`}>Recipient</label>
                    <input id={`recipient-${address.id}`} name="recipient_name" defaultValue={address.recipientName} />
                  </div>
                  <div className="field">
                    <label htmlFor={`phone-${address.id}`}>Phone</label>
                    <input id={`phone-${address.id}`} name="phone" defaultValue={address.phone} />
                  </div>
                  <div className="field">
                    <label htmlFor={`city-${address.id}`}>City</label>
                    <input id={`city-${address.id}`} name="city" defaultValue={address.city ?? ""} />
                  </div>
                  <div className="field" style={{ gridColumn: "1 / -1" }}>
                    <label htmlFor={`address-${address.id}`}>Address</label>
                    <textarea id={`address-${address.id}`} name="address_line" defaultValue={address.addressLine} />
                  </div>
                  <div className="field" style={{ gridColumn: "1 / -1" }}>
                    <label htmlFor={`notes-${address.id}`}>Delivery notes</label>
                    <textarea id={`notes-${address.id}`} name="delivery_notes" defaultValue={address.notes ?? ""} />
                  </div>
                </div>
                <label className="muted" style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem" }}>
                  <input type="checkbox" name="is_default" defaultChecked={address.isDefault} />
                  Keep as default
                </label>
                <div className="hero__actions">
                  <button type="submit" className="button">
                    Update
                  </button>
                </div>
              </form>
              <div className="hero__actions">
                {!address.isDefault ? (
                  <form action={setDefaultAddressAction}>
                    <input type="hidden" name="address_id" value={address.id} />
                    <button type="submit" className="pill-link">
                      Set as default
                    </button>
                  </form>
                ) : null}
                <form action={deleteAddressAction}>
                  <input type="hidden" name="address_id" value={address.id} />
                  <input type="hidden" name="was_default" value={String(address.isDefault)} />
                  <button type="submit" className="pill-link">
                    Delete address
                  </button>
                </form>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state surface-panel">
          <div>
            <h3 className="minor-title">No saved addresses yet</h3>
            <p className="body-copy" style={{ marginTop: "0.8rem" }}>
              Your delivery addresses will start appearing here after the first completed checkout.
            </p>
          </div>
        </div>
      )}
    </AccountShell>
  );
}
