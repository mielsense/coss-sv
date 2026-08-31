import { render } from "svelte/server";
import { describe, expect, test } from "vitest";
import { highlightSource } from "../../src/lib/code/highlight.js";
import ApiTable from "../../src/lib/content/components/ApiTable.svelte";
import CodeSource from "../../src/lib/content/components/CodeSource.svelte";
import InstallCommand from "../../src/lib/content/components/InstallCommand.svelte";
import PreviewCard from "../../src/lib/content/components/PreviewCard.svelte";

describe("documentation components", () => {
  test("renders the registry CLI and manual installation methods", () => {
    const body = render(InstallCommand, {
      props: {
        shadcnSvelte: "pnpm dlx shadcn-svelte@latest add https://example.com/r/accordion.json",
      },
    }).body;

    expect(body).toContain("CLI");
    expect(body).toContain("Manual");
    expect(body).toContain("pnpm");
    expect(body).not.toMatch(/>npm<|>yarn<|>bun</);
    expect(body).toContain('role="tablist"');
    expect(body).toContain('role="tabpanel"');
    expect(body).toContain('aria-selected="true"');
    expect(body).toContain('aria-selected="false"');
  });

  test("renders explicit preview presentation semantics without eager source DOM", async () => {
    const source = await highlightSource(
      '<script lang="ts">\nlet count = $state(0);\n</script>',
      "svelte",
    );
    const body = render(PreviewCard, {
      props: {
        align: "start",
        containerClass: "**:data-[slot=preview]:w-full sm:**:data-[slot=preview]:max-w-[80%]",
        name: "p-accordion-1",
        source,
        theme: "dark",
        title: "Accordion",
        width: "mobile",
      },
    }).body;

    expect(body).toContain('data-particle="p-accordion-1"');
    expect(body).toContain('class="group relative my-8 flex flex-col gap-2 ');
    expect(body).not.toContain("component-preview");
    expect(body).toContain("sm:**:data-[slot=preview]:max-w-[80%] dark");
    expect(body).toContain('data-align="start"');
    expect(body).toContain("--preview-width: 390px");
    expect(body).toContain('data-slot="preview"');
    expect(body).toContain(">Code<");
    expect(body).not.toContain("data-source-panel");
    expect(body).not.toContain("Copy to clipboard");
    expect(body.replace(/<[^>]*>/g, "")).not.toContain("$state(0)");
    expect(body).not.toContain("<iframe");
    expect(body).toContain('role="tabpanel"');
  });

  test("suppresses the complete tab control when code is hidden", async () => {
    const source = await highlightSource("<button>Hidden source</button>", "svelte");
    const body = render(PreviewCard, {
      props: { hideCode: true, name: "p-button-1", source },
    }).body;

    expect(body).not.toContain('role="tablist"');
    expect(body).not.toContain('role="tab"');
    expect(body).not.toContain('role="tabpanel"');
    expect(body).toContain("Loading p-button-1 preview");
    expect(body).not.toContain("<iframe");
  });

  test("keeps documentation previews at the upstream 450px height", async () => {
    const source = await highlightSource("<button>Open dialog</button>", "svelte");
    const defaultHeight = render(PreviewCard, {
      props: { name: "p-dialog-5", source },
    }).body;
    const explicitHeight = render(PreviewCard, {
      props: { iframeHeight: 520, name: "p-dialog-5", source },
    }).body;

    expect(defaultHeight).toContain("--preview-height: 450px");
    expect(defaultHeight).toContain("height: calc(450px + 2px)");
    expect(defaultHeight).not.toContain("--preview-height: 640px");
    expect(explicitHeight).toContain("--preview-height: 520px");
  });

  test("renders highlighted token content as text rather than executable HTML", async () => {
    const source = await highlightSource('<img src=x onerror="globalThis.pwned=true">', "svelte");
    const body = render(CodeSource, { props: { source } }).body;

    expect(body).toContain("&lt;");
    expect(body).toContain(">img<");
    expect(body).not.toContain("<img");
  });

  test("renders typed Svelte API metadata", () => {
    const body = render(ApiTable, {
      props: {
        properties: [
          {
            defaultValue: "false",
            description: "Controls whether the item is expanded.",
            name: "open",
            required: false,
            type: "boolean",
          },
        ],
      },
    }).body;

    expect(body).toContain("open");
    expect(body).toContain("boolean");
    expect(body).toContain("Controls whether the item is expanded.");
  });
});
