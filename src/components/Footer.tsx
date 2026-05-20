import logo from "@/assets/sn-logo.png";

export function Footer() {
  return (
    <footer className="bg-cream py-16 border-t border-ink/10">
      <div className="mx-auto grid max-w-[1400px] grid-cols-12 gap-8 px-6 md:px-12">
        <div className="col-span-12 md:col-span-5">
          <a
            href="#"
            className="flex items-center gap-3 font-display text-3xl text-ink"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            <img
              src={logo}
              alt="Logo RuangRasa Siap Nikah"
              className="h-12 w-12"
            />
            RuangRasa<span className="text-terracotta">.</span>
          </a>
          <p className="mt-4 max-w-sm font-serif text-base italic text-ink/70">
            Coach AI untuk persiapan komunikasi & emosional sebelum pernikahan.
          </p>
        </div>

        <div className="col-span-6 md:col-span-3">
          <p className="text-[11px] uppercase tracking-[0.18em] text-terracotta">
            Produk
          </p>
          <ul className="mt-4 space-y-2 text-sm text-ink/85">
            <li><a href="#assessment" className="link-underline">Assessment Gratis</a></li>
            <li><a href="#kurikulum" className="link-underline">Kurikulum</a></li>
            <li><a href="#kontak" className="link-underline">Daftar Awal</a></li>
          </ul>
        </div>

        <div className="col-span-6 md:col-span-2">
          <p className="text-[11px] uppercase tracking-[0.18em] text-terracotta">
            Kontak
          </p>
          <ul className="mt-4 space-y-2 text-sm text-ink/85">
            <li>halo@ruangrasa.id</li>
            <li>Jakarta, Indonesia</li>
          </ul>
        </div>

        <div className="col-span-12 md:col-span-2">
          <p className="text-[11px] uppercase tracking-[0.18em] text-terracotta">
            Sosial
          </p>
          <ul className="mt-4 space-y-2 text-sm text-ink/85">
            <li><a href="#" className="link-underline">Instagram</a></li>
            <li><a href="#" className="link-underline">TikTok</a></li>
          </ul>
        </div>

        <div className="col-span-12 mt-8 flex flex-col justify-between gap-4 border-t border-ink/15 pt-6 text-[11px] uppercase tracking-[0.18em] text-ink/50 md:flex-row">
          <p>© {new Date().getFullYear()} RuangRasa Siap Nikah</p>
          <p>Dirancang dengan rasa, untuk hubungan yang siap.</p>
        </div>
      </div>
    </footer>
  );
}
