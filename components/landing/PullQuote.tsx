export function PullQuote() {
  return (
    <section style={{ maxWidth: 1100, margin: "120px auto 0", padding: "0 32px", textAlign: "center" }}>
      <div
        style={{
          fontSize: 60,
          fontFamily: "var(--font-heading)",
          color: "var(--color-accent)",
          lineHeight: 0.6,
          marginBottom: 20,
        }}
      >
        “
      </div>
      <blockquote
        className="h-serif"
        style={{
          fontSize: 38,
          lineHeight: 1.3,
          fontStyle: "italic",
          fontWeight: 400,
          margin: 0,
          letterSpacing: "-0.01em",
        }}
      >
        Every operator in our portfolio gets one of these now. It&apos;s the closest thing to a fractional COO any of them have ever had.
      </blockquote>
      <div style={{ marginTop: 32, display: "flex", alignItems: "center", justifyContent: "center", gap: 14 }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "linear-gradient(135deg, var(--color-primary), var(--color-bg))",
            border: "1px solid rgba(16,185,129,0.3)",
          }}
        />
        <div style={{ textAlign: "left" }}>
          <div style={{ fontWeight: 600, fontSize: 14 }}>Lena Aldrich</div>
          <div style={{ fontSize: 12, color: "var(--color-muted)" }}>Managing Partner · Northvane Capital</div>
        </div>
      </div>
    </section>
  );
}
