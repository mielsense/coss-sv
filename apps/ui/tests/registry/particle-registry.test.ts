import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { registryLibs } from "../../registry/registry-libs.js";
import { registryParticles } from "../../registry/registry-particles.js";
import { registrySupport } from "../../registry/registry-support.js";
import { appRoot } from "../../scripts/registry/lib.mjs";

type OwnershipFile = {
  ownership: Array<{ implementationLane: string; particle: string }>;
};

type GeneratedRegistryItem = {
  dependencies?: string[] | null;
  files: Array<{ content: string }>;
  registryDependencies?: string[] | null;
};

describe("documentation particle registry", () => {
  test("installs the date formatter at the alias imported by date-picker particles", async () => {
    const dateFormat = registryLibs.find(({ name }) => name === "date-format");
    expect(dateFormat).toEqual(
      expect.objectContaining({
        files: [
          expect.objectContaining({
            path: "registry/default/lib/date-format.ts",
            type: "registry:lib",
          }),
        ],
        type: "registry:lib",
      }),
    );

    for (const id of [
      "p-date-picker-1",
      "p-date-picker-3",
      "p-date-picker-4",
      "p-date-picker-6",
      "p-date-picker-8",
    ]) {
      const source = await readFile(
        resolve(appRoot, `registry/default/particles/${id}.svelte`),
        "utf8",
      );
      expect(source, id).toContain('from "../lib/date-format.js"');
      expect(registryParticles.find(({ name }) => name === id)?.registryDependencies, id).toContain(
        "local:date-format",
      );
    }
  });

  test("publishes particles with consumer-local component and helper imports", async () => {
    const generated = async (id: string) =>
      JSON.parse(
        await readFile(resolve(appRoot, `static/r/${id}.json`), "utf8"),
      ) as GeneratedRegistryItem;

    const button = await generated("p-button-1");
    expect(button.files[0]?.content).toContain('from "$COMPONENTS$/ui/button/index.js"');
    expect(button.registryDependencies).toContain("./button.json");

    const datePicker = await generated("p-date-picker-1");
    expect(datePicker.files[0]?.content).toContain('from "$LIB$/date-format.js"');
    expect(datePicker.files[0]?.content).toContain('from "$LIB$/hugeicons-icon.svelte"');
    expect(datePicker.files[0]?.content).toContain('from "$COMPONENTS$/ui/calendar/index.js"');
    expect(datePicker.files[0]?.content).not.toContain("@coss-sv/ui");
    expect(datePicker.registryDependencies).toEqual(
      expect.arrayContaining([
        "./button.json",
        "./calendar.json",
        "./date-format.json",
        "./hugeicons-icon.json",
        "./particle-metadata.json",
        "./popover.json",
      ]),
    );
    expect(datePicker.dependencies ?? []).not.toEqual(
      expect.arrayContaining(["@coss-sv/ui", "@hugeicons/svelte@1.1.5"]),
    );
  });

  test("publishes the approved D4, D5, D7, D8, and D9 inventory with its metadata support file", async () => {
    const ownership = JSON.parse(
      await readFile(resolve(appRoot, "../../docs/porting/docs-ownership.json"), "utf8"),
    ) as OwnershipFile;
    const expectedIds = ownership.ownership
      .filter(({ implementationLane }) =>
        ["D4", "D5", "D7", "D8", "D9"].includes(implementationLane),
      )
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
    expect(particles).toHaveLength(320);
    expect(particles.map(({ name }) => name).sort()).toEqual(expectedIds);
    for (const particle of particles) {
      expect(particle.files, particle.name).toEqual([
        {
          path: `registry/default/particles/${particle.name}.svelte`,
          type: "registry:block",
        },
      ]);
      expect(particle.registryDependencies, particle.name).toContain("local:particle-metadata");
      expect(particle.dependencies ?? [], particle.name).not.toEqual(
        expect.arrayContaining(["@coss-sv/ui", "@hugeicons/svelte@1.1.5"]),
      );

      const generated = JSON.parse(
        await readFile(resolve(appRoot, `static/r/${particle.name}.json`), "utf8"),
      ) as GeneratedRegistryItem;
      expect(generated.files[0]?.content, particle.name).not.toMatch(
        /@coss-sv\/ui|@hugeicons\/svelte/,
      );
    }
  });
});
