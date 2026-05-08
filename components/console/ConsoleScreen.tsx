"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { buildWelcome } from "@/lib/voice";
import { load, save, remove } from "@/lib/storage";
import { SEED_DOSSIER, buildDossier, type FirstYearSnapshot } from "@/data/dossier";
import { ARCHETYPES } from "@/data/archetypes";
import type {
  Archetype,
  DiagnosticAnswers,
  Dossier,
  Message,
  TalentStack,
  ThirtyDayBrief,
} from "@/types";
import { ChatBubble } from "./ChatBubble";
import { ChatHeader } from "./ChatHeader";
import { ChatInput } from "./ChatInput";
import { Dossier as DossierPanel } from "./Dossier";
import { Suggestions } from "./Suggestions";
import { ThinkingIndicator } from "./ThinkingIndicator";

const STORE_KEY = "em.console.v1";
const FIRSTYEAR_KEY = "em.firstyear.v1";

interface PersistedState {
  messages: Message[];
  dossier: Dossier;
}

interface PersistedFirstYear {
  stage?: "diagnostic" | "ranking" | "result";
  answers?: DiagnosticAnswers;
  topMatches?: Archetype[] | null;
  selectedArch?: string | null;
  stack?: TalentStack | null;
  brief?: ThirtyDayBrief | null;
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

function snapshotFromFirstYear(fy: PersistedFirstYear): FirstYearSnapshot {
  const archetype =
    ARCHETYPES.find((a) => a.id === fy.selectedArch) ?? fy.topMatches?.[0] ?? undefined;
  return {
    archetype,
    answers: fy.answers,
    stack: fy.stack ?? null,
    brief: fy.brief ?? null,
  };
}

function AdminViewOverlay() {
  return (
    <div
      style={{
        position: "absolute",
        top: 78,
        right: 24,
        padding: "8px 12px",
        background: "rgba(245,158,11,0.08)",
        border: "1px solid rgba(245,158,11,0.3)",
        fontSize: 11,
        color: "var(--color-amber)",
        fontFamily: "var(--font-mono)",
        maxWidth: 320,
        lineHeight: 1.5,
        zIndex: 5,
      }}
    >
      Your admin sees themes &amp; readiness — never transcripts. Below is exactly their view.
    </div>
  );
}

function GateScreen() {
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
      Routing you to your diagnostic…
    </div>
  );
}

