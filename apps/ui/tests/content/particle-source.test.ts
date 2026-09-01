import { describe, expect, test } from "vitest";
import { readFile } from "node:fs/promises";
import {
  highlightRegistryParticleSource,
  stripParticleMetadata,
} from "../../src/lib/content/particle-source.js";
import { presentRegistryAliases } from "../../src/lib/registry/present-source-aliases.js";

describe("particle source presentation", () => {
  test("hides preview-only module metadata from the user-facing code tab", () => {
    const source = `<script module lang="ts">
  import { defineParticleMeta } from "@/registry/particle-metadata.js";
  export const meta = defineParticleMeta({ id: "p-button-1" });
</script>

<script lang="ts">
  import { Button } from "@coss-sv/ui";
</script>

<Button>Button</Button>
`;

    expect(stripParticleMetadata(source)).toBe(`<script lang="ts">
  import { Button } from "@coss-sv/ui";
</script>

<Button>Button</Button>
`);
  });

  test("preserves a particle without preview-only module metadata", () => {
    const source = "<button>Button</button>\n";
    expect(stripParticleMetadata(source)).toBe(source);
  });

  test("presents install-ready aliases instead of registry template placeholders", () => {
    expect(
      presentRegistryAliases(
        'import Root from "$COMPONENTS$/ui/root.svelte";\n' +
          'import Item from "$UI$/item.svelte";\n' +
          'import hook from "$HOOKS$/hook.svelte.js";\n' +
          'import { cn } from "$UTILS$";\n' +
          'import helper from "$LIB$/helper.js";\n',
      ),
    ).toBe(
      'import Root from "$lib/components/ui/root.svelte";\n' +
        'import Item from "$lib/components/ui/item.svelte";\n' +
        'import hook from "$lib/hooks/hook.svelte.js";\n' +
        'import { cn } from "$lib/utils";\n' +
        'import helper from "$lib/helper.js";\n',
    );
  });

  test("highlights the requested built registry particle", async () => {
    const highlighted = await highlightRegistryParticleSource("p-button-1", {
      files: [
        { content: "<button>Button</button>\n", target: "p-button-1.svelte" },
        { content: "<button>Other</button>\n", target: "p-button-2.svelte" },
      ],
    });

    expect(highlighted.language).toBe("svelte");
    expect(highlighted.raw).toBe("<button>Button</button>\n");
  });

  test("keeps displayed Svelte component brackets on their owning lines", async () => {
    const source = await readFile(
      new URL("../../registry/default/particles/p-input-group-1.svelte", import.meta.url),
      "utf8",
    );
    const visible = stripParticleMetadata(source);

    expect(visible).toContain("<InputGroup.Root>");
    expect(visible).toContain("  <InputGroup.Input");
    expect(visible).toContain("</InputGroup.Root>");
    expect(visible).not.toMatch(/<InputGroup\.[A-Za-z]+\n\s*>/);
    expect(visible).not.toMatch(/<\/InputGroup\.[A-Za-z]+\n\s*>/);
  });

  test("rejects invalid and missing built registry particles", async () => {
    await expect(highlightRegistryParticleSource("../button", { files: [] })).rejects.toThrow(
      /invalid particle ID/,
    );
    await expect(highlightRegistryParticleSource("p-button-1", { files: [] })).rejects.toThrow(
      /is unavailable/,
    );
  });
});
