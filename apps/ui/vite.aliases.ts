import { fileURLToPath } from "node:url";

export const appAliases = {
  "@": fileURLToPath(new URL("./src/lib", import.meta.url)),
  $content: fileURLToPath(new URL("./content", import.meta.url)),
  $particles: fileURLToPath(new URL("./registry/default/particles", import.meta.url)),
} as const;
