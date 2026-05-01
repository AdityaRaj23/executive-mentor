import { boardroom } from "@/lib/voice";

export function ThinkingIndicator() {
  return (
    <div style={{ display: "flex", gap: 14, animation: "fadeIn 0.3s ease" }}>
      <div
        style={{
          width: 40,
          height: 40,
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
      <div style={{ padding: "14px 18px", background: "rgba(255,255,255,0.03)", border: "var(--hairline)" }}>
        <div
          className="h-serif"
          style={{
            fontSize: 16,
            fontStyle: "italic",
            color: "var(--color-muted)",
            animation: "pulse 1.4s ease-in-out infinite",
          }}
        >
          {boardroom.thinking}
        </div>
      </div>
    </div>
  );
}
