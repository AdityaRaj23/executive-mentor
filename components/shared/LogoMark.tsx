export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        background: "var(--color-primary)",
        border: "1px solid rgba(16,185,129,0.4)",
        display: "grid",
        placeItems: "center",
        fontFamily: "var(--font-heading)",
        fontSize: size * 0.62,
        fontWeight: 600,
        fontStyle: "italic",
        color: "var(--color-accent)",
        letterSpacing: "-0.04em",
        lineHeight: 1,
        paddingBottom: 2,
      }}
    >
      M
    </div>
  );
}
