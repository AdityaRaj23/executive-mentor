import { Hero } from "@/components/landing/Hero";
import { MetricsRibbon } from "@/components/landing/MetricsRibbon";
import { FeatureGrid } from "@/components/landing/FeatureGrid";
import { PullQuote } from "@/components/landing/PullQuote";
import { ClosingCTA } from "@/components/landing/ClosingCTA";

export default function LandingPage() {
  return (
    <div>
      <Hero />
      <MetricsRibbon />
      <FeatureGrid />
      <PullQuote />
      <ClosingCTA />
    </div>
  );
}
