export type GroqMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

/**
 * SUMBER KEBENARAN model chat ada di file ini, BUKAN di environment.
 *
 * Untuk ganti model: ubah CHAT_MODEL di bawah lalu deploy. Tidak perlu
 * menyentuh env di infra. Env var VITE_GROQ_MODEL sengaja tidak lagi dibaca
 * supaya nilai basi di produksi (mis. model yang sudah dihapus Groq) tidak
 * bisa menimpa nilai yang benar di sini.
 */
export const CHAT_MODEL = "openai/gpt-oss-120b";

/**
 * Dipakai otomatis kalau CHAT_MODEL ternyata sudah dihapus Groq (HTTP 404
 * `model_not_found`). Urutan = prioritas. Ini jaring pengaman supaya chatbot
 * tidak mati total saat Groq mendekomisi model, seperti yang terjadi pada
 * llama-3.3-70b-versatile.
 */
const FALLBACK_MODELS = ["openai/gpt-oss-20b", "groq/compound-mini"];

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
  const candidates = [CHAT_MODEL, ...FALLBACK_MODELS];
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
      if (!content) throw new Error("Respons Groq kosong.");
      return content.trim();
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
