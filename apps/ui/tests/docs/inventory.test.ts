import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { describe, expect, test } from "vitest";
import {
  collectDocsInventory,
  docsOwnershipPath,
  serializeDocsOwnership,
} from "../../scripts/docs/inventory.mts";

const repositoryRoot = fileURLToPath(new URL("../../../..", import.meta.url));
const referenceRoot = `${repositoryRoot}/reference`;

describe("documentation source inventory", () => {
  test("locks the pinned page, component, and particle counts", () => {
    const inventory = collectDocsInventory({ referenceRoot, repositoryRoot });

    expect(inventory.counts).toEqual({
      componentPages: 55,
      hookPages: 2,
      particles: 508,
      registryComponents: 54,
      rootPages: 7,
    });
  });

  test("assigns every particle to one implementation lane", () => {
    const inventory = collectDocsInventory({ referenceRoot, repositoryRoot });
    const particles = inventory.ownership.map(({ particle }) => particle);

    expect(new Set(particles).size).toBe(508);
    expect(inventory.ownership).toHaveLength(508);
    expect(
      inventory.ownership.every(({ implementationLane }) =>
        /^D(?:4|5|6|7|8|9|10)$/.test(implementationLane),
      ),
    ).toBe(true);
  });

  test("uses explicit page references before filename-prefix fallback", () => {
    const inventory = collectDocsInventory({ referenceRoot, repositoryRoot });
    const navigation = inventory.ownership.find(({ particle }) => particle === "p-navigation-1");
    const unreferencedButton = inventory.ownership.find(
      ({ particle }) => particle === "p-button-40",
    );

    expect(navigation).toMatchObject({
      consumingPages: ["components/segmented-control"],
      implementationLane: "D9",
      primaryPage: "components/segmented-control",
    });
    expect(unreferencedButton).toMatchObject({
      implementationLane: "D5",
      primaryPage: "components/button",
    });
  });

  test("records actual component imports and canonical source and target paths", () => {
    const inventory = collectDocsInventory({ referenceRoot, repositoryRoot });
    const particle = inventory.ownership.find(({ particle }) => particle === "p-accordion-4");

    expect(particle).toEqual({
      componentImports: ["accordion", "button"],
      consumingPages: ["components/accordion"],
      implementationLane: "D4",
      particle: "p-accordion-4",
      primaryPage: "components/accordion",
      sourcePath: "reference/apps/ui/registry/default/particles/p-accordion-4.tsx",
      targetPath: "apps/ui/registry/default/particles/p-accordion-4.svelte",
    });
  });

  test("keeps the checked-in ownership map byte-current", async () => {
    const inventory = collectDocsInventory({ referenceRoot, repositoryRoot });
    const checkedIn = await readFile(docsOwnershipPath(repositoryRoot), "utf8");

    expect(checkedIn).toBe(serializeDocsOwnership(inventory));
  });
});
