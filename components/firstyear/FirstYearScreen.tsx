"use client";
import { useEffect, useState } from "react";
import { CTA } from "@/components/shared/CTA";
import { Kicker } from "@/components/shared/Kicker";
import { ARCHETYPES, rankArchetypes } from "@/data/archetypes";
import { load, remove, save } from "@/lib/storage";
import type {
  Archetype,
  ArchetypeFit,
  DiagnosticAnswers,
  TalentStack as TalentStackShape,
  ThirtyDayBrief as BriefShape,
} from "@/types";
import { ArchetypeDeepDive } from "./ArchetypeDeepDive";
import { Cartography } from "./Cartography";
import { Diagnostic } from "./Diagnostic";
import { TalentStack } from "./TalentStack";
import { ThirtyDayBrief } from "./ThirtyDayBrief";

const STORE_KEY = "em.firstyear.v1";

type Stage = "diagnostic" | "ranking" | "result";

interface PersistedState {
  stage: Stage;
  answers: DiagnosticAnswers;
  topMatches: Archetype[] | null;
  fitNotes: Record<string, string> | null;
  personalNotes: Record<string, string> | null;
  selectedArch: string | null;
  stack: TalentStackShape | null;
  brief: BriefShape | null;
}

function ResultHeader({ onReset }: { onReset: () => void }) {
  return (
    <header
      style={{
        marginBottom: 48,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        gap: 24,
        flexWrap: "wrap",
      }}
    >
      <div style={{ minWidth: 0, flex: "1 1 auto", maxWidth: 720 }}>
        <Kicker accent>First Year · personalized for you</Kicker>
        <h1
          className="h-serif"
          style={{ fontSize: "clamp(36px, 5vw, 56px)", lineHeight: 1.05, margin: "20px 0 14px", fontWeight: 500 }}
        >
          Six paths, <em>your map.</em>
        </h1>
        <p style={{ fontSize: 15, color: "var(--color-muted)", maxWidth: 560, margin: 0, lineHeight: 1.6 }}>
          You don&apos;t need a five-year plan. You need to know which directions are alive for you, and what to do this month. Click any archetype to drill in.
        </p>
      </div>
      <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
        <CTA variant="ghost" size="sm" onClick={onReset}>
          Re-take diagnostic
        </CTA>
      </div>
    </header>
  );
}

function RankingLoader() {
  return (
    <div
      style={{
        maxWidth: 760,
        margin: "0 auto",
        padding: "60px 32px",
        minHeight: "calc(100vh - 70px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        animation: "fadeIn 0.4s ease",
      }}
    >
      <Kicker accent>M is reading you in</Kicker>
      <div
        className="h-serif"
        style={{
          fontSize: "clamp(28px, 4vw, 40px)",
          lineHeight: 1.2,
          fontWeight: 500,
          fontStyle: "italic",
          marginTop: 18,
          marginBottom: 32,
          letterSpacing: "-0.01em",
        }}
      >
        Mapping your answers against six archetypes…
      </div>
      <div className="glass shimmer" style={{ height: 120 }} />
    </div>
  );
}

export default function FirstYearScreen() {
  const [hydrated, setHydrated] = useState(false);
  const [stage, setStage] = useState<Stage>("diagnostic");
  const [answers, setAnswers] = useState<DiagnosticAnswers>({});
  const [topMatches, setTopMatches] = useState<Archetype[] | null>(null);
  const [fitNotes, setFitNotes] = useState<Record<string, string> | null>(null);
  const [personalNotes, setPersonalNotes] = useState<Record<string, string> | null>(null);
  const [selectedArch, setSelectedArch] = useState<string | null>(null);
  const [stack, setStack] = useState<TalentStackShape | null>(null);
  const [brief, setBrief] = useState<BriefShape | null>(null);

  useEffect(() => {
    const stored = load<Partial<PersistedState>>(STORE_KEY, {});
    if (stored.stage === "diagnostic" || stored.stage === "result") setStage(stored.stage);
    if (stored.answers) setAnswers(stored.answers);
    if (stored.topMatches) setTopMatches(stored.topMatches);
    if (stored.fitNotes) setFitNotes(stored.fitNotes);
    if (stored.personalNotes) setPersonalNotes(stored.personalNotes);
    if (stored.selectedArch) setSelectedArch(stored.selectedArch);
    if (stored.stack) setStack(stored.stack);
    if (stored.brief) setBrief(stored.brief);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (stage === "ranking") return;
    save<PersistedState>(STORE_KEY, {
      stage,
      answers,
      topMatches,
      fitNotes,
      personalNotes,
      selectedArch,
      stack,
      brief,
    });
  }, [hydrated, stage, answers, topMatches, fitNotes, personalNotes, selectedArch, stack, brief]);

  const finishDiagnostic = async (ans: DiagnosticAnswers) => {
    setAnswers(ans);
    setStage("ranking");
    setStack(null);
    setBrief(null);

    let ranked: Archetype[] | null = null;
    let notes: Record<string, string> | null = null;

    try {
      const res = await fetch("/api/firstyear/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "archetype-rank", answers: ans }),
      });
      if (res.ok) {
        const { rankings } = (await res.json()) as { rankings: ArchetypeFit[] };
        const byId = new Map(ARCHETYPES.map((a) => [a.id, a]));
        const ordered = rankings
          .map((r) => byId.get(r.id))
          .filter((a): a is Archetype => Boolean(a));
        if (ordered.length === ARCHETYPES.length) {
          ranked = ordered;
          notes = Object.fromEntries(rankings.map((r) => [r.id, r.why]));
        }
      }
    } catch {
      // fall through to local fallback
    }

    if (!ranked) {
      ranked = rankArchetypes(ans);
    }

    setTopMatches(ranked);
    setFitNotes(notes);
    setSelectedArch(ranked[0].id);
    setStage("result");
  };

  const reset = () => {
    if (!window.confirm("Restart from the diagnostic?")) return;
    remove(STORE_KEY);
    setStage("diagnostic");
    setAnswers({});
    setTopMatches(null);
    setFitNotes(null);
    setPersonalNotes(null);
    setSelectedArch(null);
    setStack(null);
    setBrief(null);
  };

  if (stage === "diagnostic") {
    return <Diagnostic onComplete={finishDiagnostic} />;
  }

  if (stage === "ranking") {
    return <RankingLoader />;
  }

  const archetype = ARCHETYPES.find((a) => a.id === selectedArch);

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 32px 100px" }}>
      <ResultHeader onReset={reset} />
      {topMatches && (
        <Cartography
          matches={topMatches}
          all={ARCHETYPES}
          selected={selectedArch}
          onSelect={setSelectedArch}
          fitNotes={fitNotes}
        />
      )}
      <ArchetypeDeepDive
        archetype={archetype}
        answers={answers}
        personalNotes={personalNotes}
        setPersonalNotes={setPersonalNotes}
      />
      <TalentStack answers={answers} stack={stack} setStack={setStack} archetype={archetype} />
      <ThirtyDayBrief answers={answers} brief={brief} setBrief={setBrief} archetype={archetype} />
    </div>
  );
}
