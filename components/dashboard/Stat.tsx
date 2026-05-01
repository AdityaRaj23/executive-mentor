type Accent = "accent" | "amber" | "rose";

export function Stat({
  label,
  value,
  suffix,
  accent,
  text,
}: {
  label: string;
  value: string | number;
  suffix?: string;
  accent?: Accent;
  text?: boolean;
}) {
  const color =
    accent === "accent"
      ? "var(--color-accent)"
      : accent === "amber"
        ? "var(--color-amber)"
        : accent === "rose"
          ? "var(--color-rose)"
          : "var(--color-text)";
  return (
    <div>
      <div className="uc" style={{ fontSize: 9, color: "var(--color-muted)", letterSpacing: "0.14em" }}>
        {label}
      </div>
      <div
        className="h-serif"
        style={{ fontSize: text ? 24 : 32, fontWeight: 500, marginTop: 8, color, lineHeight: 1.1 }}
      >
        {value}
        {suffix}
      </div>
    </div>
  );
}
