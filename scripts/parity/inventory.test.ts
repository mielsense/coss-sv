import assert from "node:assert/strict";
import test from "node:test";

import {
  applyStatusBaseline,
  collectReferenceInventory,
  formatMissingReport,
  loadStatusBaseline,
  renderInventory,
  validateStatusBaseline,
} from "./inventory.mts";

const inventory = collectReferenceInventory();
const baseline = loadStatusBaseline();
const entries = applyStatusBaseline(inventory.entries, baseline);

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
  assert.ok(baseline.entries.every(({ status }) => status === "missing"));

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

test("reports every planned missing item without truncation", () => {
  const output = formatMissingReport(entries);

  for (const entry of entries) {
    assert.match(output, new RegExp(`^\\- ${entry.kind}:${entry.id}$`, "m"));
  }

  assert.match(output, /components: 54/);
  assert.match(output, /docs: 64/);
  assert.match(output, /particles: 508/);
  assert.match(output, /total: 626/);
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
