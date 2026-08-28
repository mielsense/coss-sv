import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { registryParticles } from "../../registry/registry-particles.js";
import { registrySupport } from "../../registry/registry-support.js";
import { appRoot } from "../../scripts/registry/lib.mjs";

type OwnershipFile = {
  ownership: Array<{ implementationLane: string; particle: string }>;
};

describe("documentation particle registry", () => {
  test("publishes the D4 inventory and its metadata support file", async () => {
    const ownership = JSON.parse(
      await readFile(resolve(appRoot, "../../docs/porting/docs-ownership.json"), "utf8"),
    ) as OwnershipFile;
    const expectedIds = ownership.ownership
      .filter(({ implementationLane }) => implementationLane === "D4")
      .map(({ particle }) => particle)
      .sort();

    const support = registrySupport.find(({ name }) => name === "particle-metadata");
    const particles = registryParticles;

    expect(support).toEqual(
      expect.objectContaining({
        files: [
          expect.objectContaining({
            path: "src/lib/registry/particle-metadata.ts",
            target: "src/lib/registry/particle-metadata.ts",
            type: "registry:file",
          }),
        ],
        type: "registry:file",
      }),
    );
    expect(particles).toHaveLength(38);
    expect(particles.map(({ name }) => name).sort()).toEqual(expectedIds);
    for (const particle of particles) {
      expect(particle.files, particle.name).toEqual([
        {
          path: `registry/default/particles/${particle.name}.svelte`,
          type: "registry:block",
        },
      ]);
      expect(particle.registryDependencies, particle.name).toEqual(["local:particle-metadata"]);
    }
  });
});
