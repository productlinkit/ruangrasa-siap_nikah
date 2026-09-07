export type GroqMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
const MODELS_ENDPOINT = "https://api.groq.com/openai/v1/models";
const MODEL_CACHE_KEY = "rr:groq:models";

/**
 * Model chat TIDAK diambil dari environment.
 *
 * Alasannya: VITE_* dibakar ke dalam bundle saat `bun run build` (lihat
 * Dockerfile), jadi mengubah env berarti minta infra rebuild image. Sebagai
 * gantinya app menanyakan langsung ke Groq model apa yang sedang hidup, lalu
 * memilih yang paling disukai dari daftar di bawah. Kalau Groq mendekomisi
 * sebuah model (seperti llama-3.3-70b-versatile), app pindah sendiri tanpa
 * perlu ganti kode maupun deploy ulang.
 *
 * Urutan = prioritas. Yang di atas dipakai lebih dulu kalau tersedia.
 */
export const MODEL_PREFERENCE = [
  "openai/gpt-oss-120b",
  "openai/gpt-oss-20b",
  "groq/compound-mini",
  "groq/compound",
];

/** Dipakai kalau daftar model dari Groq gagal diambil (mis. jaringan bermasalah). */
export const CHAT_MODEL = MODEL_PREFERENCE[0];

type GroqModel = {
  id: string;
  active?: boolean;
  context_window?: number;
  input_modalities?: string[];
  output_modalities?: string[];
};

/**
 * Menyaring model yang benar-benar bisa dipakai untuk chat teks. Membuang
 * whisper (output transkripsi), orpheus (output suara), serta prompt-guard
 * dan allam yang context window-nya terlalu kecil untuk system prompt kita.
 */
function isChatModel(m: GroqModel): boolean {
  return (
    m.active !== false &&
    !!m.input_modalities?.includes("text") &&
    !!m.output_modalities?.includes("text") &&
    (m.context_window ?? 0) >= 8192 &&
    !/guard/i.test(m.id)
  );
}

