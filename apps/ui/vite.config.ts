import adapter from "@sveltejs/adapter-vercel";
import { sveltekit } from "@sveltejs/kit/vite";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";
import { mdsvex } from "mdsvex";
import { defineConfig } from "vitest/config";
import { highlightCode } from "./src/lib/site/highlight.js";

export default defineConfig({
  plugins: [
    tailwindcss(),
    sveltekit({
      adapter: adapter({ runtime: "nodejs22.x" }),
      alias: {
        $content: "content",
      },
      extensions: [".svelte", ".svx"],
      preprocess: [
        mdsvex({
          extensions: [".svx"],
          highlight: {
            highlighter: highlightCode,
          },
        }),
        vitePreprocess(),
      ],
    }),
  ],
  test: {
    environment: "node",
    expect: {
      requireAssertions: true,
    },
    include: ["src/**/*.test.ts", "tests/docs/**/*.test.ts"],
  },
});
