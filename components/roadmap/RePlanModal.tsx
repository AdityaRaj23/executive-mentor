"use client";
import { CTA } from "@/components/shared/CTA";
import { Kicker } from "@/components/shared/Kicker";

export function RePlanModal({
  text,
  setText,
  onClose,
  onSubmit,
  loading,
}: {
  text: string;
  setText: (v: string) => void;
  onClose: () => void;
  onSubmit: () => void;
  loading: boolean;
}) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        display: "grid",
        placeItems: "center",
        zIndex: 100,
        backdropFilter: "blur(8px)",
        animation: "fadeIn 0.25s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="glass"
        style={{ padding: 36, maxWidth: 560, width: "90%", boxShadow: "var(--shadow-card)" }}
      >
        <Kicker accent>Re-plan with M</Kicker>
        <h2 className="h-serif" style={{ fontSize: 32, fontWeight: 500, lineHeight: 1.15, margin: "14px 0 18px" }}>
          What changed?
        </h2>
        <p style={{ fontSize: 13, color: "var(--color-muted)", margin: "0 0 18px" }}>
          Describe a shock, a pivot, or a curiosity. M will draft an alt-trajectory and overlay it as a ghost path on your timeline.
        </p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          autoFocus
          rows={3}
          placeholder='e.g. "I want to pivot to PM" · "Got laid off, need to re-enter" · "Going solo as an indie consultant"'
          style={{
            width: "100%",
            background: "rgba(255,255,255,0.03)",
            border: "var(--hairline)",
            borderRadius: "var(--radius)",
            padding: 14,
            fontSize: 14,
            fontFamily: "var(--font-body)",
            color: "var(--color-text)",
            outline: "none",
            resize: "none",
          }}
        />
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
          <CTA variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </CTA>
          <CTA size="sm" icon={loading ? null : "sparkle"} onClick={onSubmit}>
            {loading ? "Drafting…" : "Generate alt-path"}
          </CTA>
        </div>
      </div>
    </div>
  );
}
