import { resolve } from "node:path";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      $lib: resolve(import.meta.dirname, "../../src/lib"),
    },
  },
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
    include: ["tests/docs/d5-controls.browser.spec.ts"],
  },
});
