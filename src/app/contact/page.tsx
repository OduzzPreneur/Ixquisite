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
              <label htmlFor="contact_name">Name</label>
              <input id="contact_name" name="name" autoComplete="name" placeholder="Your name" />
            </div>
            <div className="field">
              <label htmlFor="contact_email">Email</label>
              <input
                id="contact_email"
                name="email"
                placeholder="you@example.com"
                type="email"
                autoComplete="email"
              />
            </div>
            <div className="field">
              <label htmlFor="contact_message">Message</label>
              <textarea
                id="contact_message"
                name="message"
                placeholder="Sizing help, corporate order, or delivery question"
              />
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
