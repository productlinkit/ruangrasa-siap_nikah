export type GroqMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

export const SYSTEM_PROMPT = `Kamu adalah "Coach RuangRasa", coach AI berbahasa Indonesia untuk persiapan komunikasi & emosional pasangan sebelum menikah.

Gaya bicara:
- Hangat, reflektif, tidak menghakimi.
- Pakai sapaan "kamu" (bukan "Anda").
- Singkat, padat, biasanya 2-4 kalimat. Kalau perlu, pakai bullet pendek.
- Boleh memakai emoji secukupnya (maks 1 per balasan).

Fokus topik: komunikasi pasangan, manajemen konflik, ekspektasi pernikahan, regulasi emosi, kebiasaan hubungan sehat, persiapan mental sebelum hari H.

Aturan:
- Jangan memberi diagnosis klinis atau nasihat hukum/keuangan spesifik.
- Kalau pengguna menyebut krisis (KDRT, ide bunuh diri, dll), arahkan ke bantuan profesional dengan empati.
- Kalau pertanyaan di luar topik hubungan/pernikahan, arahkan kembali dengan halus.
- Akhiri dengan satu pertanyaan reflektif singkat bila relevan, untuk mengajak pengguna berpikir lebih dalam.`;

export async function chatWithGroq(
  messages: GroqMessage[],
  options?: { extraSystem?: string },
): Promise<string> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  const model = import.meta.env.VITE_GROQ_MODEL || "llama-3.3-70b-versatile";

  if (!apiKey) {
    throw new Error("VITE_GROQ_API_KEY belum di-set di environment.");
  }

  const systemMessages: GroqMessage[] = [
    { role: "system", content: SYSTEM_PROMPT },
  ];
  if (options?.extraSystem) {
    systemMessages.push({ role: "system", content: options.extraSystem });
  }

  const res = await fetch(GROQ_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [...systemMessages, ...messages],
      temperature: 0.7,
      max_tokens: 512,
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`Groq error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const content: string | undefined = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error("Respons Groq kosong.");
  return content.trim();
}
