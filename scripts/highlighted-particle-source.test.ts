import assert from "node:assert/strict";
import test from "node:test";
import { registryDocumentPath } from "./vite/particle-source-path.mjs";

test("resolves particle registry documents from Vite-normalized paths", () => {
  assert.deepEqual(
    registryDocumentPath("/repo/apps/ui/registry/default/particles/p-button-1.svelte"),
    {
      id: "p-button-1",
      path: "/repo/apps/ui/static/r/p-button-1.json",
    },
  );
});

test("resolves Windows-style Vite module IDs", () => {
  assert.deepEqual(
    registryDocumentPath("C:\\repo\\apps\\ui\\registry\\default\\particles\\p-button-1.svelte"),
    {
      id: "p-button-1",
      path: "C:/repo/apps/ui/static/r/p-button-1.json",
    },
  );
});

test("rejects source files outside the particle registry", () => {
  assert.throws(
    () => registryDocumentPath("/repo/apps/ui/src/p-button-1.svelte"),
    /outside the particle registry/,
  );
});
