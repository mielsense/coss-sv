import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { createRegistry, serializeRegistry, validateRegistry } from "../../registry/registry.js";
import { registryLibs } from "../../registry/registry-libs.js";
import { registryParticles } from "../../registry/registry-particles.js";
import { registryUi } from "../../registry/registry-ui.js";
import { appRoot } from "./lib.mjs";

export async function registrySource(): Promise<string> {
  const registry = createRegistry([...registryLibs, ...registryUi, ...registryParticles]);
  await validateRegistry(registry);
  return serializeRegistry(registry);
}

const outputPath = resolve(appRoot, "registry.json");

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  await writeFile(outputPath, await registrySource(), "utf8");
  console.log(`Wrote ${outputPath}`);
}
