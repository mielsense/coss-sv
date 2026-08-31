import { svelte } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";
import { appAliases } from "../../vite.aliases.js";
export default defineConfig({
  optimizeDeps: {
    noDiscovery: true,
  },
  plugins: [tailwindcss(), svelte({ configFile: false })],
  resolve: { alias: appAliases },
  test: {
    browser: {
      enabled: true,
      headless: true,
      instances: [{ browser: "chromium" }],
      provider: playwright(),
      screenshotFailures: false,
    },
    expect: { requireAssertions: true },
    include: ["tests/docs/d8-selection.browser.spec.ts"],
  },
});
