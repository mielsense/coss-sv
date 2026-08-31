import { svelte } from "@sveltejs/vite-plugin-svelte";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";
import { hugeiconsSubpathImports } from "../../scripts/vite/hugeicons-subpath-imports.js";
import { packageAliases } from "./aliases.js";

export default defineConfig({
  plugins: [hugeiconsSubpathImports(), svelte()],
  optimizeDeps: {
    exclude: ["@hugeicons/core-free-icons"],
    include: ["tailwind-merge"],
    noDiscovery: true,
  },
  resolve: {
    alias: packageAliases,
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
          fileParallelism: false,
          maxWorkers: 1,
          browser: {
            commands: {
              renderSlider: async ({ project }, value: number | readonly number[]) => {
                const [{ render }, { default: SliderRoot }] = await Promise.all([
                  project.vite.ssrLoadModule("svelte/server"),
                  project.vite.ssrLoadModule("/src/components/ui/slider/slider-root.svelte"),
                ]);

                return render(SliderRoot, {
                  props: {
                    "aria-label": Array.isArray(value) ? "Hydrated range" : "Hydrated scalar",
                    value,
                  },
                }).body;
              },
            },
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
          fileParallelism: false,
          include: ["tests/**/*.test.ts", "src/**/*.test.ts"],
          maxWorkers: 1,
        },
      },
    ],
  },
});
