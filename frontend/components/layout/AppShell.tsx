"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";

const navItems: Array<{ href: string; icon: IconName; label: string }> = [
  { href: "/", icon: "dashboard", label: "Dashboard" },
  { href: "/requests/new", icon: "documentPlus", label: "New Request" },
  { href: "/history", icon: "history", label: "History" },
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
            <span className="brand-mark" aria-hidden="true">
              AW
            </span>
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
                      <Icon className="nav-icon" name={item.icon} size={17} />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="sidebar-footer">
            <span className="environment-dot" aria-hidden="true" />
            <span>Portfolio MVP</span>
          </div>
        </div>
      </aside>
      <div className="shell-main">
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
}
