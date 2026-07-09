import Link from "next/link";
import type { ReactNode } from "react";

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/requests/new", label: "New Request" },
  { href: "/history", label: "History" },
];

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <Link className="brand" href="/">
            <span className="brand-title">AI Workflow Automation</span>
            <span className="brand-subtitle">
              Turn repetitive work into reviewed business outputs
            </span>
          </Link>
          <nav aria-label="Main navigation">
            <ul className="nav-list">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link className="nav-link" href={item.href}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>
      <section className="value-strip" aria-label="Product value">
        <div className="value-strip-inner">
          <span>Structured requests</span>
          <span>AI-assisted drafts</span>
          <span>Human review</span>
          <span>Traceable history</span>
        </div>
      </section>
      <main className="main-content">{children}</main>
    </div>
  );
}
