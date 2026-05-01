"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { LogoMark } from "./LogoMark";
import { Icon, type IconName } from "./Icon";
import { ModeToggle } from "./ModeToggle";

const SCREENS: { href: string; label: string; icon: IconName }[] = [
  { href: "/", label: "Pitch", icon: "home" },
  { href: "/first-year", label: "First Year", icon: "spark" },
  { href: "/console", label: "Console", icon: "chat" },
  { href: "/roadmap", label: "Roadmap", icon: "map" },
  { href: "/dashboard", label: "Dashboard", icon: "grid" },
];

export function TopNav() {
  const pathname = usePathname() ?? "/";

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        borderBottom: "var(--hairline)",
        background: "rgba(5, 10, 15, 0.72)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      <div
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          padding: "14px 32px",
          display: "flex",
          alignItems: "center",
          gap: 24,
          flexWrap: "wrap",
        }}
      >
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            color: "inherit",
          }}
        >
          <LogoMark size={28} />
          <div style={{ whiteSpace: "nowrap" }}>
            <div className="h-serif" style={{ fontSize: 18, lineHeight: 1, fontStyle: "italic", whiteSpace: "nowrap" }}>
              Executive Mentor
            </div>
            <div className="uc" style={{ fontSize: 9, color: "var(--color-muted)", marginTop: 3, whiteSpace: "nowrap" }}>
              Wisdom at scale
            </div>
          </div>
        </Link>

        <div style={{ flex: 1, display: "flex", justifyContent: "center", gap: 4 }}>
          {SCREENS.map((s) => {
            const active = s.href === "/" ? pathname === "/" : pathname.startsWith(s.href);
            return (
              <Link
                key={s.href}
                href={s.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 16px",
                  background: active ? "rgba(16, 185, 129, 0.08)" : "transparent",
                  border: active ? "1px solid rgba(16, 185, 129, 0.3)" : "1px solid transparent",
                  borderRadius: "var(--radius)",
                  color: active ? "var(--color-accent)" : "var(--color-muted)",
                  fontSize: 13,
                  fontWeight: 500,
                  transition: "all 0.18s ease",
                }}
              >
                <Icon name={s.icon} size={14} />
                {s.label}
              </Link>
            );
          })}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <ModeToggle />
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button
                type="button"
                style={{
                  height: 32,
                  padding: "0 14px",
                  background: "transparent",
                  border: "var(--hairline-strong)",
                  borderRadius: "var(--radius)",
                  color: "var(--color-muted)",
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.18s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--color-text)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--color-muted)";
                }}
              >
                Sign in
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button
                type="button"
                style={{
                  height: 32,
                  padding: "0 14px",
                  background: "var(--color-accent)",
                  border: "1px solid var(--color-accent)",
                  borderRadius: "var(--radius)",
                  color: "var(--color-bg)",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.18s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.filter = "brightness(1.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.filter = "none";
                }}
              >
                Sign up
              </button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: { width: 32, height: 32 },
                },
              }}
            />
          </Show>
        </div>
      </div>
    </nav>
  );
}
