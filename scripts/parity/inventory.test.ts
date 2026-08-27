import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";

import {
  applyStatusBaseline,
  collectReferenceInventory,
  collectTargetManifests,
  compareTargetManifests,
  createAllMissingBaseline,
  formatOutstandingReport,
  loadStatusBaseline,
  type ParityEntry,
  type ParityKind,
  type ParityStatus,
  renderInventory,
  targetManifestDefinitions,
  validateStatusBaseline,
  validateTargetManifestParity,
} from "./inventory.mts";

const inventory = collectReferenceInventory();
const baseline = loadStatusBaseline();
const entries = applyStatusBaseline(inventory.entries, baseline);

const promotedTargetFixtures: Array<{
  id: string;
  kind: ParityKind;
  status: Exclude<ParityStatus, "missing">;
  targetPath: string;
}> = [
  {
    id: "accordion",
    kind: "component",
    status: "implemented",
    targetPath: "packages/ui/src/components/ui/accordion",
  },
  {
    id: "p-accordion-1",
    kind: "particle",
    status: "reviewed",
    targetPath: "apps/ui/registry/default/particles/p-accordion-1.svelte",
  },
  {
    id: "components/accordion",
    kind: "doc",
    status: "approved",
    targetPath: "apps/ui/content/docs/components/accordion.md",
  },
];

function fixtureEntry(fixture: (typeof promotedTargetFixtures)[number]): ParityEntry {
  return {
    id: fixture.id,
    kind: fixture.kind,
    sourcePaths: [],
    status: fixture.status,
    targetPaths: [fixture.targetPath],
  };
}

function writeFixtureManifest(root: string, fixture: (typeof promotedTargetFixtures)[number]) {
  const definition = targetManifestDefinitions.find(({ kind }) => kind === fixture.kind);
  assert.ok(definition);
  const path = join(root, definition.path);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(
    path,
    `export const ${definition.exportName} = ${definition.wrapperName}([{ ${definition.idProperty}: ${JSON.stringify(fixture.id)} }]);\n`,
  );
}

function writeAuthoredTarget(root: string, fixture: (typeof promotedTargetFixtures)[number]) {
  const path = join(root, fixture.targetPath);
  if (fixture.kind === "component") {
    mkdirSync(path, { recursive: true });
    writeFileSync(join(path, "index.ts"), 'export { default as Root } from "./root.svelte";\n');
    writeFileSync(join(path, "root.svelte"), "<button>Accordion</button>\n");
    return;
  }
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, fixture.kind === "particle" ? "<div>Particle</div>\n" : "# Accordion\n");
}

test("locks the pinned reference inventory", () => {
  assert.equal(inventory.counts.components, 54);
  assert.equal(inventory.counts.docs, 64);
  assert.equal(inventory.counts.particles, 508);
  assert.equal(inventory.entries.length, 626);
});

test("keeps every kind and source identifier unique", () => {
  const keys = inventory.entries.map(({ id, kind }) => `${kind}:${id}`);
  assert.equal(new Set(keys).size, keys.length);
});

test("derives every particle component link from its source imports", () => {
  assert.deepEqual(inventory.particleComponents["p-accordion-4"], ["accordion", "button"]);
  assert.deepEqual(inventory.particleComponents["p-button-1"], ["button"]);

  for (const entry of inventory.entries.filter(({ kind }) => kind === "particle")) {
    assert.ok(
      inventory.particleComponents[entry.id]?.length,
      `${entry.id} must import at least one registry UI component`,
    );
  }
});

test("requires an explicit status for every source entry", () => {
  assert.doesNotThrow(() => validateStatusBaseline(inventory.entries, baseline));
  assert.equal(baseline.entries.length, 626);
  assert.equal(
    baseline.entries.filter(({ status }) =>
      ["missing", "implemented", "reviewed", "approved"].includes(status),
    ).length,
    baseline.entries.length,
  );

  assert.throws(
    () =>
      validateStatusBaseline(inventory.entries, {
        ...baseline,
        entries: baseline.entries.slice(1),
      }),
    /does not match the source inventory/,
  );
  assert.throws(
    () =>
      validateStatusBaseline(inventory.entries, {
        ...baseline,
        entries: [
          ...baseline.entries,
          { id: "invented-entry", kind: "particle", status: "approved" },
        ],
      }),
    /does not match the source inventory/,
  );
});

