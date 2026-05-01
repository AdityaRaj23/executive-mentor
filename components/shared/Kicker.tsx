import type { ReactNode } from "react";

export function Kicker({ children, accent }: { children: ReactNode; accent?: boolean }) {
  return (
    <div
      className="uc"
      style={{
        fontSize: 11,
        color: accent ? "var(--color-accent)" : "var(--color-muted)",
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      <span style={{ width: 24, height: 1, background: accent ? "var(--color-accent)" : "var(--color-muted)" }} />
      {children}
    </div>
  );
}
