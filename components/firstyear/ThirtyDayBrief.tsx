"use client";
import { useState } from "react";
import { CTA } from "@/components/shared/CTA";
import { Icon } from "@/components/shared/Icon";
import { Kicker } from "@/components/shared/Kicker";
import type { Archetype, DiagnosticAnswers, ThirtyDayBrief as BriefShape } from "@/types";
import { CheckRow } from "./CheckRow";

type ToggleKey = "_doneTalk" | "_doneApps" | "_doneShip" | "_doneWeeks";

export function ThirtyDayBrief({
  answers,
  brief,
  setBrief,
  archetype,
}: {
  answers: DiagnosticAnswers;
  brief: BriefShape | null;
  setBrief: (b: BriefShape | null) => void;
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
          kind: "thirty-day",
          answers,
          archetype: { id: archetype.id, label: archetype.label, tag: archetype.tag },
        }),
      });
      if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(error || "Request failed");
      }
      const data = (await res.json()) as Omit<BriefShape, "generatedFor" | "_doneTalk" | "_doneApps" | "_doneShip" | "_doneWeeks">;
      setBrief({
        ...data,
        generatedFor: archetype.id,
        _doneTalk: [],
        _doneApps: [],
        _doneShip: [],
        _doneWeeks: [],
      });
    } catch {
      window.alert("M had trouble drafting your brief. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggle = (key: ToggleKey, idx: number) => {
    if (!brief) return;
    const arr = brief[key] || [];
    const next = arr.includes(idx) ? arr.filter((i) => i !== idx) : [...arr, idx];
    setBrief({ ...brief, [key]: next });
  };

  const stale = !!brief && !!archetype && brief.generatedFor !== archetype.id;
  void answers;

  return (
    <div>
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
          <Kicker accent>Your next 30 days</Kicker>
          <div className="h-serif" style={{ fontSize: 32, fontWeight: 500, marginTop: 12, lineHeight: 1.2 }}>
            One first move.
          </div>
          <div style={{ fontSize: 13, color: "var(--color-muted)", marginTop: 8, maxWidth: 540 }}>
            Don&apos;t plan five years. Plan thirty days. Check things off as you go.
          </div>
        </div>
        {!brief && (
          <CTA size="sm" icon="sparkle" onClick={generate}>
            {loading ? "M is drafting…" : "Draft my 30 days"}
          </CTA>
        )}
        {brief && (
          <CTA variant="ghost" size="sm" onClick={generate}>
            {loading ? "Re-drafting…" : stale ? "Re-draft for new archetype" : "Re-draft"}
          </CTA>
        )}
      </div>

      {stale && (
        <div
          style={{
            padding: "10px 14px",
            marginBottom: 20,
            background: "rgba(245,158,11,0.08)",
            border: "1px solid rgba(245,158,11,0.3)",
            fontSize: 12,
            color: "var(--color-amber)",
          }}
        >
          You changed archetype — this brief is from a previous selection. Re-draft for a fresh plan.
        </div>
      )}

      {!brief && !loading && (
        <div
          className="glass"
          style={{
            padding: 40,
            textAlign: "center",
            color: "var(--color-muted)",
            fontSize: 14,
            lineHeight: 1.6,
          }}
        >
          One artifact to ship. Five people to talk to. Two applications. Four weekly check-ins. That&apos;s it.
        </div>
      )}

      {loading && <div className="glass shimmer" style={{ padding: 60, height: 320 }} />}

      {brief && !loading && (
        <div>
          <div className="glass" style={{ padding: 28, marginBottom: 16, borderColor: "rgba(16,185,129,0.3)" }}>
            <div className="uc" style={{ fontSize: 10, color: "var(--color-accent)", letterSpacing: "0.14em" }}>
              North star · 30 days from now
            </div>
            <div
              className="h-serif"
              style={{ fontSize: 24, fontStyle: "italic", fontWeight: 500, lineHeight: 1.3, marginTop: 12 }}
            >
              &quot;{brief.north_star}&quot;
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16, marginBottom: 16 }}>
            <div className="glass" style={{ padding: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span className="uc" style={{ fontSize: 10, color: "var(--color-muted)" }}>
                  Ship one thing
                </span>
                <Icon name="bolt" size={14} />
              </div>
              <div className="h-serif" style={{ fontSize: 22, fontWeight: 600, lineHeight: 1.2, marginBottom: 6 }}>
                {brief.ship_one_thing?.title}
              </div>
              <div style={{ fontSize: 12, color: "var(--color-muted)", marginBottom: 16, lineHeight: 1.55 }}>
                {brief.ship_one_thing?.why}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {(brief.ship_one_thing?.first_three_steps || []).map((s, i) => (
                  <CheckRow
                    key={i}
                    text={s}
                    done={(brief._doneShip || []).includes(i)}
                    onToggle={() => toggle("_doneShip", i)}
                  />
                ))}
              </div>
            </div>

            <div className="glass" style={{ padding: 24 }}>
              <div className="uc" style={{ fontSize: 10, color: "var(--color-muted)", marginBottom: 14 }}>
                Two applications · in flight
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {(brief.two_applications || []).map((a, i) => {
                  const done = (brief._doneApps || []).includes(i);
                  return (
                    <button
                      key={i}
                      onClick={() => toggle("_doneApps", i)}
                      style={{
                        textAlign: "left",
                        padding: 12,
                        background: done ? "rgba(16,185,129,0.06)" : "rgba(255,255,255,0.02)",
                        border: "1px solid " + (done ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.06)"),
                        cursor: "pointer",
                        fontFamily: "inherit",
                        color: "inherit",
                        opacity: done ? 0.6 : 1,
                      }}
                    >
                      <div
                        style={{ fontSize: 13, fontWeight: 600, textDecoration: done ? "line-through" : "none" }}
                      >
                        {a.target}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--color-muted)", marginTop: 4 }}>{a.where}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="glass" style={{ padding: 24, marginBottom: 16 }}>
            <div className="uc" style={{ fontSize: 10, color: "var(--color-muted)", marginBottom: 14 }}>
              Talk to five · this month
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
              {(brief.talk_to_five || []).map((p, i) => {
                const done = (brief._doneTalk || []).includes(i);
                return (
                  <button
                    key={i}
                    onClick={() => toggle("_doneTalk", i)}
                    style={{
                      textAlign: "left",
                      padding: 14,
                      background: done ? "rgba(16,185,129,0.06)" : "rgba(255,255,255,0.02)",
                      border: "1px solid " + (done ? "rgba(16,185,129,0.3)" : "rgba(255,255,255,0.06)"),
                      cursor: "pointer",
                      fontFamily: "inherit",
                      color: "inherit",
                      opacity: done ? 0.55 : 1,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <div
                        style={{
                          width: 16,
                          height: 16,
                          marginTop: 1,
                          flexShrink: 0,
                          border: "1.5px solid " + (done ? "var(--color-accent)" : "var(--color-muted)"),
                          background: done ? "var(--color-accent)" : "transparent",
                          display: "grid",
                          placeItems: "center",
                          color: "var(--color-bg)",
                        }}
                      >
                        {done && <Icon name="check" size={10} stroke={3} />}
                      </div>
                      <div>
                        <div
                          style={{ fontSize: 13, fontWeight: 600, textDecoration: done ? "line-through" : "none" }}
                        >
                          {p.who}
                        </div>
                        <div style={{ fontSize: 11, color: "var(--color-muted)", marginTop: 4, lineHeight: 1.5 }}>
                          {p.how}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="glass" style={{ padding: 24 }}>
            <div className="uc" style={{ fontSize: 10, color: "var(--color-muted)", marginBottom: 14 }}>
              Weekly micro-actions
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0, position: "relative" }}>
              {(brief.weekly_micro || []).map((w, i) => {
                const done = (brief._doneWeeks || []).includes(i);
                return (
                  <button
                    key={i}
                    onClick={() => toggle("_doneWeeks", i)}
                    style={{
                      padding: "18px 16px",
                      borderRight: i < 3 ? "var(--hairline)" : "none",
                      background: done ? "rgba(16,185,129,0.04)" : "transparent",
                      border: 0,
                      borderRadius: 0,
                      cursor: "pointer",
                      textAlign: "left",
                      fontFamily: "inherit",
                      color: "inherit",
                    }}
                  >
                    <div
                      className="mono"
                      style={{
                        fontSize: 10,
                        color: done ? "var(--color-accent)" : "var(--color-muted)",
                        marginBottom: 8,
                      }}
                    >
                      Week {i + 1}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        lineHeight: 1.45,
                        textDecoration: done ? "line-through" : "none",
                        opacity: done ? 0.6 : 1,
                      }}
                    >
                      {w}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
