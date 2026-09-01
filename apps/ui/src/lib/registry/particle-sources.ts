import type { HighlightedSource } from "../code/highlight.js";

type ParticleSourceModule = { default: HighlightedSource };
type ParticleSourceLoader = () => Promise<ParticleSourceModule>;

const sourceModules = import.meta.glob<ParticleSourceModule>(
  "../../../registry/default/particles/*.svelte",
  { query: "?coss-particle-source" },
);

function particleName(modulePath: string): string {
  const filename = modulePath.split("/").at(-1);
  if (!filename?.endsWith(".svelte")) {
    throw new Error(`Particle source path is not a Svelte file: ${modulePath}`);
  }
  return filename.slice(0, -".svelte".length);
}

export const particleSourceLoaders: Readonly<Record<string, ParticleSourceLoader>> = Object.freeze(
  Object.fromEntries(
    Object.entries(sourceModules).map(([path, load]) => [particleName(path), load]),
  ),
);

export async function getParticleSource(name: string): Promise<HighlightedSource> {
  const load = particleSourceLoaders[name];
  if (!load) throw new Error(`Particle source ${name} is unavailable.`);
  return (await load()).default;
}
