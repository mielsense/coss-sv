import assert from "node:assert/strict";
import test from "node:test";
import { rewriteShardsImports } from "./vite/shards-subpath-imports.ts";

test("rewrites Shards namespaces and types to component subpaths", () => {
  assert.equal(
    rewriteShardsImports(
      'import { Tabs as TabsPrimitive, type TabsValue } from "@shardsui/svelte";',
    ),
    'import { Tabs as TabsPrimitive, type TabsValue } from "@shardsui/svelte/tabs";',
  );
});

test("splits imports belonging to different Shards component modules", () => {
  assert.equal(
    rewriteShardsImports('import { Dialog as D, Drawer as P } from "@shardsui/svelte";'),
    'import { Dialog as D } from "@shardsui/svelte/dialog";\n' +
      'import { Drawer as P } from "@shardsui/svelte/drawer";',
  );
});

test("rewrites direct Shards re-exports", () => {
  assert.equal(
    rewriteShardsImports('export { Field as FieldPrimitive } from "@shardsui/svelte";'),
    'export { Field as FieldPrimitive } from "@shardsui/svelte/field";',
  );
});
