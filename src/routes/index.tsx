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
import {
  SITE_URL,
  OG_IMAGE_URL,
  buildOrganizationLd,
  buildWebSiteLd,
  buildFaqLd,
} from "@/lib/seo";
import { FAQS } from "@/lib/faqs";

const PAGE_TITLE =
  "RuangRasa Siap Nikah · Coach AI untuk Persiapan Komunikasi Sebelum Menikah";
const PAGE_DESCRIPTION =
  "Assessment gratis 7 menit + 5 modul harian untuk komunikasi, konflik, ekspektasi, emosi, dan kebiasaan hubungan sehat. Bukan soal menemukan orang yang tepat, tapi jadi pasangan yang tepat.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: PAGE_TITLE },
      { name: "description", content: PAGE_DESCRIPTION },
      { property: "og:url", content: SITE_URL },
      { property: "og:title", content: PAGE_TITLE },
      { property: "og:description", content: PAGE_DESCRIPTION },
      { property: "og:image", content: OG_IMAGE_URL },
      { name: "twitter:title", content: PAGE_TITLE },
      { name: "twitter:description", content: PAGE_DESCRIPTION },
      { name: "twitter:image", content: OG_IMAGE_URL },
    ],
    links: [{ rel: "canonical", href: SITE_URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(buildOrganizationLd()),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(buildWebSiteLd()),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(buildFaqLd(FAQS)),
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
