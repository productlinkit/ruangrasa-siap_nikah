import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Sparkles, Heart } from "lucide-react";
import { chatWithGroq, type GroqMessage } from "@/lib/groq";
import { submitWaitlist, buildChatSummary } from "@/lib/sheets";

type Message = {
  id: number;
  role: "bot" | "user";
  text: string;
};

const initialMessages: Message[] = [
  {
    id: 1,
    role: "bot",
    text: "Halo! Aku Coach RuangRasa. Ada yang ingin kamu bicarakan soal persiapan hubungan atau pernikahan? 💬",
  },
];

const SUGGESTIONS = [
  "Bagaimana cara memulai obrolan soal keuangan dengan pasangan?",
  "Aku sering bertengkar soal hal kecil, kenapa ya?",
  "Apa tanda kami sudah siap menikah?",
  "Bagaimana cara mengelola ekspektasi keluarga besar?",
];

const FREE_MESSAGE_LIMIT = 5;

export function FloatingChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [userMessageCount, setUserMessageCount] = useState(0);
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);
  const [waitlistName, setWaitlistName] = useState("");
  const [waitlistPhone, setWaitlistPhone] = useState("");
  const [waitlistError, setWaitlistError] = useState("");
  const [waitlistSubmitting, setWaitlistSubmitting] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open, isLoading, showWaitlist]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    if (userMessageCount >= FREE_MESSAGE_LIMIT && !waitlistSubmitted) {
      setShowWaitlist(true);
      return;
    }

    const userMsg: Message = { id: Date.now(), role: "user", text: trimmed };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput("");
    setShowSuggestions(false);
    setIsLoading(true);

    const history: GroqMessage[] = nextMessages.map((m) => ({
      role: m.role === "bot" ? "assistant" : "user",
      content: m.text,
    }));

    const willHitLimit =
      userMessageCount + 1 >= FREE_MESSAGE_LIMIT && !waitlistSubmitted;

    const extraSystem = willHitLimit
      ? `INSTRUKSI KHUSUS untuk balasan ini saja:
- Jawab pertanyaan user secara singkat dan bermanfaat (2-3 kalimat).
- JANGAN akhiri dengan pertanyaan reflektif apa pun.
- Setelah jawaban, langsung sambung dengan ajakan hangat agar user bergabung ke waitlist RuangRasa supaya bisa lanjut ngobrol lebih dalam dan dapat akses prioritas saat launch. Sebutkan bahwa cukup isi nama & nomor WhatsApp.
- Semua dalam SATU paragraf yang mengalir, jangan dipisah dengan heading.`
      : undefined;

    try {
      const reply = await chatWithGroq(history, { extraSystem });
      const newCount = userMessageCount + 1;
      setUserMessageCount(newCount);
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "bot", text: reply },
      ]);

      if (newCount >= FREE_MESSAGE_LIMIT && !waitlistSubmitted) {
        setTimeout(() => setShowWaitlist(true), 400);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan.";
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "bot",
          text: `Maaf, aku sedang kesulitan menjawab sekarang. (${message})`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (waitlistSubmitting) return;

    const name = waitlistName.trim();
    const phone = waitlistPhone.trim();

    if (!name) {
      setWaitlistError("Nama tidak boleh kosong.");
      return;
    }
    const phoneDigits = phone.replace(/\D/g, "");
    if (phoneDigits.length < 9) {
      setWaitlistError("Nomor WhatsApp tidak valid.");
      return;
    }

    setWaitlistError("");
    setWaitlistSubmitting(true);

    try {
      await submitWaitlist({
        fullName: name,
        whatsapp: phone,
        summary: buildChatSummary(messages),
        sheetName: "siap-nikah",
      });

      setWaitlistSubmitted(true);
      setShowWaitlist(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: "bot",
          text: `Terima kasih, ${name}! 🌿 Kamu sudah masuk waitlist. Kami akan kabari via WhatsApp begitu modul pertama siap. Sekarang yuk lanjut ngobrol — mau bahas apa lagi?`,
        },
      ]);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Gagal menyimpan data.";
      setWaitlistError(`${message} Coba lagi ya.`);
    } finally {
      setWaitlistSubmitting(false);
    }
  };

  const canType = !isLoading && !showWaitlist;

  return (
    <>
      {/* Floating button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Tutup chat" : "Buka chat"}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-terracotta text-cream shadow-lg shadow-terracotta/30 transition-shadow hover:shadow-xl md:bottom-8 md:right-8 md:h-16 md:w-16"
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="h-6 w-6 md:h-7 md:w-7" />
            </motion.span>
          ) : (
            <motion.span
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="h-6 w-6 md:h-7 md:w-7" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
            className="fixed bottom-24 right-6 z-50 flex h-[70vh] max-h-[600px] w-[calc(100vw-3rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-ink/10 bg-cream shadow-2xl md:bottom-28 md:right-8"
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-ink/10 bg-ink px-5 py-4 text-cream">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-terracotta">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p
                  className="text-base leading-tight"
                  style={{ fontFamily: "'DM Serif Display', serif" }}
                >
                  Coach RuangRasa
                </p>
                <p className="text-[11px] uppercase tracking-[0.18em] text-cream/60">
                  {isLoading ? "Sedang mengetik..." : "Online · Siap mendengarkan"}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-5">
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "rounded-br-sm bg-terracotta text-cream"
                        : "rounded-bl-sm bg-ink/5 text-ink"
                    }`}
                  >
                    {m.text}
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm bg-ink/5 px-4 py-3">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink/40 [animation-delay:-0.3s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink/40 [animation-delay:-0.15s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink/40" />
                  </div>
                </motion.div>
              )}

              {/* Waitlist inline form */}
              <AnimatePresence>
                {showWaitlist && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden rounded-2xl border border-terracotta/30 bg-paper p-4 shadow-sm"
                  >
                    <div className="mb-3 flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-terracotta/15 text-terracotta">
                        <Heart className="h-3.5 w-3.5" fill="currentColor" />
                      </div>
                      <p
                        className="text-sm leading-tight text-ink"
                        style={{ fontFamily: "'DM Serif Display', serif" }}
                      >
                        Lanjutkan perjalananmu
                      </p>
                    </div>
                    <p className="mb-4 text-[12px] leading-relaxed text-ink-soft">
                      Daftar waitlist untuk akses prioritas & modul pertama gratis saat launch.
                    </p>
                    <form onSubmit={handleWaitlistSubmit} className="space-y-3">
                      <div>
                        <label className="text-[10px] uppercase tracking-[0.18em] text-ink/55">
                          Nama
                        </label>
                        <input
                          type="text"
                          value={waitlistName}
                          onChange={(e) => setWaitlistName(e.target.value)}
                          placeholder="Nama lengkapmu"
                          className="mt-1 w-full border-b border-ink/20 bg-transparent py-1.5 text-sm text-ink placeholder:text-ink/35 focus:border-terracotta focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-[0.18em] text-ink/55">
                          WhatsApp
                        </label>
                        <input
                          type="tel"
                          value={waitlistPhone}
                          onChange={(e) => setWaitlistPhone(e.target.value)}
                          placeholder="+62 ..."
                          className="mt-1 w-full border-b border-ink/20 bg-transparent py-1.5 text-sm text-ink placeholder:text-ink/35 focus:border-terracotta focus:outline-none"
                        />
                      </div>
                      {waitlistError && (
                        <p className="text-[11px] text-terracotta">{waitlistError}</p>
                      )}
                      <div className="flex gap-2 pt-1">
                        <button
                          type="submit"
                          disabled={waitlistSubmitting}
                          className="flex-1 rounded-full bg-terracotta px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-cream transition-transform hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
                        >
                          {waitlistSubmitting ? "Menyimpan..." : "Gabung Waitlist"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowWaitlist(false)}
                          disabled={waitlistSubmitting}
                          className="rounded-full border border-ink/15 px-3 py-2 text-xs text-ink/60 transition-colors hover:border-ink/30 hover:text-ink disabled:opacity-50"
                        >
                          Nanti
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Suggestions */}
              {showSuggestions && !isLoading && !showWaitlist && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="space-y-2 pt-1"
                >
                  <p className="px-1 text-[11px] uppercase tracking-[0.18em] text-ink/50">
                    Coba tanya
                  </p>
                  <div className="flex flex-col gap-2">
                    {SUGGESTIONS.map((q) => (
                      <button
                        key={q}
                        onClick={() => sendMessage(q)}
                        className="rounded-xl border border-terracotta/25 bg-amber-soft/40 px-3.5 py-2 text-left text-[13px] leading-snug text-ink transition-colors hover:border-terracotta hover:bg-amber-soft"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 border-t border-ink/10 bg-cream px-3 py-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={!canType}
                placeholder={
                  showWaitlist
                    ? "Isi waitlist dulu yuk..."
                    : isLoading
                    ? "Menunggu jawaban..."
                    : "Tulis pesanmu..."
                }
                className="flex-1 rounded-full border border-ink/15 bg-cream px-4 py-2.5 text-sm text-ink outline-none placeholder:text-ink/40 focus:border-terracotta disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={!canType || !input.trim()}
                aria-label="Kirim"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-terracotta text-cream transition-transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
