import { Hero } from "@/components/landing/Hero";
import { MetricsRibbon } from "@/components/landing/MetricsRibbon";
import { FeatureGrid } from "@/components/landing/FeatureGrid";
import { PullQuote } from "@/components/landing/PullQuote";
import { ClosingCTA } from "@/components/landing/ClosingCTA";
import { InvestorTicker } from "@/components/landing/InvestorTicker";

export default function LandingPage() {
  return (
    <div style={{ paddingBottom: 80 }}>
      <Hero />
      <MetricsRibbon />
      <FeatureGrid />
      <PullQuote />
      <ClosingCTA />
      <InvestorTicker />
    </div>
  );
}
