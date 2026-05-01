export function DataBlock({
  label,
  value,
  mono,
  tags,
}: {
  label: string;
  value?: string;
  mono?: boolean;
  tags?: string[];
}) {
  return (
    <div>
      <div className="uc" style={{ fontSize: 10, color: "var(--color-muted)", marginBottom: 10 }}>
        {label}
      </div>
      {tags ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {tags.map((t, i) => (
            <span
              key={i}
              style={{
                fontSize: 12,
                padding: "4px 10px",
                background: "rgba(16,185,129,0.1)",
                color: "var(--color-accent)",
              }}
            >
              {t}
            </span>
          ))}
        </div>
      ) : (
        <div
          style={{
            fontSize: mono ? 14 : 13,
            fontFamily: mono ? "var(--font-mono)" : "inherit",
            color: "var(--color-text)",
            lineHeight: 1.55,
          }}
        >
          {value}
        </div>
      )}
    </div>
  );
}
