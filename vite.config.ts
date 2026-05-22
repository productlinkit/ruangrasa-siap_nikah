// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Allow Vite preview to accept requests for the project's host when running in container
export default defineConfig({
	vite: {
		preview: {
			// Add the hostname used in the container/runtime so Vite doesn't block the request
			allowedHosts: ["siapnikah.ruangrasa.co"],
		},
	},
});
