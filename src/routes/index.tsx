import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { Hero } from "@/components/Hero";
import { Stats } from "@/components/Stats";
import { PainScenarios } from "@/components/PainScenarios";
import { Curriculum } from "@/components/Curriculum";
import { HowItWorks } from "@/components/HowItWorks";
import { Assessment } from "@/components/Assessment";
import { Waitlist } from "@/components/Waitlist";
import { FAQ } from "@/components/FAQ";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { FloatingChat } from "@/components/FloatingChat";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title:
          "RuangRasa Siap Nikah · Coach AI untuk Persiapan Komunikasi Sebelum Menikah",
      },
      {
        name: "description",
        content:
          "Bukan soal menemukan orang yang tepat, tapi jadi pasangan yang tepat. Coach AI yang bantu kamu membangun keterampilan komunikasi & emosional sebelum masalah datang.",
      },
      {
        property: "og:title",
        content: "RuangRasa Siap Nikah · Bersiap sebelum hari H",
      },
      {
        property: "og:description",
        content:
          "Assessment gratis 7 menit + 5 modul harian untuk komunikasi, konflik, ekspektasi, emosi, dan kebiasaan hubungan sehat.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="relative bg-cream text-ink">
      <SiteNav />
      <Hero />
      <Stats />
      <PainScenarios />
      <Curriculum />
      <HowItWorks />
      <Assessment />
      <CTA />
      <Waitlist />
      <FAQ />
      <Footer />
      <FloatingChat />
    </main>
  );
}
