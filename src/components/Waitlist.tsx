import { useState } from "react";
import { motion } from "framer-motion";

const statusOptions = [
  { value: "single", label: "Single" },
  { value: "tunangan", label: "Sudah tunangan" },
  { value: "newlywed", label: "Baru menikah" },
];

export function Waitlist() {
  const [status, setStatus] = useState("single");

  return (
    <section
      id="kontak"
      className="relative overflow-hidden bg-ink py-28 md:py-36"
    >
      {/* Concentric rings background */}
      <div className="absolute inset-0 rings-bg" />

      <div className="relative mx-auto grid max-w-[1200px] grid-cols-12 gap-10 px-6 md:px-12">
        {/* Left — copy */}
        <div className="col-span-12 md:col-span-6">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-[11px] uppercase tracking-[0.22em] text-amber-warm"
          >
            Daftar Awal
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="mt-4 font-display text-3xl leading-[1.05] text-cream md:text-5xl"
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
            className="mt-6 max-w-md text-base leading-relaxed text-cream/75"
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
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            className="rounded-sm bg-cream p-8 shadow-[0_30px_80px_-30px_oklch(0_0_0/0.6)] md:p-10"
          >
            <p className="text-[11px] uppercase tracking-[0.22em] text-terracotta">
              Daftarkan dirimu
            </p>

            <div className="mt-6 space-y-5">
              <div>
                <label className="text-[11px] uppercase tracking-[0.18em] text-ink/60">
                  Nama
                </label>
                <input
                  type="text"
                  placeholder="Nama lengkapmu"
                  className="mt-2 w-full border-b border-ink/20 bg-transparent py-2 font-body text-base text-ink placeholder:text-ink/35 focus:border-terracotta focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-[0.18em] text-ink/60">
                  WhatsApp
                </label>
                <input
                  type="tel"
                  placeholder="+62 ..."
                  className="mt-2 w-full border-b border-ink/20 bg-transparent py-2 font-body text-base text-ink placeholder:text-ink/35 focus:border-terracotta focus:outline-none"
                />
              </div>

              {/* Status — segmented control */}
              <div>
                <label className="text-[11px] uppercase tracking-[0.18em] text-ink/60">
                  Status saat ini
                </label>
                <div className="mt-3 grid grid-cols-3 gap-1 rounded-full bg-amber-soft p-1">
                  {statusOptions.map((o) => {
                    const active = status === o.value;
                    return (
                      <button
                        key={o.value}
                        type="button"
                        onClick={() => setStatus(o.value)}
                        className={`rounded-full px-3 py-2 text-[11px] uppercase tracking-[0.14em] transition-all ${
                          active
                            ? "bg-terracotta text-cream shadow-sm"
                            : "text-ink/65 hover:text-ink"
                        }`}
                      >
                        {o.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <button type="submit" className="pill-btn mt-8 w-full">
              Bergabung ke Waitlist
            </button>

            <p className="mt-4 text-center text-[10px] uppercase tracking-[0.18em] text-ink/45">
              Gratis · Tidak ada spam · Kapan saja bisa keluar
            </p>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
