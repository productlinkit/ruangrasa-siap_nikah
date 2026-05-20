import { motion } from "framer-motion";
import phoneMockup from "@/assets/sn-phone-mockup.jpg";
import journaling from "@/assets/sn-journaling.jpg";
import soloMorning from "@/assets/sn-solo-morning.jpg";

const steps = [
  {
    n: "01",
    title: "Mulai dengan assessment",
    body: "Kenali gaya komunikasimu dan gaya pasanganmu, 7 menit, langsung dapat hasilnya.",
    img: phoneMockup,
    rotate: "md:-rotate-3",
    pos: "md:top-0 md:left-0",
  },
  {
    n: "02",
    title: "Latihan harian bersama AI",
    body: "Setiap hari ada satu skill kecil yang bisa kamu latih lewat percakapan, jurnal, atau roleplay.",
    img: journaling,
    rotate: "md:rotate-2",
    pos: "md:top-[80px] md:left-1/2 md:-translate-x-1/2",
  },
  {
    n: "03",
    title: "Pantau pertumbuhanmu",
    body: "Lihat seberapa jauh kamu berkembang dalam kemampuan komunikasi dan kesiapan hubunganmu.",
    img: soloMorning,
    rotate: "md:-rotate-2",
    pos: "md:top-[40px] md:right-0",
  },
];

export function HowItWorks() {
  return (
    <section
      id="cara-kerja"
      className="relative overflow-hidden bg-cream py-28 md:py-36"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
          <p className="text-[11px] uppercase tracking-[0.22em] text-terracotta">
            03 langkah
          </p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="text-left font-display text-3xl leading-[1.05] text-ink md:text-right md:text-5xl"
          >
            Cara{" "}
            <span className="italic-display text-terracotta">
              RuangRasa bekerja
            </span>{" "}
            untukmu.
          </motion.h2>
        </div>

        {/* Mobile: stacked vertical · Desktop: staggered absolute without overlap */}
        <div className="mt-16 flex flex-col items-center gap-10 md:relative md:mx-auto md:block md:h-[640px] md:max-w-6xl">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, delay: i * 0.18 }}
              whileHover={{ scale: 1.03 }}
              className={`w-full max-w-sm md:absolute md:w-[30%] md:max-w-none ${s.pos}`}
            >
              <div className={`polaroid relative ${s.rotate}`}>
                <div className="tape" />
                <img
                  src={s.img}
                  alt={s.title}
                  loading="lazy"
                  width={800}
                  height={800}
                  className="aspect-[4/3] w-full object-cover"
                />
                <div className="mt-3 flex items-baseline gap-3 px-1">
                  <span className="font-display text-2xl text-amber-warm">
                    {s.n}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.18em] text-ink/55">
                    Langkah
                  </span>
                </div>
                <p className="mt-1 px-1 font-display text-lg leading-tight text-ink">
                  {s.title}
                </p>
                <p className="mt-2 px-1 text-[12px] leading-relaxed text-ink/75">
                  {s.body}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