function readCache(): string[] | null {
  if (typeof sessionStorage === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(MODEL_CACHE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return Array.isArray(parsed) && parsed.length ? parsed : null;
  } catch {
    return null;
  }
}

function writeCache(models: string[]): void {
  if (typeof sessionStorage === "undefined") return;
  try {
    sessionStorage.setItem(MODEL_CACHE_KEY, JSON.stringify(models));
  } catch {
    // Private mode / storage penuh — bukan masalah, cuma kehilangan cache.
  }
}

/**
 * Daftar model kandidat, terurut dari yang paling disukai. Hasilnya di-cache
 * per sesi browser supaya tidak menembak /v1/models tiap kali kirim pesan.
 */
async function resolveCandidates(apiKey: string): Promise<string[]> {
  const cached = readCache();
  if (cached) return cached;

  try {
    const res = await fetch(MODELS_ENDPOINT, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (!res.ok) throw new Error(String(res.status));

    const data = await res.json();
    const live = (data?.data ?? []).filter(isChatModel).map((m: GroqModel) => m.id);
    if (!live.length) throw new Error("daftar model kosong");

    const liveSet = new Set<string>(live);
    // Yang kita percaya kualitasnya dulu, sisanya sebagai jaring pengaman
    // terakhir kalau semua pilihan utama ternyata sudah dihapus.
    const preferred = MODEL_PREFERENCE.filter((id) => liveSet.has(id));
    const rest = live.filter((id: string) => !MODEL_PREFERENCE.includes(id));
    const ordered = [...preferred, ...rest];

    writeCache(ordered);
    return ordered;
  } catch {
    // Gagal menanyakan Groq — pakai daftar statis sebagai cadangan.
    return MODEL_PREFERENCE;
  }
}

/**
 * Sebagian model (mis. qwen) menuliskan blok penalaran ke dalam content.
 * Dibuang supaya tidak pernah bocor ke layar pengguna.
 */
function stripReasoning(text: string): string {
  return text
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .replace(/<\|channel\|>[\s\S]*?<\|message\|>/gi, "")
    .trim();
}

export const SYSTEM_PROMPT = `Kamu adalah "Coach RuangRasa", coach AI berbahasa Indonesia untuk persiapan komunikasi & emosional pasangan sebelum menikah (produk: RuangRasa Siap Nikah — siapnikah.ruangrasa.co).

Gaya bicara:
- Hangat, reflektif, tidak menghakimi.
- Pakai sapaan "kamu" (bukan "Anda").
- Singkat, padat, biasanya 2-4 kalimat. Kalau perlu, pakai bullet pendek.
- Boleh memakai emoji secukupnya (maks 1 per balasan).

Fokus topik (yang kamu jawab di sini): komunikasi pasangan menjelang nikah, manajemen konflik pra-nikah, ekspektasi pernikahan, regulasi emosi, kebiasaan hubungan sehat, persiapan mental sebelum hari H.

Produk saudara di ekosistem RuangRasa (bukan kamu — arahkan dengan hangat kalau topik lebih cocok di sana):
- pasangan.ruangrasa.co — untuk topik hubungan pasangan secara umum di LUAR konteks persiapan pernikahan (mis. dinamika pacaran, hubungan jarak jauh, masalah pasangan yang sudah menikah, intimasi, konflik rumah tangga, parenting bersama pasangan).
- teman.ruangrasa.co — untuk topik pertemanan & hubungan sosial non-romantis (mis. konflik dengan sahabat, friendzone, kesepian, membangun lingkaran pertemanan baru, persahabatan toxic).

Aturan rujukan (PENTING — patuhi dengan ketat):
- Setiap balasan boleh menyebut PALING BANYAK SATU URL produk saudara, dan hanya URL yang relevan dengan topik pertanyaan saat itu.
- Kalau topik tentang pertemanan/sosial → sebut HANYA teman.ruangrasa.co. JANGAN sebut pasangan.ruangrasa.co.
- Kalau topik tentang hubungan pasangan di luar konteks pra-nikah → sebut HANYA pasangan.ruangrasa.co. JANGAN sebut teman.ruangrasa.co.
- Kalau topik masih cocok dengan persiapan pernikahan → JANGAN sebut URL produk lain sama sekali, jawab di sini saja.
- Jangan pernah menyebut dua URL produk saudara dalam satu balasan. Jangan pernah membandingkan keduanya.
- Tetap berikan jawaban singkat & empatik yang membantu (jangan langsung "tolak"), lalu sebutkan satu URL yang sesuai dalam satu kalimat hangat.
- Format URL ditulis polos (mis. "pasangan.ruangrasa.co"), tanpa markdown link, agar bisa di-render apa adanya.

Aturan umum:
- Jangan memberi diagnosis klinis atau nasihat hukum/keuangan spesifik.
- Kalau pengguna menyebut krisis (KDRT, ide bunuh diri, dll), arahkan ke bantuan profesional dengan empati.
- Kalau pertanyaan di luar topik hubungan/pernikahan sepenuhnya (mis. coding, resep masakan), arahkan kembali dengan halus.
- Akhiri dengan satu pertanyaan reflektif singkat bila relevan, untuk mengajak pengguna berpikir lebih dalam.`;

export async function chatWithGroq(
  messages: GroqMessage[],
  options?: { extraSystem?: string },
): Promise<string> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;

  if (!apiKey) {
    throw new Error("VITE_GROQ_API_KEY belum di-set di environment.");
  }

  const systemMessages: GroqMessage[] = [{ role: "system", content: SYSTEM_PROMPT }];
  if (options?.extraSystem) {
    systemMessages.push({ role: "system", content: options.extraSystem });
  }

  const payload = [...systemMessages, ...messages];
  const candidates = await resolveCandidates(apiKey);
  let lastError = "";

  for (const model of candidates) {
    const res = await fetch(GROQ_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: payload,
        temperature: 0.7,
        max_tokens: 512,
        // Model gpt-oss punya reasoning channel. Ditekan supaya latency rendah
        // dan token reasoning tidak memakan kuota max_tokens balasan.
        ...(model.includes("gpt-oss")
          ? { reasoning_effort: "low", reasoning_format: "hidden" }
          : {}),
      }),
    });

    if (res.ok) {
      const data = await res.json();
      const content: string | undefined = data?.choices?.[0]?.message?.content;
      const clean = content ? stripReasoning(content) : "";
      if (!clean) throw new Error("Respons Groq kosong.");
      return clean;
    }

    const errText = await res.text().catch(() => "");
    lastError = `Groq error ${res.status}: ${errText}`;

    // Hanya model yang tidak ada yang layak di-retry ke kandidat berikutnya.
    // Error lain (401 key salah, 429 rate limit, 5xx) harus langsung dilempar
    // supaya tidak menghabiskan kuota dengan mencoba semua model.
    const isModelGone = res.status === 404 && errText.includes("model_not_found");
    if (!isModelGone) throw new Error(lastError);

    console.warn(`[groq] Model "${model}" tidak tersedia, mencoba model cadangan berikutnya.`);
  }

  throw new Error(lastError || "Groq error: semua model tidak tersedia.");
}