test("allows deliberate status promotion without weakening the checked-in schema", () => {
  const fixture = createAllMissingBaseline(inventory.entries);
  fixture.entries[0] = { ...fixture.entries[0], status: "implemented" };
  fixture.entries[1] = { ...fixture.entries[1], status: "reviewed" };
  fixture.entries[2] = { ...fixture.entries[2], status: "approved" };

  assert.doesNotThrow(() => validateStatusBaseline(inventory.entries, fixture));
  assert.deepEqual(
    applyStatusBaseline(inventory.entries, fixture)
      .slice(0, 3)
      .map(({ status }) => status),
    ["implemented", "reviewed", "approved"],
  );
});

test("reports every non-approved item by real status without truncation", () => {
  const fixture = createAllMissingBaseline(inventory.entries);
  fixture.entries[0] = { ...fixture.entries[0], status: "implemented" };
  fixture.entries[1] = { ...fixture.entries[1], status: "reviewed" };
  fixture.entries[2] = { ...fixture.entries[2], status: "approved" };
  const fixtureEntries = applyStatusBaseline(inventory.entries, fixture);
  const output = formatOutstandingReport(fixtureEntries);

  for (const entry of fixtureEntries.filter(({ status }) => status !== "approved")) {
    assert.match(output, new RegExp(`^\\- ${entry.kind}:${entry.id}$`, "m"));
  }

  assert.doesNotMatch(
    output,
    new RegExp(`^\\- ${fixtureEntries[2]?.kind}:${fixtureEntries[2]?.id}$`, "m"),
  );
  assert.match(output, /missing: 623/);
  assert.match(output, /implemented: 1/);
  assert.match(output, /reviewed: 1/);
  assert.match(output, /approved: 1/);
  assert.match(output, /total: 625/);
  assert.match(output, /## implemented \(1\)/);
  assert.match(output, /## reviewed \(1\)/);
});

test("reports the foundation all-missing fixture independently of promoted project state", () => {
  const fixtureEntries = applyStatusBaseline(
    inventory.entries,
    createAllMissingBaseline(inventory.entries),
  );
  const output = formatOutstandingReport(fixtureEntries);

  assert.match(output, /components: 54/);
  assert.match(output, /docs: 64/);
  assert.match(output, /particles: 508/);
  assert.match(output, /total: 626/);
});

test("never reports total zero while implemented or reviewed work remains", () => {
  const fixture = createAllMissingBaseline(inventory.entries);
  for (const entry of fixture.entries) entry.status = "approved";
  fixture.entries[0] = { ...fixture.entries[0], status: "implemented" };
  fixture.entries[1] = { ...fixture.entries[1], status: "reviewed" };
  const output = formatOutstandingReport(applyStatusBaseline(inventory.entries, fixture));

  assert.match(output, /missing: 0/);
  assert.match(output, /implemented: 1/);
  assert.match(output, /reviewed: 1/);
  assert.match(output, /total: 2/);
  assert.match(output, /## implemented \(1\)/);
  assert.match(output, /## reviewed \(1\)/);
});

test("reads only canonical exported manifests and compares exact target IDs", () => {
  const root = mkdtempSync(join(tmpdir(), "coss-sv-target-manifests-"));

  try {
    const sources = new Map([
      [
        "component",
        `const inert = [{ name: "inert-component" }];\nexport const registryUi = defineRegistryItems([{ name: "accordion" }, { name: "renamed-button" }]);\n`,
      ],
      [
        "particle",
        `export const registryParticles = defineRegistryItems([{ name: "p-accordion-1" }, { name: "p-accordion-1" }]);\n`,
      ],
      [
        "doc",
        `export const docsManifest = defineDocsManifest([{ id: "components/accordion" }]);\n`,
      ],
    ]);

    for (const definition of targetManifestDefinitions) {
      const source = sources.get(definition.kind);
      assert.ok(source);
      const path = join(root, definition.path);
      mkdirSync(dirname(path), { recursive: true });
      writeFileSync(path, source);
    }

    const manifests = collectTargetManifests(root);
    const expected = [
      { id: "accordion", kind: "component", status: "missing" },
      { id: "button", kind: "component", status: "missing" },
      { id: "p-accordion-1", kind: "particle", status: "missing" },
      { id: "components/accordion", kind: "doc", status: "missing" },
    ].map((entry) => ({ ...entry, sourcePaths: [], targetPaths: [] })) as typeof inventory.entries;
    const comparison = compareTargetManifests(expected, manifests);

    assert.deepEqual(comparison.component.missing, ["button"]);
    assert.deepEqual(comparison.component.extra, ["renamed-button"]);
    assert.deepEqual(comparison.particle.duplicates, ["p-accordion-1"]);
    assert.ok(!manifests.component.ids.includes("inert-component"));
    assert.throws(
      () => validateTargetManifestParity(expected, manifests),
      /Extra: component:renamed-button.*Duplicates: particle:p-accordion-1/s,
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("allows absent foundation manifests but requires membership before promotion", () => {
  const root = mkdtempSync(join(tmpdir(), "coss-sv-empty-manifests-"));

  try {
    const categoriesPath = join(root, "apps/ui/src/lib/site/categories.ts");
    mkdirSync(dirname(categoriesPath), { recursive: true });
    writeFileSync(
      categoriesPath,
      'export const componentCategories = [{ slug: "accordion", name: "Accordion" }];\n',
    );
    const manifests = collectTargetManifests(root);
    const expected = [
      {
        id: "accordion",
        kind: "component",
        sourcePaths: [],
        targetPaths: ["packages/ui/src/components/ui/accordion"],
        status: "missing",
      },
      {
        id: "components/accordion",
        kind: "doc",
        sourcePaths: [],
        targetPaths: ["apps/ui/content/docs/components/accordion.md"],
        status: "missing",
      },
    ] as typeof inventory.entries;

    assert.deepEqual(compareTargetManifests(expected, manifests).component.missing, ["accordion"]);
    assert.equal(manifests.doc.exists, false, "homepage categories are not the D1 docs manifest");
    assert.doesNotThrow(() => validateTargetManifestParity(expected, manifests));
    assert.throws(
      () => validateTargetManifestParity([{ ...expected[0], status: "implemented" }], manifests),
      /component:accordion is implemented but absent from apps\/ui\/registry\/registry-ui.ts/,
    );
    assert.throws(
      () => validateTargetManifestParity([{ ...expected[1], status: "reviewed" }], manifests),
      /doc:components\/accordion is reviewed but absent from apps\/ui\/src\/lib\/content\/docs-manifest.ts/,
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("requires manifest members to have real authored targets for every promoted kind", () => {
  for (const fixture of promotedTargetFixtures) {
    const root = mkdtempSync(join(tmpdir(), `coss-sv-${fixture.kind}-target-`));

    try {
      writeFixtureManifest(root, fixture);
      const target = join(root, fixture.targetPath);
      if (fixture.kind === "component") {
        mkdirSync(join(target, "dist"), { recursive: true });
        writeFileSync(join(target, ".gitkeep"), "");
        writeFileSync(join(target, "dist/generated.svelte"), "<p>generated</p>\n");
        writeFileSync(join(target, "index.ts"), "export {};\n");
        writeFileSync(join(target, "root.generated.svelte"), "<button>Generated</button>\n");
      } else if (fixture.kind === "particle") {
        mkdirSync(dirname(target), { recursive: true });
        writeFileSync(
          target,
          '<script lang="ts">const placeholderState = true;</script>\n<!-- TODO -->\n',
        );
      } else {
        mkdirSync(dirname(target), { recursive: true });
        writeFileSync(target, "<!-- TODO -->\n");
      }

      const manifests = collectTargetManifests(root);
      assert.throws(
        () => validateTargetManifestParity([fixtureEntry(fixture)], manifests, root),
        new RegExp(`${fixture.kind}:${fixture.id.replace("/", "\\/")}.*real authored target`, "s"),
      );

      writeAuthoredTarget(root, fixture);
      assert.doesNotThrow(() =>
        validateTargetManifestParity([fixtureEntry(fixture)], manifests, root),
      );
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  }
});

test("rejects canonical manifest symlinks and realpath escapes", () => {
  for (const definition of targetManifestDefinitions) {
    const root = mkdtempSync(join(tmpdir(), `coss-sv-${definition.kind}-manifest-link-`));
    const external = mkdtempSync(join(tmpdir(), `coss-sv-${definition.kind}-manifest-source-`));

    try {
      const canonical = join(root, definition.path);
      const outside = join(external, `${definition.kind}.ts`);
      mkdirSync(dirname(canonical), { recursive: true });
      writeFileSync(
        outside,
        `export const ${definition.exportName} = ${definition.wrapperName}([]);\n`,
      );
      symlinkSync(outside, canonical);
      assert.throws(
        () => collectTargetManifests(root),
        /must be a real canonical manifest inside the repository/,
      );
    } finally {
      rmSync(root, { recursive: true, force: true });
      rmSync(external, { recursive: true, force: true });
    }
  }

  const root = mkdtempSync(join(tmpdir(), "coss-sv-manifest-parent-link-"));
  const external = mkdtempSync(join(tmpdir(), "coss-sv-manifest-parent-source-"));
  try {
    mkdirSync(join(root, "apps/ui"), { recursive: true });
    writeFileSync(
      join(external, "registry-ui.ts"),
      "export const registryUi = defineRegistryItems([]);\n",
    );
    symlinkSync(external, join(root, "apps/ui/registry"));
    assert.throws(
      () => collectTargetManifests(root),
      /must be a real canonical manifest inside the repository/,
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
    rmSync(external, { recursive: true, force: true });
  }
});

test("rejects promoted targets that escape through a canonical-path symlink", () => {
  const fixture = promotedTargetFixtures[0];
  assert.ok(fixture);
  const root = mkdtempSync(join(tmpdir(), "coss-sv-target-link-"));
  const external = mkdtempSync(join(tmpdir(), "coss-sv-target-source-"));

  try {
    writeFixtureManifest(root, fixture);
    writeFileSync(join(external, "root.svelte"), "<button>Outside</button>\n");
    mkdirSync(dirname(join(root, fixture.targetPath)), { recursive: true });
    symlinkSync(external, join(root, fixture.targetPath));
    const manifests = collectTargetManifests(root);
    assert.throws(
      () => validateTargetManifestParity([fixtureEntry(fixture)], manifests, root),
      /target path escapes the repository through a symlink/,
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
    rmSync(external, { recursive: true, force: true });
  }
});

test("rejects real targets that are absent from each canonical manifest", () => {
  for (const fixture of promotedTargetFixtures) {
    const root = mkdtempSync(join(tmpdir(), `coss-sv-${fixture.kind}-membership-`));

    try {
      writeAuthoredTarget(root, fixture);
      const manifests = collectTargetManifests(root);
      assert.throws(
        () => validateTargetManifestParity([fixtureEntry(fixture)], manifests, root),
        new RegExp(
          `${fixture.kind}:${fixture.id.replace("/", "\\/")} is ${fixture.status} but absent from`,
        ),
      );
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  }
});

test("renders every source, target, status, and particle component map", () => {
  const output = renderInventory({ ...inventory, entries });

  for (const entry of entries) {
    for (const sourcePath of entry.sourcePaths) assert.ok(output.includes(sourcePath));
    for (const targetPath of entry.targetPaths) assert.ok(output.includes(targetPath));
    assert.ok(output.includes(entry.status));
  }

  assert.match(output, /`p-accordion-4`.*`accordion`, `button`/);
});
