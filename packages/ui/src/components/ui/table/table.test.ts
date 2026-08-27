import { createRawSnippet } from "svelte";
import { render } from "svelte/server";
import { describe, expect, test } from "vitest";
import * as Table from "./index.js";
import HydrationFixture from "./table.hydration-fixture.svelte";

const text = (value: string) => createRawSnippet(() => ({ render: () => `<span>${value}</span>` }));

describe("Table SSR contract", () => {
  test("renders the hydration fixture on the server", () => {
    const { body } = render(HydrationFixture);
    expect(body).toContain('data-hydration="table"');
    expect(body).toContain('aria-label="Hydration records"');
  });
  test("renders the responsive container and semantic table structure", () => {
    const { body } = render(Table.Table, {
      props: {
        "aria-label": "Project budgets",
        children: text("Rows"),
        class: "min-w-96",
        "data-forwarded": "table",
      },
    });

    expect(body).toContain('data-slot="table-container"');
    expect(body).toContain('data-variant="default"');
    expect(body).toContain("relative w-full overflow-x-auto");
    expect(body).toContain("<table");
    expect(body).toContain('aria-label="Project budgets"');
    expect(body).toContain('data-slot="table"');
    expect(body).toContain('data-forwarded="table"');
    expect(body).toContain("w-full caption-bottom");
    expect(body).toContain("min-w-96");
    expect(body).toContain("Rows");
  });

  test("renders caption, headers, body rows, cells and footer as native elements", () => {
    const parts = [
      [
        render(Table.TableCaption, {
          props: {
            children: text("table-caption"),
            class: "consumer",
            "data-forwarded": "table-caption",
          },
        }).body,
        "caption",
        "table-caption",
        "text-muted-foreground",
      ],
      [
        render(Table.TableHeader, {
          props: {
            children: text("table-header"),
            class: "consumer",
            "data-forwarded": "table-header",
          },
        }).body,
        "thead",
        "table-header",
        "[&amp;_tr]:border-b",
      ],
      [
        render(Table.TableBody, {
          props: {
            children: text("table-body"),
            class: "consumer",
            "data-forwarded": "table-body",
          },
        }).body,
        "tbody",
        "table-body",
        "[&amp;_tr:last-child]:border-0",
      ],
      [
        render(Table.TableFooter, {
          props: {
            children: text("table-footer"),
            class: "consumer",
            "data-forwarded": "table-footer",
          },
        }).body,
        "tfoot",
        "table-footer",
        "font-medium",
      ],
      [
        render(Table.TableRow, {
          props: { children: text("table-row"), class: "consumer", "data-forwarded": "table-row" },
        }).body,
        "tr",
        "table-row",
        "relative border-b",
      ],
      [
        render(Table.TableHead, {
          props: {
            children: text("table-head"),
            class: "consumer",
            "data-forwarded": "table-head",
          },
        }).body,
        "th",
        "table-head",
        "h-10",
      ],
      [
        render(Table.TableCell, {
          props: {
            children: text("table-cell"),
            class: "consumer",
            "data-forwarded": "table-cell",
          },
        }).body,
        "td",
        "table-cell",
        "whitespace-nowrap",
      ],
    ] as const;

    for (const [body, tag, slot, className] of parts) {
      expect(body).toContain(`<${tag}`);
      expect(body).toContain(`data-slot="${slot}"`);
      expect(body).toContain(`data-forwarded="${slot}"`);
      expect(body).toContain(className);
      expect(body).toContain("consumer");
    }
  });

  test("applies the complete card variant contract", () => {
    const { body } = render(Table.Table, {
      props: { children: text("Card rows"), variant: "card" },
    });

    expect(body).toContain('data-variant="card"');
    expect(body).toContain("in-data-[variant=card]:border-separate");
    expect(body).toContain("in-data-[variant=card]:border-spacing-0");
  });

  test("forwards native table attributes and explicit container customization separately", () => {
    const { body } = render(Table.Table, {
      props: {
        children: text("Custom"),
        containerAs: "section",
        containerClass: "outer",
        containerId: "project-table-scroll",
        id: "project-table",
      },
    });

    expect(body).toContain("<section");
    expect(body).toContain('id="project-table-scroll"');
    expect(body).toContain("overflow-x-auto outer");
    expect(body).toContain('data-slot="table" id="project-table"');
  });
});
