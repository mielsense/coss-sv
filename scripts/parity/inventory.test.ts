import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join } from "node:path";
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
    targetPath: "apps/ui/content/docs/components/accordion.svx",
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
        targetPaths: ["apps/ui/content/docs/components/accordion.svx"],
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
        writeFileSync(target, "<div>TODO</div>\n");
      } else {
        mkdirSync(dirname(target), { recursive: true });
        writeFileSync(target, "<p>TODO</p>\n");
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

test("rejects each inert component source laundering shape independently", () => {
  const fixture = promotedTargetFixtures[0];
  assert.ok(fixture);
  const cases = [
    {
      files: {
        "index.ts": "export const TODO = true;\n",
        "state.ts": "const placeholderState = true;\n",
      },
      name: "standalone TypeScript helpers",
    },
    {
      files: {
        "root.svelte": '<script lang="ts">const placeholderState = true;</script>\n',
      },
      name: "script-only root",
    },
    {
      files: { "root_generated.svelte": "<button>Generated</button>\n" },
      name: "underscore generated root",
    },
    {
      files: { "root.svelte": "<div>TODO</div>\n" },
      name: "visible placeholder root",
    },
  ] as const;

  for (const fixtureCase of cases) {
    const root = mkdtempSync(join(tmpdir(), "coss-sv-inert-component-"));
    try {
      writeFixtureManifest(root, fixture);
      const target = join(root, fixture.targetPath);
      mkdirSync(target, { recursive: true });
      for (const [name, source] of Object.entries(fixtureCase.files)) {
        writeFileSync(join(target, name), source);
      }
      const manifests = collectTargetManifests(root);
      assert.throws(
        () => validateTargetManifestParity([fixtureEntry(fixture)], manifests, root),
        /component:accordion.*not a real authored target/s,
        fixtureCase.name,
      );
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  }
});

test("accepts the compound-component root naming convention", () => {
  const fixture = promotedTargetFixtures[0];
  assert.ok(fixture);
  const root = mkdtempSync(join(tmpdir(), "coss-sv-compound-root-"));
  try {
    writeFixtureManifest(root, fixture);
    const target = join(root, fixture.targetPath);
    mkdirSync(target, { recursive: true });
    writeFileSync(join(target, `${fixture.id}-root.svelte`), "<button>Accordion</button>\n");
    const manifests = collectTargetManifests(root);
    assert.doesNotThrow(() =>
      validateTargetManifestParity([fixtureEntry(fixture)], manifests, root),
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("accepts a provider-rooted component naming convention", () => {
  const sourceFixture = promotedTargetFixtures[0];
  assert.ok(sourceFixture);
  const fixture = {
    ...sourceFixture,
    id: "toast",
    targetPath: "packages/ui/src/components/ui/toast",
  };
  const root = mkdtempSync(join(tmpdir(), "coss-sv-provider-root-"));
  try {
    writeFixtureManifest(root, fixture);
    const target = join(root, fixture.targetPath);
    mkdirSync(target, { recursive: true });
    writeFileSync(join(target, "toast-provider.svelte"), "<section>Toast provider</section>\n");
    const manifests = collectTargetManifests(root);
    assert.doesNotThrow(() =>
      validateTargetManifestParity([fixtureEntry(fixture)], manifests, root),
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("accepts an authored component that exposes a primitive Root from its barrel", () => {
  const fixture = promotedTargetFixtures[0];
  assert.ok(fixture);
  const root = mkdtempSync(join(tmpdir(), "coss-sv-primitive-root-"));
  try {
    writeFixtureManifest(root, fixture);
    const target = join(root, fixture.targetPath);
    mkdirSync(target, { recursive: true });
    writeFileSync(
      join(target, "index.ts"),
      'import { Accordion as Primitive } from "@shardsui/svelte";\nexport const Root = Primitive.Root;\n',
    );
    writeFileSync(join(target, "accordion-panel.svelte"), "<section>Accordion panel</section>\n");
    const manifests = collectTargetManifests(root);
    assert.doesNotThrow(() =>
      validateTargetManifestParity([fixtureEntry(fixture)], manifests, root),
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("rejects inert Svelte expressions without rejecting authored dynamic output", () => {
  const fixtures = promotedTargetFixtures.filter(
    (
      fixture,
    ): fixture is (typeof promotedTargetFixtures)[number] & {
      kind: "component" | "particle";
    } => fixture.kind === "component" || fixture.kind === "particle",
  );
  const inertSources = [
    "<div>TODO {undefined}</div>\n",
    "<div>TODO {false}</div>\n",
    "<div>TODO {null}</div>\n",
    "TODO {false}\n",
    "TODO {null}\n",
    "<div>{undefined}</div>\n",
    "<div>{false}</div>\n",
    "<div>{null}</div>\n",
    '<div>{""}</div>\n',
    "{@html ''}\n",
    "{@html undefined}\n",
    "{@html false}\n",
    "{@html null}\n",
    '{@html "<p>TODO</p>"}\n',
    '<div>{@html ""}</div>\n',
    "{#snippet empty()}{/snippet}\n",
    "{#snippet empty()}{/snippet}\n{@render empty()}\n",
    "{#snippet inert()}<div>{false}</div>{/snippet}\n{@render inert()}\n",
    "{false && 'Ready'}\n",
    "{null ?? ''}\n",
    "{undefined?.value}\n",
    "{@render undefined?.()}\n",
    "{false ? 'Ready' : ''}\n",
    "<script>const value = false;</script>\n{value}\n",
    "<script>const value = '';</script>\n{value}\n",
    "{#if false}<button>Ready</button>{/if}\n",
    "{#each [] as item}<button>{item}</button>{/each}\n",
    "<div>{#snippet nestedEmpty()}{/snippet}{@render nestedEmpty()}</div>\n",
    '{@html "<div></div>"}\n',
    '{@html "<!-- parity placeholder -->"}\n',
    "<svelte:head><title>Ready</title></svelte:head>\n",
    '<button hidden aria-label="Ready"></button>\n',
    '<button inert aria-label="Ready"></button>\n',
    '<button aria-hidden="true" aria-label="Ready"></button>\n',
    '<input type="hidden" value="Ready" />\n',
    "{(1 > 2) && 'Ready'}\n",
    "<script>const values = [];</script>\n{values.length > 0 && 'Ready'}\n",
    "<script module>const value = false;</script>\n{value}\n",
    '<div style="display: none"><button>Ready</button></div>\n',
    "{@html \"<script>document.title = 'Ready'</script>\"}\n",
    '<script lang="ts">const value = false as const;</script>\n{value}\n',
    "<script>const { value } = { value: false };</script>\n{value}\n",
    "{Boolean(false)}\n",
    "{(() => false)()}\n",
    "{({ value: false }).value}\n",
    "{(true, false)}\n",
    "{(2 ** 0) && false}\n",
    "{#snippet content(value)}{value}{/snippet}{@render content(false)}\n",
    "{#snippet content(value)}{value}{/snippet}{@render content('')}\n",
    "{#snippet content(value)}{value}{/snippet}{@render content('TODO')}\n",
    "{#snippet content(value)}{value}{/snippet}{@render content(undefined)}\n",
    "{#each [false] as item}{item}{/each}\n",
    "{#each [''] as item}{item}{/each}\n",
    "{#each ['TODO'] as item}{item}{/each}\n",
    "{#each undefined as item}{item}{/each}\n",
    "<script>function noop() {}</script>\n{noop()}\n",
    "<script>function value() { return false; }</script>\n{value()}\n",
    "{#snippet outer()}{#snippet nested(value)}{value}{/snippet}{@render nested(false)}{/snippet}{@render outer()}\n",
    '<meta name="description" content="Ready"><link href="ready"><base href="/"><title>Ready</title>\n',
    '<button hidden="false">Ready</button>\n',
    '<button hidden="until-found">Ready</button>\n',
    '<div style="visibility: hidden"><button>Ready</button></div>\n',
    '<script>const style = "display: none";</script><div style={style}><button>Ready</button></div>\n',
    "<div>{missingLocalExpression()}</div>\n",
    '<script lang="ts">const value = (false satisfies boolean)!;</script>\n{value}\n',
    "<script>const [value] = [false];</script>\n{value}\n",
    "{#snippet content(value = false)}{value}{/snippet}{@render content()}\n",
    "{#snippet content(...values)}{#each values as value}{value}{/each}{/snippet}{@render content(false, '')}\n",
    '<div style="display: none !important"><button>Ready</button></div>\n',
    "<script>function value() { throw new Error('closed'); return 'Ready'; }</script>\n{value()}\n",
    "<script>function value() { return localValue; const localValue = 'Ready'; }</script>\n{value()}\n",
    "<script>function value() { switch (false) { case true: return false; } return 'Ready'; }</script>\n{value()}\n",
    "<script>function value() { try { return false; } finally {} return 'Ready'; }</script>\n{value()}\n",
    "<script>function value() { for (; false; ) { break; } return 'Ready'; }</script>\n{value()}\n",
    "<script>function value() { while (false) { continue; } return 'Ready'; }</script>\n{value()}\n",
    "{(() => { throw new Error('closed'); return 'Ready'; })()}\n",
    "{(() => { return localValue; const localValue = 'Ready'; })()}\n",
    '<div style="display/**/:none"><button>Ready</button></div>\n',
    "<div style:display={'none'}><button>Ready</button></div>\n",
    "<div style:visibility={'hidden'}><button>Ready</button></div>\n",
    "<div style:content-visibility={'hidden'}><button>Ready</button></div>\n",
    '{@html "<div hidden>Ready</div>"}\n',
    '{@html "<div inert>Ready</div>"}\n',
    "{@html \"<div aria-hidden='true'>Ready</div>\"}\n",
    "{@html \"<div style='display/**/:none'>Ready</div>\"}\n",
    "<template><button>Ready</button></template>\n",
    "<svg><defs><text>Ready</text></defs></svg>\n",
    "<svg><symbol><text>Ready</text></symbol></svg>\n",
    "<svg><clipPath><text>Ready</text></clipPath></svg>\n",
    "<svg><mask><text>Ready</text></mask></svg>\n",
    "{#snippet content()}{@render content()}{/snippet}{@render content()}\n",
    '<script lang="ts">let { runtimeValue } = $props(); function value() { if (false) return runtimeValue; return false; }</script>\n{value()}\n',
    '<script lang="ts">let { runtimeValue } = $props(); function value() { return false; return runtimeValue; }</script>\n{value()}\n',
    '<script lang="ts">let { runtimeValue } = $props(); function value() { throw new Error("closed"); return runtimeValue; }</script>\n{value()}\n',
    '<script lang="ts">let { runtimeValue } = $props(); function value() { switch (false) { case true: return runtimeValue; } return false; }</script>\n{value()}\n',
    '<script lang="ts">let { runtimeValue } = $props(); function value() { while (false) { return runtimeValue; } return false; }</script>\n{value()}\n',
    "<div style:display={'n/**/one !important'}><button>Ready</button></div>\n",
    "<div style:visibility={'hid/**/den !important'}><button>Ready</button></div>\n",
    "<div style:content-visibility={'hid/**/den !important'}><button>Ready</button></div>\n",
    '{@html "&#84;&#79;&#68;&#79;"}\n',
    '{@html "&#x54;&#79;&#x44;&#79;"}\n',
    '{@html "TODO&excl;"}\n',
    '{@html "&#84&#79&#68&#79"}\n',
    '{@html "&#x54&#79&#x44&#79"}\n',
    '{@html "TODO&#33"}\n',
  ] as const;
  const authoredSources = [
    "<button>Save changes</button>\n",
    '<script lang="ts">const value = "Ready";</script>\n<div>{value}</div>\n',
    '<script lang="ts">const content = "<strong>Ready</strong>";</script>\n{@html content}\n',
    "{#snippet control()}<button>Save changes</button>{/snippet}\n{@render control()}\n",
    '<script lang="ts">let { children } = $props();</script>\n{@render children?.()}\n',
    '<script lang="ts">let { children } = $props();</script>\nTODO {@render children?.()}\n',
    "TODO {#snippet content()}<button>Ready</button>{/snippet}{@render content()}\n",
    "<p>TODO</p><button>Ready</button>\n",
    '<script lang="ts">let { value } = $props();</script>\n<div>{value}</div>\n',
    '<script>import value from "./runtime-value.js";</script>\n<div>{value}</div>\n',
    "<script>let value = false;</script>\n<div>{value}</div>\n",
    '<script>const value = false;</script>{#snippet content(value)}{value}{/snippet}{@render content("Ready")}\n',
    "{#each ['Ready'] as item}{item}{/each}\n",
    '<script lang="ts">let { value } = $props();</script>{#snippet content(item)}{item}{/snippet}{@render content(value)}\n',
    '<script lang="ts">let { items } = $props();</script>{#each items as item}{item}{/each}\n',
    "<script>function value() { return 'Ready'; }</script>\n{value()}\n",
    '<script lang="ts">let { value } = $props(); function content() { return value; }</script>\n{content()}\n',
    '<script lang="ts">let { ready } = $props(); function content() { if (ready) return "Ready"; return false; }</script>\n{content()}\n',
    "<script>function value() { if (false) return false; return 'Ready'; }</script>\n{value()}\n",
    "{(() => { if (false) return false; return 'Ready'; })()}\n",
    "<script>function value() { return 'Ready'; return false; }</script>\n{value()}\n",
    "{#snippet content(value = 'Ready')}{value}{/snippet}{@render content()}\n",
    "{#snippet content(...values)}{#each values as value}{value}{/each}{/snippet}{@render content('Ready')}\n",
    '{@html "<strong>Ready</strong>"}\n',
    "{#if false}<button>Unavailable</button>{:else}<button>Ready</button>{/if}\n",
    "{#each [] as item}<button>{item}</button>{:else}<p>Nothing selected</p>{/each}\n",
    '<div class="spinner" aria-label="Loading"></div>\n',
    '<button aria-label="Ready"></button>\n',
    "<DynamicControl />\n",
    "{#snippet content()}{#snippet content()}<button>Ready</button>{/snippet}{@render content()}{/snippet}{@render content()}\n",
  ] as const;

  for (const fixture of fixtures) {
    for (const [index, source] of inertSources.entries()) {
      const root = mkdtempSync(join(tmpdir(), `coss-sv-${fixture.kind}-inert-expression-`));
      try {
        writeFixtureManifest(root, fixture);
        const target = join(root, fixture.targetPath);
        if (fixture.kind === "component") {
          mkdirSync(target, { recursive: true });
          writeFileSync(join(target, "root.svelte"), source);
        } else {
          mkdirSync(dirname(target), { recursive: true });
          writeFileSync(target, source);
        }
        assert.throws(
          () =>
            validateTargetManifestParity(
              [fixtureEntry(fixture)],
              collectTargetManifests(root),
              root,
            ),
          new RegExp(`${fixture.kind}:${fixture.id}.*not a real authored target`, "s"),
          `${fixture.kind} inert expression ${index}: ${source.trim()}`,
        );
      } finally {
        rmSync(root, { recursive: true, force: true });
      }
    }

    for (const [index, source] of authoredSources.entries()) {
      const root = mkdtempSync(join(tmpdir(), `coss-sv-${fixture.kind}-authored-expression-`));
      try {
        writeFixtureManifest(root, fixture);
        const target = join(root, fixture.targetPath);
        if (fixture.kind === "component") {
          mkdirSync(target, { recursive: true });
          writeFileSync(join(target, "root.svelte"), source);
        } else {
          mkdirSync(dirname(target), { recursive: true });
          writeFileSync(target, source);
        }
        assert.doesNotThrow(
          () =>
            validateTargetManifestParity(
              [fixtureEntry(fixture)],
              collectTargetManifests(root),
              root,
            ),
          `${fixture.kind} authored expression ${index}: ${source.trim()}`,
        );
      } finally {
        rmSync(root, { recursive: true, force: true });
      }
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
        /must not contain a symbolic-link path segment/,
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
      /must not contain a symbolic-link path segment/,
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
    rmSync(external, { recursive: true, force: true });
  }

  for (const definition of targetManifestDefinitions) {
    const root = mkdtempSync(join(tmpdir(), `coss-sv-${definition.kind}-manifest-internal-link-`));
    try {
      const canonical = join(root, definition.path);
      const linkedParent = dirname(canonical);
      const internalParent = join(root, `internal-${definition.kind}-manifest`);
      mkdirSync(dirname(linkedParent), { recursive: true });
      mkdirSync(internalParent, { recursive: true });
      writeFileSync(
        join(internalParent, basename(canonical)),
        `export const ${definition.exportName} = ${definition.wrapperName}([]);\n`,
      );
      symlinkSync(internalParent, linkedParent);
      assert.throws(
        () => collectTargetManifests(root),
        /must not contain a symbolic-link path segment/,
      );
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
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
      /must not contain a symbolic-link path segment/,
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
    rmSync(external, { recursive: true, force: true });
  }
});

test("rejects promoted targets with internal symlink ancestors", () => {
  for (const fixture of promotedTargetFixtures) {
    const root = mkdtempSync(join(tmpdir(), `coss-sv-${fixture.kind}-target-internal-link-`));
    try {
      writeFixtureManifest(root, fixture);
      const canonical = join(root, fixture.targetPath);
      const linkedParent = dirname(canonical);
      const internalParent = join(root, `internal-${fixture.kind}-target`);
      mkdirSync(dirname(linkedParent), { recursive: true });
      mkdirSync(internalParent, { recursive: true });
      if (fixture.kind === "component") {
        const component = join(internalParent, basename(canonical));
        mkdirSync(component, { recursive: true });
        writeFileSync(join(component, "root.svelte"), "<button>Accordion</button>\n");
      } else {
        writeFileSync(
          join(internalParent, basename(canonical)),
          fixture.kind === "particle" ? "<div>Particle</div>\n" : "# Accordion\n",
        );
      }
      symlinkSync(internalParent, linkedParent);
      const manifests = collectTargetManifests(root);
      assert.throws(
        () => validateTargetManifestParity([fixtureEntry(fixture)], manifests, root),
        /must not contain a symbolic-link path segment/,
      );
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  }
});

test("rejects traversal, encoded traversal, backslashes, and control characters in parity IDs", () => {
  const traversalFixtures: ParityEntry[] = [
    {
      id: "../../escape",
      kind: "component",
      sourcePaths: [],
      status: "implemented",
      targetPaths: ["packages/ui/src/components/ui/../../escape"],
    },
    {
      id: "../evil",
      kind: "particle",
      sourcePaths: [],
      status: "reviewed",
      targetPaths: ["apps/ui/registry/default/particles/../evil.svelte"],
    },
    {
      id: "../evil",
      kind: "doc",
      sourcePaths: [],
      status: "approved",
      targetPaths: ["apps/ui/content/docs/../evil.md"],
    },
  ];

  for (const fixture of traversalFixtures) {
    const root = mkdtempSync(join(tmpdir(), `coss-sv-${fixture.kind}-traversal-`));
    try {
      const definition = targetManifestDefinitions.find(({ kind }) => kind === fixture.kind);
      assert.ok(definition);
      const manifestPath = join(root, definition.path);
      mkdirSync(dirname(manifestPath), { recursive: true });
      writeFileSync(
        manifestPath,
        `export const ${definition.exportName} = ${definition.wrapperName}([{ ${definition.idProperty}: ${JSON.stringify(fixture.id)} }]);\n`,
      );
      const target = join(root, fixture.targetPaths[0] ?? "missing");
      if (fixture.kind === "component") {
        mkdirSync(target, { recursive: true });
        writeFileSync(join(target, "root.svelte"), "<button>Escape</button>\n");
      } else {
        mkdirSync(dirname(target), { recursive: true });
        writeFileSync(target, fixture.kind === "particle" ? "<div>Evil</div>\n" : "# Evil\n");
      }
      assert.throws(
        () => validateTargetManifestParity([fixture], collectTargetManifests(root), root),
        new RegExp(`invalid canonical ${fixture.kind} id`),
      );
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  }

  const root = mkdtempSync(join(tmpdir(), "coss-sv-id-grammar-"));
  try {
    const manifests = collectTargetManifests(root);
    for (const kind of ["component", "particle", "doc"] as const) {
      for (const id of ["%2e%2e%2fevil", "..\\evil", "evil\0id"]) {
        const entry: ParityEntry = {
          id,
          kind,
          sourcePaths: [],
          status: "implemented",
          targetPaths: ["unused"],
        };
        assert.throws(
          () => validateTargetManifestParity([entry], manifests, root),
          new RegExp(`invalid canonical ${kind} id`),
        );
      }
    }
  } finally {
    rmSync(root, { recursive: true, force: true });
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
