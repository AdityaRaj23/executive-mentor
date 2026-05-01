export function ReadinessBadge({ score }: { score: number }) {
  const color = score >= 80 ? "var(--color-accent)" : score >= 50 ? "var(--color-amber)" : "var(--color-rose)";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        fontSize: 12,
        fontFamily: "var(--font-mono)",
        fontWeight: 500,
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: color }} />
      <span style={{ color }}>{score}</span>
    </span>
  );
}
