import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Send, Heart } from "lucide-react";
import { chatWithGroq, type GroqMessage } from "@/lib/groq";
import {
  submitWaitlist,
  buildChatSummary,
  reportChatSession,
} from "@/lib/sheets";

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
const MIN_THINKING_MS = 3000;
const TYPING_SPEED_MS = 18;
const IDLE_TIMEOUT_MS = 3 * 60 * 1000;

const URL_REGEX = /(https?:\/\/[^\s]+|(?:[\w-]+\.)+(?:co|com|id|net|org|app|io)(?:\/[^\s]*)?)/gi;

function renderWithLinks(text: string) {
  const parts = text.split(URL_REGEX);
  return parts.map((part, i) => {
    if (i % 2 === 1) {
      const href = part.startsWith("http") ? part : `https://${part}`;
      return (
        <a
          key={i}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-terracotta underline decoration-terracotta/40 underline-offset-2 hover:decoration-terracotta"
        >
          {part}
        </a>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

type ChatPanelProps = {
  showCloseButton?: boolean;
  onClose?: () => void;
  className?: string;
};

export type ChatPanelHandle = {
  reportSessionIfNeeded: () => void;
};

export const ChatPanel = forwardRef<ChatPanelHandle, ChatPanelProps>(function ChatPanel(
  { showCloseButton, onClose, className },
  ref,
) {
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
  const [typingMessageId, setTypingMessageId] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const typingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Refs mirror state for use in event handlers (avoid stale closures)
  const messagesRef = useRef(messages);
  const userMessageCountRef = useRef(0);
  const waitlistSubmittedRef = useRef(false);
  const sessionReportedRef = useRef(false);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);
  useEffect(() => {
    userMessageCountRef.current = userMessageCount;
  }, [userMessageCount]);
  useEffect(() => {
    waitlistSubmittedRef.current = waitlistSubmitted;
  }, [waitlistSubmitted]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isLoading, showWaitlist]);

  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, []);

  const reportAbandonedIfNeeded = () => {
    if (sessionReportedRef.current) return;
    if (waitlistSubmittedRef.current) return;
    if (userMessageCountRef.current === 0) return;

    sessionReportedRef.current = true;
    reportChatSession({
      fullName: "",
      whatsapp: "",
      summary: buildChatSummary(messagesRef.current),
      sheetName: "siap-nikah",
      source: `siapnikah.ruangrasa (chat - abandoned @ msg ${userMessageCountRef.current})`,
    });
  };

  const resetIdleTimer = () => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (sessionReportedRef.current || waitlistSubmittedRef.current) return;
    idleTimerRef.current = setTimeout(() => {
      reportAbandonedIfNeeded();
    }, IDLE_TIMEOUT_MS);
  };

  useEffect(() => {
    const handlePageHide = () => reportAbandonedIfNeeded();
    window.addEventListener("pagehide", handlePageHide);
    return () => window.removeEventListener("pagehide", handlePageHide);
  }, []);

  useEffect(() => {
    return () => {
      reportAbandonedIfNeeded();
    };
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      reportSessionIfNeeded: () => reportAbandonedIfNeeded(),
    }),
    [],
  );

  const playTypingAnimation = (botId: number, fullText: string, onComplete?: () => void) => {
    setTypingMessageId(botId);
    let i = 0;
    typingIntervalRef.current = setInterval(() => {
      i++;
      setMessages((prev) =>
        prev.map((m) => (m.id === botId ? { ...m, text: fullText.slice(0, i) } : m)),
      );
      if (i >= fullText.length) {
        if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
        setTypingMessageId(null);
        onComplete?.();
      }
    }, TYPING_SPEED_MS);
  };

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading || waitlistSubmitted || typingMessageId !== null) return;

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
    resetIdleTimer();

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
      const [reply] = await Promise.all([
        chatWithGroq(history, { extraSystem }),
        new Promise((resolve) => setTimeout(resolve, MIN_THINKING_MS)),
      ]);
      const newCount = userMessageCount + 1;
      setUserMessageCount(newCount);
      setIsLoading(false);

      const botId = Date.now() + 1;
      setMessages((prev) => [...prev, { id: botId, role: "bot", text: "" }]);

      playTypingAnimation(botId, reply, () => {
        if (newCount >= FREE_MESSAGE_LIMIT && !waitlistSubmitted) {
          setTimeout(() => setShowWaitlist(true), 400);
        }
      });
      return;
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
        source: `siapnikah.ruangrasa (chat - completed @ msg ${userMessageCount})`,
      });

      sessionReportedRef.current = true;
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      setWaitlistSubmitted(true);
      setShowWaitlist(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: "bot",
          text: `Terima kasih, ${name}! 🌿 Kamu sudah resmi masuk waitlist RuangRasa Siap Nikah. Tim kami akan menghubungimu via WhatsApp begitu modul pertama siap diluncurkan. Sambil menunggu, jaga komunikasi hangat dengan pasanganmu ya — sampai jumpa di pesan berikutnya. 💌`,
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

  const isTyping = typingMessageId !== null;
  const canType = !isLoading && !isTyping && !showWaitlist && !waitlistSubmitted;

  const statusText = waitlistSubmitted
    ? "Terdaftar · Menunggu launch"
    : isLoading
    ? "Sedang berpikir..."
    : isTyping
    ? "Sedang mengetik..."
    : "Online · Siap mendengarkan";

  return (
    <div className={`flex h-full flex-col overflow-hidden bg-cream ${className ?? ""}`}>
      {/* Chat header */}
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
            {statusText}
          </p>
        </div>
        {showCloseButton && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup chat"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-cream/70 transition-colors hover:bg-cream/10 hover:text-cream"
          >
            <X className="h-5 w-5" />
          </button>
        )}
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
              {m.role === "bot" ? renderWithLinks(m.text) : m.text}
              {typingMessageId === m.id && (
                <span className="ml-0.5 inline-block h-3.5 w-0.5 -mb-0.5 animate-pulse bg-terracotta align-middle" />
              )}
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
          onChange={(e) => {
            setInput(e.target.value);
            resetIdleTimer();
          }}
          disabled={!canType}
          placeholder={
            waitlistSubmitted
              ? "Chat ditutup — sampai jumpa saat launch ✨"
              : showWaitlist
              ? "Isi waitlist dulu yuk..."
              : isLoading
              ? "Coach sedang berpikir..."
              : isTyping
              ? "Coach sedang mengetik..."
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
    </div>
  );
});