export default function ConsoleScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoaded: userLoaded } = useUser();

  const [hydrated, setHydrated] = useState(false);
  const [gated, setGated] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [dossier, setDossier] = useState<Dossier>(SEED_DOSSIER);
  const [firstYear, setFirstYear] = useState<FirstYearSnapshot | null>(null);
  const [adminView, setAdminView] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const seedConsumedRef = useRef(false);

  // Hydrate: gate on first-year, then build dossier + welcome
  useEffect(() => {
    if (!userLoaded) return;

    const fy = readFirstYear();
    if (!isFirstYearComplete(fy)) {
      setGated(true);
      router.replace("/first-year");
      return;
    }

    const snap = snapshotFromFirstYear(fy!);
    setFirstYear(snap);

    const stored = load<Partial<PersistedState>>(STORE_KEY, {});
    const firstName = user?.firstName ?? null;
    const fullName = user?.fullName ?? null;
    const baseDossier = buildDossier({ firstName, fullName, firstYear: snap });
    const nextDossier: Dossier = {
      ...baseDossier,
      // preserve any per-skill confidence drift from prior session
      skills: baseDossier.skills.map((s) => {
        const prior = stored.dossier?.skills?.find((p) => p.label === s.label);
        return prior ? { ...s, conf: prior.conf } : s;
      }),
      signals: stored.dossier?.signals?.length
        ? Array.from(new Set([...stored.dossier.signals, ...baseDossier.signals])).slice(0, 5)
        : baseDossier.signals,
    };

    const priorMessages = stored.messages ?? [];
    const isReturning = priorMessages.some((m) => m.role === "user");
    const welcome = buildWelcome({
      firstName: firstName ?? undefined,
      archetypeLabel: snap.archetype?.label,
      archetypeTag: snap.archetype?.tag,
      topStrength: snap.stack?.strengths?.[0]?.label,
      isReturning,
    });

    const initialMessages: Message[] = priorMessages.length
      ? priorMessages
      : [{ role: "ai", header: welcome.header, body: welcome.body }];

    // If returning user has prior messages, refresh just the leading AI welcome
    // so the greeting reflects their current state on each visit.
    if (priorMessages.length && priorMessages[0]?.role === "ai") {
      initialMessages[0] = { role: "ai", header: welcome.header, body: welcome.body };
    }

    setMessages(initialMessages);
    setDossier(nextDossier);
    setHydrated(true);
  }, [userLoaded, user, router]);

  useEffect(() => {
    if (!hydrated) return;
    save<PersistedState>(STORE_KEY, { messages, dossier });
  }, [hydrated, messages, dossier]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  const resetSession = () => {
    if (!window.confirm("Clear this conversation? Your diagnostic stays.")) return;
    remove(STORE_KEY);
    if (!firstYear) return;
    const firstName = user?.firstName ?? null;
    const fullName = user?.fullName ?? null;
    const fresh = buildDossier({ firstName, fullName, firstYear });
    const welcome = buildWelcome({
      firstName: firstName ?? undefined,
      archetypeLabel: firstYear.archetype?.label,
      archetypeTag: firstYear.archetype?.tag,
      topStrength: firstYear.stack?.strengths?.[0]?.label,
      isReturning: false,
    });
    setMessages([{ role: "ai", header: welcome.header, body: welcome.body }]);
    setDossier(fresh);
  };

  const firstYearForApi = useMemo(() => {
    if (!firstYear?.archetype) return undefined;
    return {
      archetype: { label: firstYear.archetype.label, tag: firstYear.archetype.tag },
      answers: firstYear.answers,
      stackHeadline: firstYear.stack?.headline,
    };
  }, [firstYear]);

  const send = async (textOverride?: string) => {
    const text = textOverride ?? input.trim();
    if (!text || loading) return;
    setInput("");
    const userMsg: Message = { role: "user", body: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setLoading(true);

    try {
      const res = await fetch("/api/console/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: next, dossier, firstYear: firstYearForApi }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || `Request failed (${res.status})`);
      }
      const { text: reply } = (await res.json()) as { text: string };

      let prose = reply || "";
      let deltas: { label: string; delta: number }[] = [];
      let newSignal: string | null = null;
      const m = prose.match(/<<<DOSSIER>>>(.*?)<<<END>>>/s);
      if (m) {
        prose = prose.replace(m[0], "").trim();
        try {
          const parsed = JSON.parse(m[1].trim());
          deltas = parsed.skill_deltas || [];
          newSignal = parsed.new_signal && parsed.new_signal !== "null" ? parsed.new_signal : null;
        } catch {
          // ignore parse errors
        }
      }

      const lines = prose.trim().split(/\n\s*\n/);
      const header = lines[0]?.replace(/^\s*[#>*\-\d.]+\s*/, "").trim() || "Continuing.";
      const body = (lines.slice(1).join("\n\n") || lines[0] || "").trim();

      setMessages((prev) => [...prev, { role: "ai", header, body }]);
      setDossier((d) => {
        const newSkills = d.skills.map((s) => {
          const hit = deltas.find((x) => x.label?.toLowerCase() === s.label.toLowerCase());
          return hit ? { ...s, conf: Math.max(0, Math.min(100, s.conf + (hit.delta | 0))) } : s;
        });
        const signals = newSignal ? [newSignal, ...d.signals].slice(0, 5) : d.signals;
        return { ...d, skills: newSkills, signals };
      });
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "ai", header: "Connection issue.", body: "I lost the thread for a moment. Try again — I have your context." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hydrated || seedConsumedRef.current) return;
    const seed = searchParams.get("seed");
    if (!seed) return;
    seedConsumedRef.current = true;
    router.replace("/console");
    void send(seed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, searchParams, router]);

  if (gated || !hydrated) {
    return <GateScreen />;
  }

  return (
    <div
      style={{
        maxWidth: 1440,
        margin: "0 auto",
        padding: "24px 32px",
        display: "grid",
        gridTemplateColumns: "1fr 380px",
        gap: 24,
        height: "calc(100vh - 70px)",
      }}
    >
      <div className="glass" style={{ display: "flex", flexDirection: "column", minHeight: 0, position: "relative" }}>
        <ChatHeader adminView={adminView} setAdminView={setAdminView} onReset={resetSession} />
        <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "32px 40px", minHeight: 0 }}>
          {messages.length === 1 && <Suggestions onPick={(p) => send(p.title + ". " + p.body)} />}
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {messages.map((msg, i) => (
              <ChatBubble key={i} {...msg} adminView={adminView} />
            ))}
            {loading && <ThinkingIndicator />}
          </div>
        </div>
        <ChatInput value={input} onChange={setInput} onSend={() => send()} disabled={loading} adminView={adminView} />
        {adminView && <AdminViewOverlay />}
      </div>

      <DossierPanel dossier={dossier} adminView={adminView} />
    </div>
  );
}
