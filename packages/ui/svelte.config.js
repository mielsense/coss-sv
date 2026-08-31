import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { packageAliases } from "./aliases.js";

/** @type {import("@sveltejs/kit").Config} */
const config = {
  kit: {
    alias: packageAliases,
  },
  preprocess: [vitePreprocess()],
  compilerOptions: {
    runes: true,
  },
};

export default config;
