export type WaitlistPayload = {
  fullName: string;
  whatsapp: string;
  summary?: string;
  sheetName?: "Sheet1" | "siap-nikah";
  source?: string;
};

function buildBody(payload: WaitlistPayload) {
  const secret = import.meta.env.VITE_WEBHOOK_SECRET;
  return {
    secret,
    sheetName: payload.sheetName || "siap-nikah",
    fullName: payload.fullName,
    whatsapp: payload.whatsapp,
    summary: payload.summary || "",
    source: payload.source || "siapnikah.ruangrasa",
    userAgent:
      typeof navigator !== "undefined" ? navigator.userAgent : "",
  };
}

export async function submitWaitlist(payload: WaitlistPayload): Promise<void> {
  const url = import.meta.env.VITE_SHEETS_WEBHOOK_URL;
  const secret = import.meta.env.VITE_WEBHOOK_SECRET;

  if (!url || !secret) {
    throw new Error("Konfigurasi webhook belum lengkap.");
  }

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(buildBody(payload)),
  });

  if (!res.ok) {
    throw new Error(`Webhook error ${res.status}`);
  }

  const data = (await res.json().catch(() => null)) as
    | { ok?: boolean; error?: string }
    | null;

  if (!data?.ok) {
    throw new Error(data?.error || "Gagal menyimpan ke spreadsheet.");
  }
}

export function reportChatSession(payload: WaitlistPayload): void {
  const url = import.meta.env.VITE_SHEETS_WEBHOOK_URL;
  const secret = import.meta.env.VITE_WEBHOOK_SECRET;
  if (!url || !secret) return;

  const json = JSON.stringify(buildBody(payload));

  try {
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: json,
      keepalive: true,
    }).catch(() => {
      /* fire-and-forget */
    });
  } catch {
    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      const blob = new Blob([json], { type: "text/plain;charset=utf-8" });
      navigator.sendBeacon(url, blob);
    }
  }
}

export function buildChatSummary(
  messages: { role: "user" | "bot"; text: string }[],
): string {
  if (messages.length === 0) return "Tidak ada percakapan.";

  return messages
    .map((m) => {
      const tag = m.role === "user" ? "[USER]" : "[AI]";
      return `${tag} ${m.text}`;
    })
    .join("\n");
}
