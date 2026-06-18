export const SITE_URL = "https://siapnikah.ruangrasa.co";
export const SITE_NAME = "RuangRasa Siap Nikah";
export const ORG_NAME = "RuangRasa";
export const SITE_LOCALE = "id_ID";
export const SITE_LANG = "id";

export const DEFAULT_TITLE =
  "RuangRasa Siap Nikah · Coach AI untuk Persiapan Komunikasi Sebelum Menikah";

export const DEFAULT_DESCRIPTION =
  "Bukan soal menemukan orang yang tepat, tapi jadi pasangan yang tepat. Coach AI berbahasa Indonesia yang bantu kamu membangun keterampilan komunikasi & emosional sebelum hari H.";

export const DEFAULT_KEYWORDS =
  "persiapan pernikahan, coach AI pernikahan, komunikasi pasangan, konseling pra nikah, hubungan sehat, RuangRasa, siap nikah, pre-marital coach, persiapan menikah Indonesia";

export const OG_IMAGE_PATH = "/og-image.jpg";
export const OG_IMAGE_URL = `${SITE_URL}${OG_IMAGE_PATH}`;
export const OG_IMAGE_WIDTH = "1200";
export const OG_IMAGE_HEIGHT = "630";

export function buildOrganizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: ORG_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.png`,
    sameAs: [
      "https://pasangan.ruangrasa.co",
      "https://teman.ruangrasa.co",
    ],
  };
}

export function buildWebSiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: SITE_LANG,
    publisher: { "@type": "Organization", name: ORG_NAME },
  };
}

export function buildFaqLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
