import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  {
    value: 28,
    suffix: "%",
    label: "pernikahan di Indonesia berakhir cerai",
    sub: "salah satu tertinggi di Asia",
  },
  {
    value: 54,
    suffix: "%",
    label: "perceraian disebabkan komunikasi yang buruk",
    sub: "bukan selingkuh atau uang",
  },
  {
    value: 2,
    suffix: " jam",
    label: "persiapan pra-nikah resmi di Indonesia",
    sub: "menurut Kemenag",
  },
];

export function Stats() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const nums = gsap.utils.toArray<HTMLElement>(".stat-num");
      nums.forEach((el) => {
        const target = parseFloat(el.dataset.value || "0");
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 1.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            toggleActions: "play none none none",
          },
          onUpdate: () => {
            el.textContent = Math.round(obj.val).toString();
          },
        });
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="realita"
      ref={ref}
      className="relative bg-[oklch(0.94_0.04_75)] py-24 md:py-32"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-3 text-[11px] uppercase tracking-[0.22em] text-terracotta"
        >
          Cek Realita
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="max-w-3xl font-display text-3xl leading-[1.1] text-ink md:text-5xl"
        >
          Tiga angka yang{" "}
          <span className="italic-display text-terracotta">
            jarang dibicarakan
          </span>{" "}
          sebelum hari H.
        </motion.h2>

        <div className="mt-16 grid grid-cols-1 gap-12 md:mt-20 md:grid-cols-3 md:gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: i * 0.15 }}
              className="relative"
            >
              <p className="text-[11px] uppercase tracking-[0.22em] text-ink/50">
                {String(i + 1).padStart(2, "0")}
              </p>
              <div className="mt-3 flex items-baseline gap-1 font-display leading-none text-terracotta">
                <span
                  className="stat-num text-7xl md:text-[7rem]"
                  data-value={s.value}
                >
                  0
                </span>
                <span className="text-4xl md:text-6xl">{s.suffix}</span>
              </div>
              <p className="mt-5 max-w-xs font-display text-lg leading-snug text-ink md:text-xl">
                {s.label}
              </p>
              <p className="mt-2 max-w-xs text-sm italic text-ink/65">
                {s.sub}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Framing line */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mx-auto mt-20 max-w-2xl text-center"
        >
          <div className="mx-auto h-px w-24 bg-terracotta/60" />
          <p className="mt-6 font-display text-xl italic text-ink/85 md:text-2xl">
            Bukan untuk menakut-nakuti kamu. Tapi karena kamu berhak tahu, dan
            berhak bersiap.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
