import { motion } from "framer-motion";
import { openChatWidget } from "@/lib/chat-events";

export function Assessment() {
  return (
    <section
      id="assessment"
      className="relative overflow-hidden py-28 md:py-36"
      style={{
        background:
          "linear-gradient(180deg, oklch(0.94 0.04 75) 0%, oklch(0.85 0.13 70) 100%)",
      }}
    >
      <div className="mx-auto max-w-[1100px] px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="relative mx-auto max-w-3xl rounded-sm bg-cream px-8 py-14 shadow-[0_30px_80px_-30px_oklch(0_0_0/0.35)] md:px-16 md:py-20"
        >
          <p className="text-center text-[11px] uppercase tracking-[0.22em] text-terracotta">
            Lead Magnet · Gratis
          </p>
          <h2 className="mt-4 text-center font-display text-3xl leading-[1.05] text-ink md:text-5xl">
            Cek Kesiapan Nikahmu,{" "}
            <span className="italic-display text-terracotta">
              Gratis, 7 Menit
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-center font-body text-base leading-relaxed text-ink/75 md:text-lg">
            Jawab 12 pertanyaan singkat dan dapatkan laporan personalisasi
            tentang gaya komunikasimu, area yang perlu dikuatkan sebelum
            menikah, dan langkah konkret selanjutnya.
          </p>

          <div className="mt-10 flex justify-center">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                openChatWidget();
              }}
              className="pill-btn"
            >
              Mulai Sekarang Gratis
            </a>
          </div>

          {/* Sample result preview — blurred */}
          <div className="relative mt-14">
            <p className="text-center text-[11px] uppercase tracking-[0.22em] text-ink/55">
              Begini contoh hasil assessmentmu
            </p>

            <div className="relative mx-auto mt-6 max-w-md overflow-hidden rounded-sm border border-ink/10 bg-paper p-6 shadow-[0_12px_40px_-20px_oklch(0_0_0/0.3)]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.2em] text-amber-warm">
                  Gaya Komunikasi
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-ink/40">
                  Sample
                </span>
              </div>
              <p className="mt-3 font-display text-3xl text-terracotta">
                Reflector
              </p>
              <p className="mt-2 text-sm italic text-ink/70">
                Kamu cenderung memproses dulu sebelum bicara, kekuatan dalam
                konflik, tantangan dalam keseharian.
              </p>

              <div className="mt-6 space-y-3">
                {[
                  { l: "Mendengar aktif", v: 78 },
                  { l: "Ekspresi emosi", v: 52 },
                  { l: "Ekspektasi terucap", v: 41 },
                ].map((b) => (
                  <div key={b.l}>
                    <div className="flex justify-between text-[11px] text-ink/65">
                      <span>{b.l}</span>
                      <span>{b.v}%</span>
                    </div>
                    <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-amber-soft">
                      <div
                        className="h-full bg-amber-warm"
                        style={{ width: `${b.v}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Blur fade overlay */}
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3"
                style={{
                  background:
                    "linear-gradient(180deg, transparent 0%, oklch(0.985 0.008 80 / 0.6) 30%, oklch(0.985 0.008 80) 90%)",
                  backdropFilter: "blur(2px)",
                  WebkitBackdropFilter: "blur(2px)",
                }}
              />
              <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.22em] text-ink/55">
                Lanjutkan untuk lihat hasil lengkap
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
