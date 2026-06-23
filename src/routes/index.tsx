import { useRef } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ExternalLink } from "lucide-react";
import { ChatPanel, type ChatPanelHandle } from "@/components/ChatPanel";
import logo from "@/assets/sn-logo.png";
import {
  SITE_URL,
  OG_IMAGE_URL,
  PARENT_SITE_URL,
  buildOrganizationLd,
  buildWebSiteLd,
} from "@/lib/seo";

const PAGE_TITLE =
  "Coach RuangRasa Siap Nikah · Mulai Percakapan tentang Persiapan Pernikahan";
const PAGE_DESCRIPTION =
  "Mulai sesi gratis bersama Coach AI RuangRasa Siap Nikah. Tanya apa pun soal komunikasi pasangan, konflik, ekspektasi, dan persiapan emosional sebelum hari H.";

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
    ],
  }),
  component: ChatHome,
});

function ChatHome() {
  const chatRef = useRef<ChatPanelHandle>(null);
  const reportBeforeLeaving = () => chatRef.current?.reportSessionIfNeeded();

  return (
    <div className="flex h-dvh w-screen flex-col bg-cream">
      {/* Top navigation */}
      <header className="flex shrink-0 items-center justify-between border-b border-ink/10 bg-paper px-4 py-3 sm:px-6 md:px-8">
        <Link
          to="/"
          className="flex items-center gap-2.5 font-display text-lg text-ink sm:text-xl md:text-2xl"
          style={{ fontFamily: "'DM Serif Display', serif" }}
        >
          <img
            src={logo}
            alt="Logo RuangRasa Siap Nikah"
            className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10"
          />
          <span className="hidden sm:inline">
            RuangRasa<span className="text-terracotta">.</span>
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/explore"
            onClick={reportBeforeLeaving}
            className="inline-flex items-center gap-1.5 rounded-full border border-terracotta/30 bg-cream px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-terracotta transition-colors hover:border-terracotta hover:bg-amber-soft/40 sm:px-4 sm:py-2 sm:text-xs"
          >
            <span className="hidden sm:inline">Jelajahi Siap Nikah</span>
            <span className="sm:hidden">Jelajahi</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <a
            href={PARENT_SITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={reportBeforeLeaving}
            className="inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-cream transition-transform hover:scale-[1.02] sm:px-4 sm:py-2 sm:text-xs"
          >
            <span className="hidden md:inline">Eksplor RuangRasa Lainnya</span>
            <span className="hidden sm:inline md:hidden">Eksplor RuangRasa</span>
            <span className="sm:hidden">RuangRasa</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </header>

      {/* Chat takes remaining viewport */}
      <div className="flex-1 overflow-hidden">
        <ChatPanel ref={chatRef} className="mx-auto max-w-2xl border-x border-ink/10" />
      </div>
    </div>
  );
}
