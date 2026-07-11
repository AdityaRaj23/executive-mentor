"use client";
import dynamic from "next/dynamic";

const AssessmentScreen = dynamic(() => import("@/components/assessment/AssessmentScreen"), {
  ssr: false,
  loading: () => (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "80px 32px" }}>
      <div className="glass shimmer" style={{ height: 160 }} />
    </div>
  ),
});

export default function AssessmentPage() {
  return <AssessmentScreen />;
}
