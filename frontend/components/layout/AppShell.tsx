"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-inner">
          <Link className="brand" href="/">
            <span className="brand-mark" aria-hidden="true">AW</span>
            <span className="brand-copy">
              <span className="brand-title">AI Workflow Automation</span>
              <span className="brand-subtitle">Reviewed business outputs</span>
            </span>
          </Link>
          <nav className="sidebar-nav" aria-label="Main navigation">
            <ul className="nav-list">
              {navItems.map((item) => {
                const isRequestDetail =
                  pathname.startsWith("/requests/") &&
                  pathname !== "/requests/new";
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : item.href === "/history"
                      ? pathname === item.href || isRequestDetail
                      : pathname.startsWith(item.href);

                return (
                  <li key={item.href}>
                    <Link
                      aria-current={isActive ? "page" : undefined}
                      className={`nav-link ${isActive ? "active" : ""}`.trim()}
                      href={item.href}
                    >
                      <span className="nav-marker" aria-hidden="true" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="sidebar-footer">
            <span className="environment-dot" aria-hidden="true" />
            <span>Local portfolio MVP</span>
          </div>
        </div>
      </aside>
      <div className="shell-main">
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
}
