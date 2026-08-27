import { fileURLToPath } from "node:url";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [svelte()],
  optimizeDeps: {
    include: ["@shardsui/svelte", "tailwind-merge"],
  },
  resolve: {
    alias: {
      $lib: fileURLToPath(new URL("./src/lib", import.meta.url)),
    },
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
          include: ["tests/**/*.test.ts", "src/**/*.test.ts"],
        },
      },
    ],
  },
});
