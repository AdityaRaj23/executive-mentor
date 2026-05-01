import { Icon } from "@/components/shared/Icon";

export function CheckRow({ text, done, onToggle }: { text: string; done: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        padding: "8px 10px",
        background: done ? "rgba(16,185,129,0.06)" : "transparent",
        border: "1px solid " + (done ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.06)"),
        cursor: "pointer",
        fontFamily: "inherit",
        color: "inherit",
        textAlign: "left",
      }}
    >
      <div
        style={{
          width: 14,
          height: 14,
          marginTop: 2,
          flexShrink: 0,
          border: "1.5px solid " + (done ? "var(--color-accent)" : "var(--color-muted)"),
          background: done ? "var(--color-accent)" : "transparent",
          display: "grid",
          placeItems: "center",
          color: "var(--color-bg)",
        }}
      >
        {done && <Icon name="check" size={9} stroke={3} />}
      </div>
      <span
        style={{
          fontSize: 12,
          lineHeight: 1.5,
          textDecoration: done ? "line-through" : "none",
          opacity: done ? 0.6 : 1,
        }}
      >
        {text}
      </span>
    </button>
  );
}
