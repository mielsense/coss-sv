import { svelte } from "@sveltejs/vite-plugin-svelte";
import { svelteTesting } from "@testing-library/svelte/vite";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [svelte({ configFile: false }), svelteTesting({ resolveBrowser: false })],
  optimizeDeps: {
    include: ["@testing-library/svelte", "@testing-library/svelte > @testing-library/dom"],
    noDiscovery: true,
  },
  test: {
    expect: {
      requireAssertions: true,
    },
    projects: [
      {
        extends: "./vitest.workspace.ts",
        test: {
          name: "node",
          environment: "node",
          include: ["tests/node/**/*.test.ts"],
        },
      },
      {
        extends: "./vitest.workspace.ts",
        test: {
          name: "chromium",
          browser: {
            enabled: true,
            headless: true,
            instances: [{ browser: "chromium" }],
            provider: playwright(),
            screenshotFailures: false,
          },
          include: ["tests/browser/**/*.browser.test.ts"],
          setupFiles: ["./tests/browser/setup.ts"],
        },
      },
    ],
  },
});
