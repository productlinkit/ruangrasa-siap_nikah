import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const modules = [
  {
    n: "01",
    title: "Gaya Komunikasimu",
    body: "Kenali pola bicara dan mendengarmu dalam hubungan.",
    icon: "💬",
  },
  {
    n: "02",
    title: "Cara Bertengkar yang Baik",
    body: "Konflik itu normal. Yang penting adalah cara menyelesaikannya.",
    icon: "⚡",
  },
  {
    n: "03",
    title: "Ekspektasi Tersembunyi",
    body: "Hal-hal yang belum pernah kalian bicarakan tapi akan mempengaruhi segalanya.",
    icon: "🔍",
  },
  {
    n: "04",
    title: "Mengelola Emosi Bersama",
    body: "Ketika salah satu dari kalian sedang panas, apa yang harus dilakukan?",
    icon: "🌊",
  },
  {
    n: "05",
    title: "Membangun Kebiasaan Sehat",
    body: "Check-in harian, jurnal, dan kebiasaan kecil yang membuat perbedaan besar.",
    icon: "🌱",
  },
];

export function Curriculum() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".cur-card",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".cur-grid",
            start: "top 75%",
            toggleActions: "play none none none",
          },
        },
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="kurikulum"
      ref={ref}
      className="relative overflow-hidden bg-[oklch(0.94_0.04_75)] py-28 md:py-36"
    >
      {/* Torn top */}
      <div className="absolute -top-px left-0 right-0 h-12 bg-cream torn-bottom" />

      <div className="mx-auto max-w-[1400px] px-6 md:px-12">
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 text-[11px] uppercase tracking-[0.22em] text-terracotta">
              Yang akan kamu pelajari
            </p>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
              className="font-display text-3xl leading-[1.1] text-ink md:text-5xl"
            >
              Yang{" "}
              <span className="italic-display text-terracotta">
                nggak diajarkan
              </span>{" "}
              di kelas pra-nikah 2 jam.
            </motion.h2>
          </div>
          <p className="font-serif text-base italic text-ink/70">
            5 modul · ritme harianmu sendiri
          </p>
        </div>

        {/* Dotted timeline path */}
        <div className="relative mx-auto mt-16 hidden max-w-5xl md:block">
          <div className="dotted-path" />
          <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-between px-4">
            {modules.map((m) => (
              <div
                key={m.n}
                className="grid h-4 w-4 place-items-center rounded-full bg-amber-warm shadow-[0_0_0_4px_oklch(0.94_0.04_75)]"
              />
            ))}
          </div>
        </div>

        {/* Module cards */}
        <div className="cur-grid mt-12 grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-6 lg:grid-cols-5">
          {modules.map((m) => (
            <div
              key={m.n}
              className="cur-card group relative flex flex-col bg-paper p-6 shadow-[0_8px_28px_-14px_oklch(0_0_0/0.18)] transition-transform duration-500 hover:-translate-y-2"
              style={{ borderLeft: "3px solid var(--amber-warm)" }}
            >
              <div className="flex items-baseline justify-between">
                <span className="font-display text-5xl text-amber-warm">
                  {m.n}
                </span>
              </div>
              <h3 className="mt-4 font-display text-xl leading-tight text-ink">
                {m.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/70">
                {m.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
