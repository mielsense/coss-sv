import { svelte } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";
import { appAliases } from "./vite.aliases.js";

export default defineConfig({
  resolve: {
    alias: appAliases,
  },
  optimizeDeps: {
    noDiscovery: true,
  },
  plugins: [tailwindcss(), svelte({ configFile: false })],
  test: {
    browser: {
      enabled: true,
      headless: true,
      instances: [{ browser: "chromium" }],
      provider: playwright(),
      screenshotFailures: false,
    },
    expect: {
      requireAssertions: true,
    },
    include: ["src/**/*.browser.spec.ts"],
  },
});
