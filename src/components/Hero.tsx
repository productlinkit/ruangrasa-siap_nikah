import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import heroCouple from "@/assets/sn-hero-couple.jpg";
import { openChatWidget } from "@/lib/chat-events";

export function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const el = titleRef.current;
      if (el) {
        // Animate words instead of chars (longer copy)
        const words = el.querySelectorAll(".word");
        gsap.fromTo(
          words,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.1,
            stagger: 0.08,
            ease: "power3.out",
            delay: 0.3,
          },
        );
      }
      gsap.to(imgRef.current, {
        yPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: imgRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-cream">
      {/* Soft amber radial wash */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse at 80% 10%, oklch(0.94 0.04 75) 0%, oklch(0.96 0.012 80) 55%)",
        }}
      />

      <div className="mx-auto grid min-h-screen max-w-[1400px] grid-cols-12 gap-6 px-6 pt-32 pb-20 md:px-12 md:pt-36">
        {/* Left — copy */}
        <div className="col-span-12 md:col-span-7">
          <p className="mb-6 text-[11px] uppercase tracking-[0.22em] text-terracotta">
            RuangRasa Siap Nikah
          </p>

          <h1
            ref={titleRef}
            className="font-display text-[8vw] leading-[1.02] text-ink md:text-[5.4vw]"
            style={{ fontWeight: 400 }}
          >
            <span className="word inline-block">Bukan</span>{" "}
            <span className="word inline-block">soal</span>{" "}
            <span className="word inline-block">menemukan</span>{" "}
            <span className="word inline-block">orang</span>{" "}
            <span className="word inline-block">yang</span>{" "}
            <span className="word inline-block">tepat.</span>
            <br />
            <span className="word inline-block italic-display text-terracotta">
              Tapi
            </span>{" "}
            <span className="word inline-block italic-display text-terracotta">
              jadi
            </span>{" "}
            <span className="word inline-block italic-display text-terracotta">
              pasangan
            </span>{" "}
            <span className="word inline-block italic-display text-terracotta">
              yang
            </span>{" "}
            <span className="word inline-block italic-display text-terracotta">
              tepat.
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.8 }}
            className="mt-10 max-w-xl font-body text-base leading-relaxed text-ink/80 md:text-lg"
          >
            <span className="font-display italic text-terracotta">
              RuangRasa Siap Nikah
            </span>{" "}
            adalah coach AI yang bantu kamu membangun keterampilan komunikasi
            dan emosional, sebelum masalah datang, bukan sesudah.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.8 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <a
              href="#assessment"
              onClick={(e) => {
                e.preventDefault();
                openChatWidget();
              }}
              className="pill-btn"
            >
              Mulai Persiapanku
            </a>
            <a href="#kurikulum" className="pill-btn-ghost">
              Lihat Kurikulumnya
            </a>
          </motion.div>
        </div>

        {/* Right — photo */}
        <motion.div
          ref={imgRef}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, ease: [0.2, 0.8, 0.2, 1] }}
          className="col-span-12 mt-8 md:col-span-5 md:mt-0"
        >
          <div className="relative">
            <div className="overflow-hidden rounded-sm shadow-[0_30px_80px_-30px_oklch(0_0_0/0.45)]">
              <img
                src={heroCouple}
                alt="Pasangan Indonesia berbicara di kafe"
                width={1080}
                height={1620}
                className="aspect-[3/4] w-full object-cover"
              />
            </div>

            <motion.div
              initial={{ opacity: 0, x: -20, rotate: -4 }}
              animate={{ opacity: 1, x: 0, rotate: -4 }}
              transition={{ delay: 2.2, duration: 0.8 }}
              className="note absolute -left-6 top-12 hidden w-48 md:block"
              style={{ ["--r" as string]: "-4deg" }}
            >
              <p className="text-[10px] uppercase tracking-[0.18em] text-terracotta">
                Hari ke 1
              </p>
              <p className="mt-2 font-display text-sm italic text-ink">
                "Aku belajar bilang 'aku marah' tanpa membuatnya merasa salah."
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20, rotate: 5 }}
              animate={{ opacity: 1, x: 0, rotate: 5 }}
              transition={{ delay: 2.4, duration: 0.8 }}
              className="note absolute -right-4 bottom-20 hidden w-44 md:block"
              style={{ ["--r" as string]: "5deg" }}
            >
              <p className="text-[10px] uppercase tracking-[0.18em] text-terracotta">
                Catatan
              </p>
              <p className="mt-2 font-display text-sm italic text-ink">
                7 menit. Hasilnya bisa kamu pakai seumur hidup.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Torn bottom transition into amber-soft */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-[oklch(0.94_0.04_75)] torn-top" />
    </section>
  );
}
