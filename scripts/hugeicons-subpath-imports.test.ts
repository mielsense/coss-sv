import assert from "node:assert/strict";
import test from "node:test";
import { rewriteHugeiconsImports } from "./vite/hugeicons-subpath-imports.ts";

test("rewrites Hugeicons root imports to direct icon modules", () => {
  assert.equal(
    rewriteHugeiconsImports(
      'import { Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons";\n',
    ),
    'import Copy01Icon from "@hugeicons/core-free-icons/Copy01Icon";\n' +
      'import Tick02Icon from "@hugeicons/core-free-icons/Tick02Icon";\n',
  );
});

test("does not let an earlier named import swallow a later Hugeicons import", () => {
  assert.equal(
    rewriteHugeiconsImports(
      'import { Button } from "@coss-sv/ui";\n' +
        'import { Search01Icon } from "@hugeicons/core-free-icons";\n',
    ),
    'import { Button } from "@coss-sv/ui";\n' +
      'import Search01Icon from "@hugeicons/core-free-icons/Search01Icon";\n',
  );
});

test("leaves aliased imports unchanged instead of changing their binding", () => {
  const source = 'import { Copy01Icon as Copy } from "@hugeicons/core-free-icons";';
  assert.equal(rewriteHugeiconsImports(source), source);
});

test("maps root-barrel aliases to their concrete icon module", () => {
  assert.equal(
    rewriteHugeiconsImports('import { LayersIcon } from "@hugeicons/core-free-icons";'),
    'import LayersIcon from "@hugeicons/core-free-icons/Layers01Icon";',
  );
});
