import Link from "next/link";
import type { ReactNode } from "react";

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/requests/new", label: "New Request" },
  { href: "/history", label: "History" },
  { href: "/requests/demo-request", label: "Request Detail" },
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
            <span className="brand-subtitle">Internal operations dashboard</span>
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
      <main className="main-content">{children}</main>
    </div>
  );
}
