import { Icon } from "@/components/shared/Icon";

export function PrivacyBanner() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 16px",
        marginBottom: 24,
        background: "rgba(14,165,233,0.05)",
        border: "1px solid rgba(14,165,233,0.25)",
        borderRadius: "var(--radius)",
        fontSize: 12,
        color: "var(--color-muted)",
      }}
    >
      <Icon name="lock" size={14} />
      <span>
        <strong style={{ color: "var(--color-text)" }}>Privacy-first analytics.</strong> Themes &amp; readiness only — no transcripts. Cohort min size of 5. Member identities visible only to admins of record.
      </span>
    </div>
  );
}
