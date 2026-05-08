"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { CTA } from "@/components/shared/CTA";
import { Kicker } from "@/components/shared/Kicker";
import { SEED_MILESTONES } from "@/data/milestones";
import { ARCHETYPES } from "@/data/archetypes";
import { load, save } from "@/lib/storage";
import type {
  Archetype,
  Branch,
  DiagnosticAnswers,
  Milestone,
  TalentStack,
  ThirtyDayBrief,
} from "@/types";
import { DetailPanel } from "./DetailPanel";
import { RePlanModal } from "./RePlanModal";
import { Timeline } from "./Timeline";

const STORE_KEY = "em.roadmap.v1";
const FIRSTYEAR_KEY = "em.firstyear.v1";

interface PersistedState {
  selected: number;
  milestones: Milestone[];
  branch: Branch | null;
  signature?: string;
}

interface PersistedFirstYear {
  stage?: "diagnostic" | "ranking" | "result";
  answers?: DiagnosticAnswers;
  topMatches?: Archetype[] | null;
  selectedArch?: string | null;
  stack?: TalentStack | null;
  brief?: ThirtyDayBrief | null;
}

interface FirstYearSnapshot {
  archetype: Archetype;
  answers?: DiagnosticAnswers;
  stack: TalentStack | null;
  brief: ThirtyDayBrief | null;
}

function readFirstYear(): PersistedFirstYear | null {
  if (typeof window === "undefined") return null;
  return load<PersistedFirstYear>(FIRSTYEAR_KEY, {});
}

function isFirstYearComplete(fy: PersistedFirstYear | null): boolean {
  return Boolean(
    fy &&
      fy.stage === "result" &&
      fy.selectedArch &&
      Array.isArray(fy.topMatches) &&
      fy.topMatches.length > 0,
  );
}

function snapshotFromFirstYear(fy: PersistedFirstYear): FirstYearSnapshot | null {
  const archetype =
    ARCHETYPES.find((a) => a.id === fy.selectedArch) ?? fy.topMatches?.[0] ?? null;
  if (!archetype) return null;
  return {
    archetype,
    answers: fy.answers,
    stack: fy.stack ?? null,
    brief: fy.brief ?? null,
  };
}

function signatureOf(snap: FirstYearSnapshot): string {
  return [snap.archetype.id, snap.stack?.headline ?? "", snap.brief?.north_star ?? ""].join("|");
}

function GateScreen({ message }: { message: string }) {
  return (
    <div
      style={{
        maxWidth: 720,
        margin: "0 auto",
        padding: "120px 32px",
        textAlign: "center",
        color: "var(--color-muted)",
        fontFamily: "var(--font-mono)",
        fontSize: 13,
        letterSpacing: "0.02em",
      }}
    >
      {message}
    </div>
  );
}

