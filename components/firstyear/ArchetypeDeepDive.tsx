"use client";
import { useState } from "react";
import { CTA } from "@/components/shared/CTA";
import { Kicker } from "@/components/shared/Kicker";
import type { Archetype, DiagnosticAnswers } from "@/types";
import { DataBlock } from "./DataBlock";

export function ArchetypeDeepDive({
  archetype: a,
  answers,
  personalNotes,
  setPersonalNotes,
}: {
  archetype: Archetype | undefined;
  answers: DiagnosticAnswers;
  personalNotes: Record<string, string> | null;
  setPersonalNotes: (next: Record<string, string>) => void;
}) {
  const [loading, setLoading] = useState(false);

  if (!a) return null;

  const paragraph = personalNotes?.[a.id];

  const personalize = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/firstyear/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "archetype-personal",
          answers,
          archetype: { id: a.id, label: a.label, tag: a.tag },
        }),
      });
      if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(error || "Request failed");
      }
      const { paragraph: text } = (await res.json()) as { paragraph: string };
      setPersonalNotes({ ...(personalNotes ?? {}), [a.id]: text });
    } catch {
      window.alert("M had trouble personalizing this. Try again.");
    } finally {
      setLoading(false);
    }
  };

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
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {!paragraph && (
            <CTA size="sm" icon="sparkle" onClick={personalize}>
              {loading ? "M is reading…" : "Personalize for me"}
            </CTA>
          )}
          {paragraph && (
            <CTA variant="ghost" size="sm" onClick={personalize}>
              {loading ? "Re-reading…" : "Re-personalize"}
            </CTA>
          )}
        </div>
      </div>

      {loading && !paragraph && (
        <div className="glass shimmer" style={{ height: 88, marginBottom: 28 }} />
      )}

      {paragraph && (
        <div
          style={{
            marginBottom: 32,
            padding: "20px 22px",
            borderLeft: "2px solid var(--color-accent)",
            background: "rgba(16,185,129,0.04)",
          }}
        >
          <div
            className="uc"
            style={{
              fontSize: 9,
              color: "var(--color-accent)",
              letterSpacing: "0.14em",
              marginBottom: 10,
            }}
          >
            How this plays out for you
          </div>
          <div
            style={{
              fontSize: 15,
              lineHeight: 1.6,
              color: "var(--color-text)",
            }}
          >
            {paragraph}
          </div>
        </div>
      )}

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
