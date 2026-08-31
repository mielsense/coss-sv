import { fileURLToPath } from "node:url";

export const packageAliases = {
  "@": fileURLToPath(new URL("./src/lib", import.meta.url)),
};
