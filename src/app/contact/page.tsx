import { UtilityPageHeader } from "@/components/page-templates";

export default function ContactPage() {
  return (
    <>
      <UtilityPageHeader
        eyebrow="Contact"
        title="High-touch support for sizing, delivery, and corporate requests."
        copy="Contact routes should feel direct and human, especially for premium menswear where fit and timing matter."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />
      <section className="page-section">
        <div className="feature-split">
          <div className="support-card">
            <div className="summary-list">
              <div>
                <h3 className="minor-title">Phone</h3>
                <p className="body-copy">+234 800 000 0000</p>
              </div>
              <div>
                <h3 className="minor-title">WhatsApp</h3>
                <p className="body-copy">+234 800 000 0001</p>
              </div>
              <div>
                <h3 className="minor-title">Email</h3>
                <p className="body-copy">care@ixquisite.com</p>
              </div>
              <div>
                <h3 className="minor-title">Hours</h3>
                <p className="body-copy">Mon - Sat · 9am - 6pm</p>
              </div>
            </div>
          </div>
          <div className="support-card">
            <div className="field">
              <label>Name</label>
              <input placeholder="Your name" />
            </div>
            <div className="field">
              <label>Email</label>
              <input placeholder="you@example.com" type="email" />
            </div>
            <div className="field">
              <label>Message</label>
              <textarea placeholder="Sizing help, corporate order, or delivery question" />
            </div>
            <button type="button" className="button" style={{ width: "fit-content" }}>
              Send message
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
