import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { appRoot } from "../../scripts/registry/lib.mjs";
import {
  createUiExportMap,
  transformParticleSource,
} from "../../scripts/registry/particle-source.mjs";

describe("particle registry source transform", () => {
  test("rewrites package exports to their consumer-local component and helper modules", async () => {
    const exports = createUiExportMap(
      await readFile(resolve(appRoot, "../../packages/ui/src/index.ts"), "utf8"),
    );
    const source = `<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
</script>

<script lang="ts">
  import { HugeiconsIcon } from "@hugeicons/svelte";
  import { Accordion, Button, buttonVariants, Calendar, type DateRange } from "@coss-sv/ui";
  import {
    segmentedControlItemVariants,
    segmentedControlRootClassName,
  } from "@coss-sv/ui/lib/segmented-control";
  import { formatDatePpp } from "../lib/date-format.js";
</script>
`;

    const transformed = transformParticleSource(source, exports);
    expect(transformed).toContain('import HugeiconsIcon from "@/hugeicons-icon.svelte";');
    expect(transformed).toContain(
      'import * as Accordion from "@/components/ui/accordion/index.js";',
    );
    expect(transformed).toContain(
      'import { Button, buttonVariants } from "@/components/ui/button/index.js";',
    );
    expect(transformed).toContain(
      'import { Calendar, type DateRange } from "@/components/ui/calendar/index.js";',
    );
    expect(transformed).toContain('from "@/segmented-control.js"');
    expect(transformed).toContain('from "@/date-format.js"');
    expect(transformed).toContain('from "@/registry/particle-metadata.js"');
    expect(transformed).not.toMatch(/@coss-sv\/ui|@hugeicons\/svelte/);
  });

  test("preserves package default exports as consumer-local default imports", async () => {
    const exports = createUiExportMap(
      await readFile(resolve(appRoot, "../../packages/ui/src/index.ts"), "utf8"),
    );

    expect(
      transformParticleSource(
        '<script lang="ts">\nimport { HugeiconsIcon as Icon } from "@coss-sv/ui";\n</script>',
        exports,
      ),
    ).toContain('import Icon from "@/hugeicons-icon.svelte";');
  });

  test("rewrites direct component namespace imports for installable particles", async () => {
    const exports = createUiExportMap(
      await readFile(resolve(appRoot, "../../packages/ui/src/index.ts"), "utf8"),
    );

    expect(
      transformParticleSource(
        '<script lang="ts">\nimport * as Card from "@coss-sv/ui/components/ui/card";\n</script>',
        exports,
      ),
    ).toContain('import * as Card from "@/components/ui/card/index.js";');
  });

  test("rejects package exports without a consumer-local owner", () => {
    expect(() =>
      transformParticleSource(
        '<script lang="ts">\nimport { Missing } from "@coss-sv/ui";\n</script>',
        new Map(),
      ),
    ).toThrow("No consumer-local module owns @coss-sv/ui export Missing");
  });
});
