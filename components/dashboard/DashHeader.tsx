import { CTA } from "@/components/shared/CTA";
import { Kicker } from "@/components/shared/Kicker";

export function DashHeader() {
  return (
    <header
      style={{
        marginBottom: 32,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        gap: 24,
        flexWrap: "wrap",
      }}
    >
      <div style={{ minWidth: 0, flex: "1 1 auto" }}>
        <Kicker accent>Northvane Capital · Spring &apos;26 cohort</Kicker>
        <h1
          className="h-serif"
          style={{ fontSize: "clamp(32px, 4.5vw, 48px)", lineHeight: 1.1, margin: "16px 0 8px", fontWeight: 500 }}
        >
          Cohort intelligence
        </h1>
        <div className="mono" style={{ fontSize: 12, color: "var(--color-muted)", margin: 0 }}>
          Last sync · 2m ago · 1,284 members in scope
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
        <CTA variant="ghost" size="sm">
          Last 30 days
        </CTA>
        <CTA variant="accent" size="sm" icon="bell">
          Alerts (3)
        </CTA>
      </div>
    </header>
  );
}
