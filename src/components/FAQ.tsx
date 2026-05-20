import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    q: "Apakah pasanganku harus ikut?",
    a: "Tidak wajib, tapi lebih baik bersama. Ada fitur untuk solo dan untuk pasangan.",
  },
  {
    q: "Apakah ini menggantikan bimbingan pernikahan dari KUA atau pendeta?",
    a: "Tidak. RuangRasa melengkapi, bukan menggantikan.",
  },
  {
    q: "Aku belum punya pasangan, apakah tetap relevan?",
    a: "Ya. Memahami gaya komunikasimu sendiri adalah langkah pertama yang paling penting.",
  },
  {
    q: "Berapa lama programnya?",
    a: "Dirancang untuk 10–15 menit per hari. Bisa sesuai ritme kamu sendiri.",
  },
  {
    q: "Apakah ada biaya?",
    a: "Gratis selama masa beta. Akses penuh tersedia dengan harga terjangkau setelah launch.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative bg-cream py-28 md:py-36">
      <div className="mx-auto max-w-[900px] px-6 md:px-12">
        <p className="mb-3 text-[11px] uppercase tracking-[0.22em] text-terracotta">
          Pertanyaan
        </p>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="font-display text-3xl leading-[1.05] text-ink md:text-5xl"
        >
          Yang sering{" "}
          <span className="italic-display text-terracotta">
            ditanyakan
          </span>
        </motion.h2>

        <div className="mt-12 space-y-2">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.6, delay: i * 0.06 }}
                className={`overflow-hidden rounded-sm border-l-2 transition-colors ${
                  isOpen
                    ? "border-terracotta bg-amber-soft/50"
                    : "border-ink/15 bg-transparent hover:border-amber-warm"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-6 px-5 py-5 text-left md:px-7 md:py-6"
                >
                  <span
                    className={`font-display text-lg leading-snug transition-colors md:text-xl ${
                      isOpen ? "text-terracotta" : "text-ink"
                    }`}
                  >
                    {f.q}
                  </span>
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm transition-all ${
                      isOpen
                        ? "rotate-45 bg-terracotta text-cream"
                        : "bg-ink/8 text-ink"
                    }`}
                  >
                    +
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-6 font-serif text-base leading-relaxed text-ink/80 md:px-7 md:text-lg">
                        {f.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
