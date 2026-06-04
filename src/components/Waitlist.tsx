import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { submitWaitlist } from "@/lib/sheets";

export function Waitlist() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || submitted) return;

    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedName) {
      setError("Nama tidak boleh kosong.");
      return;
    }
    const phoneDigits = trimmedPhone.replace(/\D/g, "");
    if (phoneDigits.length < 9) {
      setError("Nomor WhatsApp tidak valid.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      await submitWaitlist({
        fullName: trimmedName,
        whatsapp: trimmedPhone,
        sheetName: "siap-nikah",
        source: "siapnikah.ruangrasa (waitlist section)",
      });
      setSubmitted(true);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Gagal menyimpan data.";
      setError(`${message} Coba lagi ya.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="kontak"
      className="relative overflow-hidden bg-ink py-16 sm:py-20 md:py-28 lg:py-36"
    >
      {/* Concentric rings background */}
      <div className="absolute inset-0 rings-bg" />

      <div className="relative mx-auto grid max-w-300 grid-cols-12 gap-8 px-5 sm:px-6 md:gap-10 md:px-12">
        {/* Left — copy */}
        <div className="col-span-12 md:col-span-6">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-[10px] uppercase tracking-[0.22em] text-amber-warm sm:text-[11px]"
          >
            Daftar Awal
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="mt-3 font-display text-[26px] leading-[1.1] text-cream sm:mt-4 sm:text-3xl md:text-4xl lg:text-5xl"
          >
            Pernikahanmu dimulai{" "}
            <span className="italic-display text-amber-warm">
              jauh sebelum hari H.
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-4 max-w-md text-sm leading-relaxed text-cream/75 sm:mt-6 sm:text-base"
          >
            Bergabung ke daftar awal RuangRasa Siap Nikah. Dapatkan akses gratis
            ke assessment dan modul pertama saat kami launch.
          </motion.p>
        </div>

        {/* Right — form card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="col-span-12 md:col-span-6"
        >
          {submitted ? (
            <div className="rounded-sm bg-cream p-6 shadow-[0_30px_80px_-30px_oklch(0_0_0/0.6)] sm:p-8 md:p-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-terracotta/15 text-terracotta">
                <Check className="h-6 w-6" strokeWidth={2.5} />
              </div>
              <p
                className="mt-5 font-display text-2xl leading-tight text-ink sm:text-3xl"
                style={{ fontFamily: "'DM Serif Display', serif" }}
              >
                Terima kasih, {name.trim().split(" ")[0]}!
              </p>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft sm:text-base">
                Kamu sudah masuk waitlist RuangRasa Siap Nikah. Kami akan kabari
                via WhatsApp begitu modul pertama siap diluncurkan. 🌿
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="rounded-sm bg-cream p-6 shadow-[0_30px_80px_-30px_oklch(0_0_0/0.6)] sm:p-8 md:p-10"
            >
              <p className="text-[11px] uppercase tracking-[0.22em] text-terracotta">
                Daftarkan dirimu
              </p>

              <div className="mt-5 space-y-5 sm:mt-6">
                <div>
                  <label className="text-[11px] uppercase tracking-[0.18em] text-ink/60">
                    Nama
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isSubmitting}
                    placeholder="Nama lengkapmu"
                    className="mt-2 w-full border-b border-ink/20 bg-transparent py-2 font-body text-base text-ink placeholder:text-ink/35 focus:border-terracotta focus:outline-none disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-[0.18em] text-ink/60">
                    WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={isSubmitting}
                    placeholder="+62 ..."
                    className="mt-2 w-full border-b border-ink/20 bg-transparent py-2 font-body text-base text-ink placeholder:text-ink/35 focus:border-terracotta focus:outline-none disabled:opacity-60"
                  />
                </div>
              </div>

              {error && (
                <p className="mt-4 text-[12px] text-terracotta">{error}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="pill-btn mt-7 w-full sm:mt-8 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Menyimpan..." : "Bergabung ke Waitlist"}
              </button>

              <p className="mt-4 text-center text-[10px] uppercase tracking-[0.18em] text-ink/45">
                Gratis · Tidak ada spam · Kapan saja bisa keluar
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
