import type { ReactNode } from "react";

export function Block({ title, sub, children }: { title: string; sub?: string; children: ReactNode }) {
  return (
    <div style={{ padding: "24px 32px", borderBottom: "var(--hairline)" }}>
      <div className="uc" style={{ fontSize: 10, color: "var(--color-muted)", letterSpacing: "0.14em" }}>
        {title}
      </div>
      {sub ? (
        <div
          style={{
            fontSize: 11,
            color: "var(--color-muted)",
            marginTop: 6,
            marginBottom: 16,
            lineHeight: 1.5,
            opacity: 0.7,
          }}
        >
          {sub}
        </div>
      ) : (
        <div style={{ marginBottom: 14 }} />
      )}
      {children}
    </div>
  );
}
