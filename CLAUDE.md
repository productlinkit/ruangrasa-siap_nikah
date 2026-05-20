# CLAUDE.md

Panduan untuk Claude Code saat bekerja di repository ini.

## Project Overview

**Nama produk:** RuangRasa Siap Nikah — landing page untuk coach AI persiapan komunikasi pra-nikah (Bahasa Indonesia).

**Stack:** TanStack Start (SSR React framework) + Vite + React 19 + TypeScript + Tailwind CSS v4 + shadcn/ui (style: new-york). Deploy target: Cloudflare (lihat [wrangler.jsonc](wrangler.jsonc)). Package manager: **bun** (ada [bun.lockb](bun.lockb) dan [bunfig.toml](bunfig.toml)), tapi `package-lock.json` juga ada — gunakan `bun` untuk konsistensi kecuali user minta lain.

Project ini di-bootstrap dari Lovable — lihat catatan penting di [vite.config.ts](vite.config.ts) tentang `@lovable.dev/vite-tanstack-config` (jangan tambahkan plugin yang sudah di-bundle, akan break).

## Commands

```bash
bun run dev          # vite dev server
bun run build        # production build
bun run build:dev    # dev-mode build
bun run preview      # preview build
bun run lint         # eslint .
bun run format       # prettier --write .
```

Tidak ada script test — project ini landing page murni tanpa test suite.

## Struktur Direktori

```
src/
├── routes/              # TanStack Router file-based routes
│   ├── __root.tsx       # Root shell, meta tags, 404 component
│   └── index.tsx        # Landing page (composes semua section)
├── components/          # Section components landing page (Hero, Stats, FAQ, dst.)
│   └── ui/              # shadcn/ui primitives (button, card, dialog, dst.)
├── hooks/               # Custom React hooks (use-mobile)
├── lib/                 # utils.ts (cn() helper)
├── assets/              # Gambar (sn-*.jpg adalah aset RuangRasa)
├── styles.css           # Tailwind v4 + design tokens (theme inline)
├── router.tsx           # Router setup
└── routeTree.gen.ts     # Auto-generated, JANGAN edit manual
```

**Path alias:** `@/*` → `./src/*` (defined di [tsconfig.json](tsconfig.json) dan [components.json](components.json)).

## Design System

Design tokens di [src/styles.css](src/styles.css) — palette **terracotta + amber on cream**, vibe "premium magazine × counselor's office":

- Custom Tailwind classes: `bg-cream`, `bg-paper`, `text-ink`, `text-ink-soft`, `bg-terracotta`, `bg-amber-warm`, `bg-amber-soft`, `text-forest`, `bg-tape`
- Fonts: `font-display` (DM Serif Display), `font-serif` (Cormorant Garamond), `font-body` (Inter)
- shadcn/ui base color: slate, CSS variables enabled, icon library: lucide

Saat membuat section baru, ikuti pola visual existing components — gunakan token palette di atas, bukan hex/rgb literal.

## Konvensi

- **Komponen section** ditaruh di `src/components/<Name>.tsx` (PascalCase, named export), kemudian di-compose di [src/routes/index.tsx](src/routes/index.tsx).
- **shadcn primitives** ditambah via `npx shadcn@latest add <name>` — akan masuk ke `src/components/ui/`.
- **Routes**: TanStack Router file-based. Tambah file di `src/routes/`, plugin akan regenerate `routeTree.gen.ts`.
- **Forms**: pakai `react-hook-form` + `zod` + `@hookform/resolvers` (sudah terpasang).
- **Animations**: `framer-motion` dan `gsap` tersedia.
- **Icons**: `lucide-react`.
- **Notifications**: `sonner` (komponen `Toaster` di `ui/sonner.tsx`).
- **Bahasa konten:** Indonesia. Pertahankan tone copywriting yang sudah ada (hangat, reflektif, tidak pushy).

## Hal yang Perlu Diperhatikan

- **Jangan** modifikasi `src/routeTree.gen.ts` manual — di-generate oleh `@tanstack/router-plugin`.
- **Jangan** tambah `tanstackStart`, `viteReact`, `tailwindcss`, `tsConfigPaths`, atau `cloudflare` plugin manual di [vite.config.ts](vite.config.ts) — sudah di-bundle.
- Repo **bukan git repository** (tidak ada `.git`) — jika user butuh version control, tawarkan `git init` dulu sebelum commit.
- File assets pakai prefix `sn-` untuk aset brand RuangRasa Siap Nikah; aset lain (`mountains.jpg`, `horses.jpg`, dll) kemungkinan placeholder Lovable yang belum dipakai — verifikasi sebelum dihapus.
