import Image from "next/image";
import Link from "next/link";
import { AnnouncementTicker } from "@/components/announcement-ticker";
import { announcements, footerGroups, navItems } from "@/data/site";

function LogoMark({ footer = false }: { footer?: boolean }) {
  return (
    <Link href="/" className={`logo-mark${footer ? " logo-mark--footer" : ""}`} aria-label="Ixquisite Menswear home">
      <span className="logo-mark__frame">
        <Image
          src="/images/ixquisite/brand-landscape.jpg"
          alt="Ixquisite Menswear logo"
          width={960}
          height={540}
          className="logo-mark__image"
          sizes={footer ? "220px" : "180px"}
        />
      </span>
    </Link>
  );
}

function AnnouncementBar() {
  return (
    <div className="announcement-bar">
      <AnnouncementTicker items={announcements} />
    </div>
  );
}

function Header() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
          <details className="mobile-drawer">
            <summary aria-label="Open navigation">Menu</summary>
            <div className="mobile-drawer__panel">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  {item.label}
                </Link>
              ))}
            </div>
          </details>
          <LogoMark />
        </div>

        <nav className="site-nav" aria-label="Primary">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="utility-nav" aria-label="Utility navigation">
          <Link href="/search" aria-label="Search">
            <span className="utility-nav__label">Search</span>
          </Link>
          <Link href="/wishlist" aria-label="Wishlist">
            <span className="utility-nav__label">Wishlist</span>
          </Link>
          <Link href="/account" aria-label="Account">
            <span className="utility-nav__label">Account</span>
          </Link>
          <Link href="/cart" aria-label="Cart">
            <span className="utility-nav__label">Cart</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__grid">
        <div className="footer__brand">
          <LogoMark footer />
          <p>
            Premium menswear for professionals who want confidence, convenience,
            and a wardrobe that feels composed from the first meeting to the last.
          </p>
          <form className="newsletter-form">
            <input type="email" placeholder="Email for arrivals and private drops" />
            <button className="button" type="submit">
              Join VIP
            </button>
          </form>
        </div>

        {footerGroups.map((group) => (
          <div key={group.title} className="footer__group">
            <h4>{group.title}</h4>
            {group.links.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
        ))}
      </div>

      <div className="footer__bottom">
        <span>Ixquisite Menswear</span>
        <span>Quiet luxury for work, ceremony, and travel.</span>
      </div>
    </footer>
  );
}

export function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="site-shell">
      <AnnouncementBar />
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
