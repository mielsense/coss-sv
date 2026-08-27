import { svelte } from "@sveltejs/vite-plugin-svelte";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [svelte()],
  optimizeDeps: {
    include: ["@shardsui/svelte", "tailwind-merge"],
  },
  test: {
    expect: {
      requireAssertions: true,
    },
    projects: [
      {
        extends: "./vite.config.ts",
        test: {
          name: "browser",
          browser: {
            enabled: true,
            headless: true,
            instances: [{ browser: "chromium" }],
            provider: playwright(),
            screenshotFailures: false,
          },
          include: ["tests/**/*.browser.test.ts", "src/**/*.browser.test.ts"],
          setupFiles: ["./tests/setup.browser.ts"],
        },
      },
      {
        extends: "./vite.config.ts",
        test: {
          name: "ssr",
          environment: "node",
          exclude: ["tests/**/*.browser.test.ts", "src/**/*.browser.test.ts"],
          include: ["tests/**/*.test.ts", "src/**/*.test.ts"],
        },
      },
    ],
  },
});
