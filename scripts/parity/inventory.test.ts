import assert from "node:assert/strict";
import test from "node:test";

import { collectReferenceInventory, renderInventory } from "./inventory.mts";

test("locks the pinned reference inventory", () => {
  const inventory = collectReferenceInventory();

  assert.equal(inventory.components.length, 54);
  assert.equal(inventory.componentDocs.length, 55);
  assert.equal(inventory.rootDocs.length, 7);
  assert.equal(inventory.hookDocs.length, 2);
  assert.equal(inventory.particles.length, 508);
});

test("keeps every source identifier unique", () => {
  const inventory = collectReferenceInventory();

  for (const entries of Object.values(inventory)) {
    const ids = entries.map(({ id }) => id);
    assert.equal(new Set(ids).size, ids.length);
  }
});

test("renders every source and target path", () => {
  const inventory = collectReferenceInventory();
  const output = renderInventory(inventory);

  for (const entries of Object.values(inventory)) {
    for (const entry of entries) {
      assert.ok(output.includes(entry.sourcePath));
      assert.ok(output.includes(entry.targetPath));
    }
  }
});
