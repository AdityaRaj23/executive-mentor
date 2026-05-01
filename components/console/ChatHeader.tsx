"use client";
import { CTA } from "@/components/shared/CTA";
import { Icon } from "@/components/shared/Icon";

export function ChatHeader({
  adminView,
  setAdminView,
  onReset,
}: {
  adminView: boolean;
  setAdminView: (v: boolean) => void;
  onReset: () => void;
}) {
  return (
    <div
      style={{
        padding: "18px 24px",
        borderBottom: "var(--hairline)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 36,
            height: 36,
            background: "var(--color-primary)",
            border: "1px solid rgba(16,185,129,0.4)",
            display: "grid",
            placeItems: "center",
            fontFamily: "var(--font-heading)",
            fontStyle: "italic",
            fontWeight: 600,
            color: "var(--color-accent)",
            fontSize: 22,
            lineHeight: 1,
            paddingBottom: 2,
          }}
        >
          M
        </div>
        <div>
          <div className="h-serif" style={{ fontSize: 18, fontStyle: "italic" }}>
            M · Mentor
          </div>
          <div className="mono" style={{ fontSize: 11, color: adminView ? "var(--color-amber)" : "var(--color-accent)" }}>
            {adminView ? "◆ admin preview · session redacted" : "● live · context refreshed 2m ago"}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <button
          onClick={() => setAdminView(!adminView)}
          title="Preview what the admin sees"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 12px",
            background: adminView ? "rgba(245,158,11,0.12)" : "transparent",
            border: "1px solid " + (adminView ? "rgba(245,158,11,0.4)" : "rgba(255,255,255,0.16)"),
            color: adminView ? "var(--color-amber)" : "var(--color-muted)",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            borderRadius: "var(--radius)",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          <Icon name="lock" size={12} />
          {adminView ? "Admin view on" : "Show admin view"}
        </button>
        <CTA variant="ghost" size="sm" onClick={onReset}>
          New session
        </CTA>
      </div>
    </div>
  );
}
