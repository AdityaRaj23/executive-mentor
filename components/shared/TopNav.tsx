"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Persona } from "@/types";
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

function personaForPath(pathname: string): Persona {
  if (pathname.startsWith("/dashboard")) return "admin";
  if (pathname.startsWith("/first-year")) return "grad";
  return "individual";
}

function initialsFor(persona: Persona) {
  if (persona === "admin") return "AK";
  if (persona === "grad") return "NV";
  return "EC";
}

export function TopNav() {
  const pathname = usePathname() ?? "/";
  const persona = personaForPath(pathname);

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

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <ModeToggle />
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "linear-gradient(135deg, var(--color-primary), var(--color-bg))",
              border: "var(--hairline-strong)",
              display: "grid",
              placeItems: "center",
              fontSize: 12,
              fontWeight: 600,
              color: "var(--color-accent)",
            }}
          >
            {initialsFor(persona)}
          </div>
        </div>
      </div>
    </nav>
  );
}
