import { motion } from "framer-motion";
import ctaJoyful from "@/assets/sn-cta-joyful.jpg";
import { openChatWidget } from "@/lib/chat-events";

export function CTA() {
  return (
    <section className="relative overflow-hidden bg-cream pb-0 pt-0">
      <div className="relative">
        <img
          src={ctaJoyful}
          alt="Pasangan tertawa hangat di pagi hari sambil membaca jurnal bersama"
          loading="lazy"
          width={1600}
          height={1024}
          className="h-[70vh] w-full object-cover md:h-[85vh]"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, oklch(0.46 0.115 55 / 0.35) 0%, oklch(0.46 0.115 55 / 0.55) 60%, oklch(0.46 0.115 55 / 0.75) 100%)",
          }}
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-[11px] uppercase tracking-[0.22em] text-amber-warm"
          >
            Sebelum janji diucapkan
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.15 }}
            className="mt-6 max-w-4xl font-display text-3xl leading-[1.05] text-cream md:text-6xl"
            style={{ textShadow: "0 2px 30px oklch(0 0 0 / 0.3)" }}
          >
            Mari pelajari satu skill kecil hari ini,{" "}
            <span className="italic-display">
              yang akan jadi fondasi seumur hidup.
            </span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-10"
          >
            <a
              href="#assessment"
              onClick={(e) => {
                e.preventDefault();
                openChatWidget();
              }}
              className="pill-btn"
            >
              Mulai Assessment Gratis
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
