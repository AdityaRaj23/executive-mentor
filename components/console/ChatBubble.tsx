import { Icon } from "@/components/shared/Icon";
import type { Message } from "@/types";

export function ChatBubble({ role, header, body, adminView }: Message & { adminView: boolean }) {
  const isUser = role === "user";
  const redacted = adminView && isUser;

  return (
    <div
      style={{
        display: "flex",
        gap: 14,
        flexDirection: isUser ? "row-reverse" : "row",
        animation: "slideUp 0.35s ease",
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          flexShrink: 0,
          background: isUser ? "rgba(255,255,255,0.04)" : "var(--color-primary)",
          border: isUser ? "var(--hairline)" : "1px solid rgba(16,185,129,0.4)",
          display: "grid",
          placeItems: "center",
          fontFamily: isUser ? "var(--font-body)" : "var(--font-heading)",
          fontStyle: isUser ? "normal" : "italic",
          fontWeight: 600,
          color: isUser ? "var(--color-muted)" : "var(--color-accent)",
          fontSize: isUser ? 12 : 22,
          lineHeight: 1,
          paddingBottom: isUser ? 0 : 2,
        }}
      >
        {isUser ? "EC" : "M"}
      </div>
      <div
        style={{
          maxWidth: "78%",
          padding: "14px 18px",
          background: isUser ? "rgba(16,185,129,0.06)" : "rgba(255,255,255,0.03)",
          border: isUser ? "1px solid rgba(16,185,129,0.2)" : "var(--hairline)",
          borderRadius: "var(--radius)",
          position: "relative",
        }}
      >
        {redacted ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontSize: 13,
              color: "var(--color-muted)",
              fontStyle: "italic",
            }}
          >
            <Icon name="lock" size={14} />
            Member message — encrypted, not visible to admins
          </div>
        ) : (
          <>
            {header && (
              <div className="h-serif" style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.25, marginBottom: 8 }}>
                {header}
              </div>
            )}
            <div style={{ fontSize: 14, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{body}</div>
          </>
        )}
      </div>
    </div>
  );
}
