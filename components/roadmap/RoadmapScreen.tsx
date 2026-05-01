"use client";
import { useEffect, useState } from "react";
import { CTA } from "@/components/shared/CTA";
import { Kicker } from "@/components/shared/Kicker";
import { SEED_MILESTONES } from "@/data/milestones";
import { claude } from "@/lib/mockAI";
import { load, save } from "@/lib/storage";
import type { Branch, Milestone } from "@/types";
import { DetailPanel } from "./DetailPanel";
import { RePlanModal } from "./RePlanModal";
import { Timeline } from "./Timeline";

const STORE_KEY = "em.roadmap.v1";

interface PersistedState {
  selected: number;
  milestones: Milestone[];
  branch: Branch | null;
}

export default function RoadmapScreen() {
  const [hydrated, setHydrated] = useState(false);
  const [selected, setSelected] = useState<number>(4);
  const [milestones, setMilestones] = useState<Milestone[]>(SEED_MILESTONES);
  const [branch, setBranch] = useState<Branch | null>(null);
  const [showRePlan, setShowRePlan] = useState(false);
  const [replanText, setReplanText] = useState("");
  const [replanning, setReplanning] = useState(false);

  useEffect(() => {
    const stored = load<Partial<PersistedState>>(STORE_KEY, {});
    if (stored.selected) setSelected(stored.selected);
    if (stored.milestones?.length) setMilestones(stored.milestones);
    if (stored.branch) setBranch(stored.branch);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    save(STORE_KEY, { selected, milestones, branch });
  }, [hydrated, selected, milestones, branch]);

  const current = [...milestones, ...(branch?.milestones || [])].find((m) => m.id === selected);

  const toggleTask = (idx: number) => {
    setMilestones((ms) =>
      ms.map((m) => {
        if (m.id !== selected || !m.tasks) return m;
        const done = m._doneTasks || [];
        return {
          ...m,
          _doneTasks: done.includes(idx) ? done.filter((i) => i !== idx) : [...done, idx],
        };
      })
    );
  };

  const replan = async () => {
    if (!replanText.trim() || replanning) return;
    setReplanning(true);
    try {
      const futureMs = milestones.filter((m) => m.status === "future");
      const sys = `You are a career strategist re-planning a path. The user's locked past milestones (do NOT change): ${milestones
        .filter((m) => m.status !== "future")
        .map((m) => `${m.year} ${m.quarter}: ${m.title}`)
        .join("; ")}.

Their current future plan: ${futureMs.map((m) => `${m.year} ${m.quarter}: ${m.title} — ${m.body}`).join("\n")}.

What-if scenario: "${replanText}"

Generate ${futureMs.length} alt-trajectory future milestones. Output ONLY a JSON array, no prose, no markdown fences. Schema:
[{"year":"YYYY","quarter":"QN","title":"<short>","body":"<1-2 sentences>","skills":["s1","s2"]}]`;
      const reply = await claude.complete({ messages: [{ role: "user", content: sys }] });
      const m = reply.match(/\[[\s\S]*\]/);
      if (m) {
        const alts: { year: string; quarter: string; title: string; body: string; skills: string[] }[] = JSON.parse(m[0]);
        const altMilestones: Milestone[] = futureMs.map((orig, i) => ({
          ...orig,
          id: orig.id + 100,
          year: alts[i]?.year || orig.year,
          quarter: alts[i]?.quarter || orig.quarter,
          title: alts[i]?.title || orig.title,
          body: alts[i]?.body || orig.body,
          skills: alts[i]?.skills || orig.skills,
          status: "alt",
        }));
        setBranch({ label: replanText, milestones: altMilestones });
        setShowRePlan(false);
        setReplanText("");
      }
    } catch {
      window.alert("M couldn't re-plan right now. Try again.");
    } finally {
      setReplanning(false);
    }
  };

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 32px 80px" }}>
      <header
        style={{
          marginBottom: 40,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: 32,
          flexWrap: "wrap",
        }}
      >
        <div style={{ maxWidth: 640, minWidth: 0, flex: "1 1 auto" }}>
          <Kicker accent>Eliot Cho · Career roadmap</Kicker>
          <h1
            className="h-serif"
            style={{ fontSize: "clamp(36px, 5vw, 56px)", lineHeight: 1.05, margin: "20px 0 14px", fontWeight: 500 }}
          >
            Seven years, <em>one trajectory.</em>
          </h1>
          <p style={{ fontSize: 15, color: "var(--color-muted)", maxWidth: 560, margin: 0 }}>
            Click any milestone to expand. Ask M to re-plan around a shock — layoff, pivot, leave — and see an alt-trajectory ghost the timeline.
          </p>
        </div>
        <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
          {branch && (
            <CTA variant="ghost" size="sm" onClick={() => setBranch(null)}>
              Clear what-if
            </CTA>
          )}
          <CTA variant="accent" size="sm" icon="sparkle" onClick={() => setShowRePlan(true)}>
            Re-plan with M
          </CTA>
        </div>
      </header>

      {branch && (
        <div
          className="glass"
          style={{
            padding: "12px 18px",
            marginBottom: 24,
            background: "rgba(14,165,233,0.06)",
            border: "1px solid rgba(14,165,233,0.3)",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--color-sapphire)" }} />
          <div style={{ flex: 1 }}>
            <div className="uc" style={{ fontSize: 10, color: "var(--color-sapphire)" }}>
              What-if scenario
            </div>
            <div className="h-serif" style={{ fontSize: 16, fontStyle: "italic", marginTop: 2 }}>
              &quot;{branch.label}&quot;
            </div>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 40, alignItems: "flex-start" }}>
        <Timeline milestones={milestones} branch={branch} selected={selected} onSelect={setSelected} />
        <DetailPanel milestone={current} onToggleTask={toggleTask} />
      </div>

      {showRePlan && (
        <RePlanModal
          text={replanText}
          setText={setReplanText}
          onClose={() => setShowRePlan(false)}
          onSubmit={replan}
          loading={replanning}
        />
      )}
    </div>
  );
}
