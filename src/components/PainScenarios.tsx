import { motion } from "framer-motion";
import journalFlatlay from "@/assets/sn-journal-flatlay.jpg";

const scenarios = [
  {
    quote:
      "Aku sayang dia, tapi kadang nggak tahu cara ngomong yang benar tanpa ribut.",
    label: "Komunikasi",
    rotate: "-rotate-1",
    h: "h-auto",
  },
  {
    quote:
      "Kita belum pernah beneran ngomongin harapan kita tentang pernikahan.",
    label: "Ekspektasi",
    rotate: "rotate-1",
    h: "h-auto md:mt-12",
  },
  {
    quote:
      "Aku lihat orang tua ribut terus waktu kecil. Aku nggak mau pernikahan seperti itu.",
    label: "Pola Lama",
    rotate: "rotate-2",
    h: "h-auto md:-mt-4",
  },
  {
    quote:
      "Tekanan dari keluarga untuk segera nikah, tapi aku belum merasa siap secara mental.",
    label: "Kesiapan",
    rotate: "-rotate-2",
    h: "h-auto md:mt-8",
  },
];

export function PainScenarios() {
  return (
    <section className="relative overflow-hidden bg-cream py-28 md:py-36">
      {/* Subtle blurred background image */}
      <div
        className="absolute inset-0 -z-0 opacity-[0.08]"
        style={{
          backgroundImage: `url(${journalFlatlay})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(8px)",
        }}
      />

      <div className="relative mx-auto max-w-[1200px] px-6 md:px-12">
        <div className="max-w-2xl">
          <p className="mb-3 text-[11px] uppercase tracking-[0.22em] text-terracotta">
            Kalau ini terdengar familiar
          </p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="font-display text-3xl leading-[1.1] text-ink md:text-5xl"
          >
            Pikiran-pikiran yang{" "}
            <span className="italic-display text-terracotta">
              kamu simpan sendiri
            </span>{" "}
            di kepala.
          </motion.h2>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {scenarios.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40, rotate: 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, delay: i * 0.12 }}
              whileHover={{ y: -4, rotate: 0 }}
              className={`journal-card ${s.rotate} ${s.h}`}
            >
              <p className="text-[10px] uppercase tracking-[0.2em] text-amber-warm">
                {s.label}
              </p>
              <p className="mt-3 font-serif text-lg italic leading-relaxed text-ink md:text-xl">
                "{s.quote}"
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