export default function RoadmapScreen() {
  const router = useRouter();
  const { user, isLoaded: userLoaded } = useUser();

  const [hydrated, setHydrated] = useState(false);
  const [gated, setGated] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  const [firstYear, setFirstYear] = useState<FirstYearSnapshot | null>(null);
  const [selected, setSelected] = useState<number>(1);
  const [milestones, setMilestones] = useState<Milestone[]>(SEED_MILESTONES);
  const [branch, setBranch] = useState<Branch | null>(null);
  const [showRePlan, setShowRePlan] = useState(false);
  const [replanText, setReplanText] = useState("");
  const [replanning, setReplanning] = useState(false);

  useEffect(() => {
    if (!userLoaded) return;

    const fy = readFirstYear();
    if (!isFirstYearComplete(fy)) {
      setGated(true);
      router.replace("/first-year");
      return;
    }

    const snap = snapshotFromFirstYear(fy!);
    if (!snap) {
      setGated(true);
      router.replace("/first-year");
      return;
    }
    setFirstYear(snap);

    const stored = load<Partial<PersistedState>>(STORE_KEY, {});
    const sig = signatureOf(snap);
    const cacheValid =
      stored.signature === sig &&
      Array.isArray(stored.milestones) &&
      stored.milestones.length > 0;

    if (cacheValid) {
      setMilestones(stored.milestones!);
      if (stored.branch) setBranch(stored.branch);
      const current = stored.milestones!.find((m) => m.status === "current");
      setSelected(stored.selected ?? current?.id ?? stored.milestones![0].id);
      setHydrated(true);
      return;
    }

    // Generate fresh from first-year
    (async () => {
      setGenerating(true);
      setGenerateError(null);
      try {
        const res = await fetch("/api/roadmap/generate", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            action: "generate",
            firstName: user?.firstName ?? null,
            archetype: { id: snap.archetype.id, label: snap.archetype.label, tag: snap.archetype.tag },
            answers: snap.answers,
            stack: snap.stack,
            brief: snap.brief,
          }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err?.error || `Request failed (${res.status})`);
        }
        const { milestones: ms } = (await res.json()) as { milestones: Milestone[] };
        setMilestones(ms);
        const current = ms.find((m) => m.status === "current");
        setSelected(current?.id ?? ms[0]?.id ?? 1);
        save<PersistedState>(STORE_KEY, {
          selected: current?.id ?? ms[0]?.id ?? 1,
          milestones: ms,
          branch: null,
          signature: sig,
        });
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Couldn't generate roadmap.";
        setGenerateError(msg);
      } finally {
        setGenerating(false);
        setHydrated(true);
      }
    })();
  }, [userLoaded, user, router]);

  useEffect(() => {
    if (!hydrated || !firstYear) return;
    save<PersistedState>(STORE_KEY, {
      selected,
      milestones,
      branch,
      signature: signatureOf(firstYear),
    });
  }, [hydrated, firstYear, selected, milestones, branch]);

  const current = [...milestones, ...(branch?.milestones || [])].find((m) => m.id === selected);

  const handleDiscuss = (m: Milestone) => {
    const opener =
      `About my ${m.year} ${m.quarter} milestone "${m.title}" — ${m.body} ` +
      `Help me make this concrete: what's the first move, and what could derail it?`;
    router.push(`/console?seed=${encodeURIComponent(opener)}`);
  };

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
    if (!replanText.trim() || replanning || !firstYear) return;
    setReplanning(true);
    try {
      const futureMs = milestones.filter((m) => m.status === "future");
      const locked = milestones
        .filter((m) => m.status !== "future")
        .map((m) => ({ year: m.year, quarter: m.quarter, title: m.title, body: m.body }));
      const res = await fetch("/api/roadmap/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          action: "replan",
          archetype: {
            id: firstYear.archetype.id,
            label: firstYear.archetype.label,
            tag: firstYear.archetype.tag,
          },
          answers: firstYear.answers,
          scenario: replanText,
          locked,
          futureCount: futureMs.length,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || `Request failed (${res.status})`);
      }
      const { milestones: alts } = (await res.json()) as { milestones: Milestone[] };
      // Pair alt milestones to the originals so the ghost timeline aligns
      const altMilestones: Milestone[] = futureMs.map((orig, i) => {
        const alt = alts[i];
        if (!alt) return { ...orig, status: "alt", id: orig.id + 100 };
        return {
          ...orig,
          id: orig.id + 100,
          year: alt.year || orig.year,
          quarter: alt.quarter || orig.quarter,
          title: alt.title || orig.title,
          body: alt.body || orig.body,
          skills: alt.skills?.length ? alt.skills : orig.skills,
          status: "alt",
        };
      });
      setBranch({ label: replanText, milestones: altMilestones });
      setShowRePlan(false);
      setReplanText("");
    } catch {
      window.alert("M couldn't re-plan right now. Try again.");
    } finally {
      setReplanning(false);
    }
  };

  if (gated) return <GateScreen message="Routing you to your diagnostic…" />;
  if (!hydrated && generating) return <GateScreen message="M is plotting your trajectory…" />;
  if (!hydrated) return <GateScreen message="Loading…" />;
  if (generateError && milestones.length === 0) {
    return <GateScreen message={`Couldn't generate roadmap: ${generateError}`} />;
  }

  const memberName = user?.firstName?.trim() || user?.fullName?.trim() || "Your";
  const kicker = `${memberName} · Career roadmap`;

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
          <Kicker accent>{kicker}</Kicker>
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
        <DetailPanel milestone={current} onToggleTask={toggleTask} onDiscuss={handleDiscuss} />
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
