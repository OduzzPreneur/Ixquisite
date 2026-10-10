import Image from "next/image";
import Link from "next/link";
import { AnnouncementTicker } from "@/components/announcement-ticker";
import { MobileNavDrawer } from "@/components/mobile-nav-drawer";
import { announcements, footerGroups, navItems } from "@/data/site";
import { emailHasAdminAccess } from "@/lib/admin";
import { getAuthenticatedUser } from "@/lib/auth";

const baseUtilityItems = [
  { href: "/search", label: "Search" },
  { href: "/wishlist", label: "Wishlist" },
  { href: "/account", label: "Account" },
  { href: "/cart", label: "Cart" },
] as const;

function UtilityIcon({ label }: { label: string }) {
  switch (label.toLowerCase()) {
    case "search":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.5" y2="16.5" />
        </svg>
      );
    case "wishlist":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      );
    case "account":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );
    case "cart":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
          <path d="M3 6h18" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      );
    default:
      return null;
  }
}

function LogoMark({ footer = false }: { footer?: boolean }) {
  if (footer) {
    return (
      <Link href="/" className="logo-mark logo-mark--footer" aria-label="Ixquisite Menswear home">
        <span className="logo-mark__frame">
          <Image
            src="/images/ixquisite/brand-landscape.jpg"
            alt="Ixquisite Menswear"
            width={960}
            height={540}
            className="logo-mark__image"
            sizes="220px"
          />
        </span>
      </Link>
    );
  }

  return (
    <Link href="/" className="logo-mark" aria-label="Ixquisite Menswear home">
      <span className="logo-mark__brand-lockup">
        <span className="logo-mark__symbol" aria-hidden="true">
          <svg viewBox="0 0 36 36" width="30" height="30" fill="none">
            <rect x="2" y="2" width="32" height="32" rx="8" fill="#10223a" />
            <path d="M10 10L18 20L26 10" stroke="#d7bf96" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10 26L18 16L26 26" stroke="#f0e7d7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="18" cy="18" r="2.5" fill="#d7bf96" />
          </svg>
        </span>
        <span className="logo-mark__text">
          <span className="logo-mark__name">IXQUISITE</span>
          <span className="logo-mark__sub">MENSWEAR</span>
        </span>
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

async function Header() {
  const user = await getAuthenticatedUser();
  const utilityItems = emailHasAdminAccess(user?.email)
    ? [{ href: "/admin", label: "Admin" }, ...baseUtilityItems]
    : baseUtilityItems;

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <div className="site-header__brand">
          <MobileNavDrawer navItems={navItems} utilityItems={utilityItems} />
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
          {utilityItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              className={
                item.href === "/wishlist" || item.href === "/account" || item.href === "/admin"
                  ? "utility-nav__link utility-nav__link--secondary"
                  : "utility-nav__link"
              }
            >
              <UtilityIcon label={item.label} />
              <span className="utility-nav__label">{item.label}</span>
            </Link>
          ))}
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
            <label className="sr-only" htmlFor="newsletter_email">
              Email address for private arrivals and product updates
            </label>
            <input
              id="newsletter_email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Email for arrivals and private drops"
            />
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

export async function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="site-shell">
      <AnnouncementBar />
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
