"use client";
import { useState } from "react";
import { CTA } from "@/components/shared/CTA";
import { Kicker } from "@/components/shared/Kicker";
import type { Archetype, DiagnosticAnswers, TalentStack as TalentStackShape } from "@/types";

export function TalentStack({
  answers,
  stack,
  setStack,
  archetype,
}: {
  answers: DiagnosticAnswers;
  stack: TalentStackShape | null;
  setStack: (v: TalentStackShape | null) => void;
  archetype?: Archetype;
}) {
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!archetype) return;
    setLoading(true);
    try {
      const res = await fetch("/api/firstyear/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "talent-stack",
          answers,
          archetype: { id: archetype.id, label: archetype.label, tag: archetype.tag },
        }),
      });
      if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(error || "Request failed");
      }
      const data = (await res.json()) as TalentStackShape;
      setStack(data);
    } catch {
      window.alert("M had trouble generating your stack. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginBottom: 48 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: 20,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div style={{ flex: "1 1 320px", minWidth: 0 }}>
          <Kicker accent>Your talent stack</Kicker>
          <div className="h-serif" style={{ fontSize: 32, fontWeight: 500, marginTop: 12, lineHeight: 1.2 }}>
            What you already have.
          </div>
        </div>
        {!stack && (
          <CTA size="sm" icon="sparkle" onClick={generate}>
            {loading ? "M is reading…" : "Generate stack"}
          </CTA>
        )}
        {stack && (
          <CTA variant="ghost" size="sm" onClick={generate}>
            {loading ? "Re-reading…" : "Re-generate"}
          </CTA>
        )}
      </div>

      {!stack && !loading && (
        <div
          className="glass"
          style={{
            padding: 32,
            textAlign: "center",
            color: "var(--color-muted)",
            fontSize: 14,
            lineHeight: 1.6,
          }}
        >
          M will analyze your diagnostic answers and surface specific strengths most fresh grads can&apos;t articulate about themselves.
        </div>
      )}

      {loading && <div className="glass shimmer" style={{ padding: 60, height: 220 }} />}

      {stack && !loading && (
        <div className="glass" style={{ padding: 32 }}>
          <div
            className="h-serif"
            style={{
              fontSize: 22,
              fontStyle: "italic",
              fontWeight: 500,
              lineHeight: 1.35,
              marginBottom: 28,
              color: "var(--color-accent)",
            }}
          >
            &quot;{stack.headline}&quot;
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 32 }}>
            <div>
              <div className="uc" style={{ fontSize: 10, color: "var(--color-muted)", marginBottom: 14 }}>
                Confirmed strengths
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {(stack.strengths || []).map((s, i) => (
                  <div key={i} style={{ display: "flex", gap: 14 }}>
                    <div style={{ width: 4, alignSelf: "stretch", background: "var(--color-accent)" }} />
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{s.label}</div>
                      <div style={{ fontSize: 12, color: "var(--color-muted)", marginTop: 4, lineHeight: 1.5 }}>
                        {s.evidence}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="uc" style={{ fontSize: 10, color: "var(--color-muted)", marginBottom: 14 }}>
                Latent — under-claimed
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
                {(stack.latent || []).map((s, i) => (
                  <div
                    key={i}
                    style={{
                      padding: 14,
                      background: "rgba(14,165,233,0.04)",
                      border: "1px solid rgba(14,165,233,0.25)",
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-sapphire)" }}>{s.label}</div>
                    <div style={{ fontSize: 12, color: "var(--color-muted)", marginTop: 4, lineHeight: 1.5 }}>
                      {s.why}
                    </div>
                  </div>
                ))}
              </div>
              <div className="uc" style={{ fontSize: 10, color: "var(--color-muted)", marginBottom: 12 }}>
                Weak signals · worth strengthening
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {(stack.weak_signals_to_strengthen || []).map((s, i) => (
                  <div
                    key={i}
                    style={{
                      padding: 12,
                      border: "1px dashed rgba(245,158,11,0.4)",
                      background: "rgba(245,158,11,0.04)",
                    }}
                  >
                    <div style={{ fontSize: 12, fontWeight: 600, color: "var(--color-amber)" }}>{s.label}</div>
                    <div style={{ fontSize: 11, color: "var(--color-muted)", marginTop: 4, lineHeight: 1.5 }}>
                      → {s.first_step}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
