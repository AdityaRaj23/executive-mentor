import { Kicker } from "@/components/shared/Kicker";
import type { Archetype } from "@/types";
import { DataBlock } from "./DataBlock";

export function ArchetypeDeepDive({ archetype: a }: { archetype: Archetype | undefined }) {
  if (!a) return null;
  return (
    <div className="glass" style={{ padding: 40, marginBottom: 48 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          flexWrap: "wrap",
          gap: 16,
          marginBottom: 28,
        }}
      >
        <div>
          <Kicker accent>What life looks like as · {a.label}</Kicker>
          <div
            className="h-serif"
            style={{ fontSize: 38, fontWeight: 500, fontStyle: "italic", marginTop: 14, lineHeight: 1.05 }}
          >
            {a.tag}.
          </div>
        </div>
        <div className="mono" style={{ fontSize: 11, color: "var(--color-accent)" }}>
          ● live preview
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 0,
          borderTop: "var(--hairline)",
          marginBottom: 32,
        }}
      >
        {[
          { label: "Year 1", body: a.yr1 },
          { label: "Year 5", body: a.yr5 },
          { label: "Year 10", body: a.yr10 },
        ].map((step, i) => (
          <div
            key={i}
            style={{
              padding: "22px 24px",
              borderRight: i < 2 ? "var(--hairline)" : "none",
              position: "relative",
            }}
          >
            <div className="uc" style={{ fontSize: 10, color: "var(--color-muted)", letterSpacing: "0.14em" }}>
              {step.label}
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.55, marginTop: 12 }}>{step.body}</div>
            {i < 2 && (
              <div
                style={{
                  position: "absolute",
                  right: -8,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  background: "var(--color-bg)",
                  border: "1px solid rgba(16,185,129,0.4)",
                  display: "grid",
                  placeItems: "center",
                  color: "var(--color-accent)",
                  fontSize: 10,
                  zIndex: 2,
                }}
              >
                →
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 32 }}>
        <DataBlock label="Comp arc · year 1 → year 10" value={a.salary} mono />
        <DataBlock label="Daily texture" value={a.daily} />
        <DataBlock label="Real people on this path" value={a.examplePeople} />
        <DataBlock label="Skills you'd compound" tags={a.skills} />
      </div>

      <div style={{ marginTop: 28, paddingTop: 28, borderTop: "var(--hairline)" }}>
        <div className="uc" style={{ fontSize: 10, color: "var(--color-muted)", marginBottom: 14 }}>
          Entry points still open to you
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {a.entry.map((e, i) => (
            <span
              key={i}
              style={{
                fontSize: 12,
                padding: "8px 14px",
                background: "rgba(16,185,129,0.06)",
                border: "1px solid rgba(16,185,129,0.25)",
                color: "var(--color-text)",
              }}
            >
              {e}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
