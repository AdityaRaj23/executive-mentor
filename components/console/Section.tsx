import type { ReactNode } from "react";

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <div className="uc" style={{ fontSize: 10, color: "var(--color-muted)", marginBottom: 12 }}>
        {title}
      </div>
      {children}
    </div>
  );
}
