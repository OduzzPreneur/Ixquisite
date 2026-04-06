"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type NavItem = {
  href: string;
  label: string;
};

export function MobileNavDrawer({
  navItems,
  utilityItems,
}: {
  navItems: readonly NavItem[];
  utilityItems: readonly NavItem[];
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className={`mobile-drawer${open ? " mobile-drawer--open" : ""}`}>
      <button
        type="button"
        className="mobile-drawer__trigger"
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        Menu
      </button>
      {open ? <button type="button" className="mobile-drawer__backdrop" aria-label="Close navigation" onClick={() => setOpen(false)} /> : null}
      <div className="mobile-drawer__panel">
        <div className="mobile-drawer__section">
          <p className="mobile-drawer__heading">Browse</p>
          <div className="mobile-drawer__list">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="mobile-drawer__section">
          <p className="mobile-drawer__heading">Your account</p>
          <div className="mobile-drawer__list mobile-drawer__list--utility">
            {utilityItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
