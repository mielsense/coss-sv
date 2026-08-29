import { resolve } from "node:path";
import adapter from "@sveltejs/adapter-vercel";
import { sveltekit } from "@sveltejs/kit/vite";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";
import { mdsvex } from "mdsvex";
import { defineConfig } from "vitest/config";
import {
  documentationComponents,
  documentationHeadings,
  modernizeDocumentationOutput,
} from "./src/lib/content/preprocess.js";
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
        documentationComponents(),
        mdsvex({
          extensions: [".svx"],
          remarkPlugins: [documentationHeadings],
          highlight: {
            highlighter: highlightCode,
          },
          layout: resolve("src/lib/content/DocumentationLayout.svelte"),
          layoutPropForwarding: "runes",
        }),
        modernizeDocumentationOutput(),
        vitePreprocess(),
      ],
    }),
  ],
  test: {
    environment: "node",
    expect: {
      requireAssertions: true,
    },
    include: [
      "src/**/*.test.ts",
      "tests/content/**/*.test.ts",
      "tests/docs/**/*.test.ts",
      "tests/particles/**/*.test.ts",
    ],
  },
});
