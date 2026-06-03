import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import logo from "@/assets/sn-logo.png";
import { openChatWidget } from "@/lib/chat-events";

const links = [
  { label: "Realita", href: "#realita" },
  { label: "Kurikulum", href: "#kurikulum" },
  { label: "Cara Kerja", href: "#cara-kerja" },
  { label: "Assessment", href: "#assessment" },
  { label: "FAQ", href: "#faq" },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
        className="absolute top-6 right-6 left-6 z-30 flex items-center justify-between md:top-10 md:right-12 md:left-12"
      >
        <a
          href="#"
          className="flex items-center gap-2.5 font-display text-2xl text-ink md:text-3xl"
          style={{ fontFamily: "'DM Serif Display', serif" }}
        >
          <img
            src={logo}
            alt="Logo RuangRasa Siap Nikah"
            className="h-9 w-9 md:h-11 md:w-11"
          />
          RuangRasa<span className="text-terracotta">.</span>
        </a>

        <ul className="hidden items-center gap-7 text-[11px] uppercase tracking-[0.18em] text-ink md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="link-underline">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Burger button (mobile) */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Tutup menu" : "Buka menu"}
          aria-expanded={open}
          className="relative z-50 flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 bg-cream/80 text-ink backdrop-blur-sm transition-colors hover:border-terracotta hover:text-terracotta md:hidden"
        >
          <AnimatePresence mode="wait" initial={false}>
            {open ? (
              <motion.span
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="h-5 w-5" />
              </motion.span>
            ) : (
              <motion.span
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu className="h-5 w-5" />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </motion.nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 flex flex-col bg-cream/95 backdrop-blur-md md:hidden"
          >
            {/* Close button inside overlay */}
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Tutup menu"
              className="absolute top-6 right-6 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 bg-paper text-ink shadow-sm transition-colors hover:border-terracotta hover:text-terracotta"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex-1 overflow-y-auto px-8 pt-28 pb-12">
              <p className="mb-6 text-[11px] uppercase tracking-[0.22em] text-ink/50">
                Menu
              </p>
              <ul className="flex flex-col gap-1">
                {links.map((l, i) => (
                  <motion.li
                    key={l.href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + i * 0.05, duration: 0.3 }}
                    className="border-b border-ink/10"
                  >
                    <a
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="block py-5 font-display text-3xl text-ink transition-colors hover:text-terracotta"
                      style={{ fontFamily: "'DM Serif Display', serif" }}
                    >
                      {l.label}
                    </a>
                  </motion.li>
                ))}
              </ul>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.3 }}
                className="mt-10"
              >
                <a
                  href="#waitlist"
                  onClick={(e) => {
                    e.preventDefault();
                    setOpen(false);
                    openChatWidget();
                  }}
                  className="inline-flex items-center justify-center rounded-full bg-terracotta px-6 py-3 text-sm font-medium tracking-wide text-cream shadow-lg shadow-terracotta/20 transition-transform active:scale-95"
                >
                  Daftar Waitlist
                </a>
                <p className="mt-6 text-xs leading-relaxed text-ink-soft">
                  RuangRasa Siap Nikah — coach AI untuk persiapan komunikasi & emosional sebelum hari H.
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
