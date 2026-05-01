"use client";
import { useState } from "react";
import { Icon } from "@/components/shared/Icon";

export function ChatInput({
  value,
  onChange,
  onSend,
  disabled,
  adminView,
}: {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  disabled: boolean;
  adminView: boolean;
}) {
  const [focus, setFocus] = useState(false);
  if (adminView) {
    return (
      <div
        style={{
          padding: "20px 24px",
          borderTop: "var(--hairline)",
          background: "rgba(245,158,11,0.05)",
          textAlign: "center",
          fontSize: 12,
          color: "var(--color-muted)",
          fontFamily: "var(--font-mono)",
        }}
      >
        Admin cannot see or send messages in this session.
      </div>
    );
  }
  const canSend = value.trim().length > 0 && !disabled;
  return (
    <div style={{ padding: "18px 24px", borderTop: "var(--hairline)", background: "var(--color-surface)" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "4px 4px 4px 18px",
          background: "rgba(255,255,255,0.03)",
          border: focus ? "1px solid rgba(16,185,129,0.5)" : "var(--hairline)",
          borderRadius: "var(--radius)",
          transition: "border 0.18s",
        }}
      >
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
          placeholder="Ask M anything · Cmd+K for shortcuts"
          disabled={disabled}
          style={{
            flex: 1,
            background: "transparent",
            border: 0,
            outline: "none",
            fontSize: 15,
            padding: "14px 0",
            color: "var(--color-text)",
          }}
        />
        <button
          onClick={onSend}
          disabled={!canSend}
          style={{
            width: 40,
            height: 40,
            background: canSend ? "var(--color-accent)" : "rgba(16,185,129,0.15)",
            color: canSend ? "var(--color-bg)" : "var(--color-accent)",
            border: 0,
            borderRadius: "var(--radius)",
            cursor: canSend ? "pointer" : "default",
            display: "grid",
            placeItems: "center",
            transition: "all 0.18s",
            boxShadow: canSend ? "0 0 24px rgba(16,185,129,0.3)" : "none",
          }}
        >
          <Icon name="send" size={16} />
        </button>
      </div>
      <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--color-muted)" }}>
        <span>Powered by claude-haiku-4-5 · End-to-end encrypted</span>
        <span className="mono">↵ to send · ⇧↵ for newline</span>
      </div>
    </div>
  );
}
