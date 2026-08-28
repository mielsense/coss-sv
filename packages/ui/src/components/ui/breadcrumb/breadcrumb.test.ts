import { createRawSnippet } from "svelte";
import { render } from "svelte/server";
import { describe, expect, test } from "vitest";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./index.js";

const text = (value: string) => createRawSnippet(() => ({ render: () => `<span>${value}</span>` }));

describe("Breadcrumb SSR contract", () => {
  test("exports every COSS breadcrumb part", () => {
    for (const part of [
      Breadcrumb,
      BreadcrumbEllipsis,
      BreadcrumbItem,
      BreadcrumbLink,
      BreadcrumbList,
      BreadcrumbPage,
      BreadcrumbSeparator,
    ]) {
      expect(part).toBeTypeOf("function");
    }
  });

  test("preserves landmark, list, link, current page, and forwarded attributes", () => {
    expect(
      render(Breadcrumb, { props: { "data-forwarded": "nav", children: text("Trail") } }).body,
    ).toContain('<nav aria-label="breadcrumb" data-slot="breadcrumb" data-forwarded="nav">');

    const list = render(BreadcrumbList, {
      props: { class: "gap-4", "data-forwarded": "list", children: text("List") },
    }).body;
    expect(list).toContain("wrap-break-word flex flex-wrap items-center");
    expect(list).toContain("gap-4");
    expect(list).not.toContain("gap-1.5");
    expect(list).toContain('data-slot="breadcrumb-list"');

    expect(render(BreadcrumbItem, { props: { children: text("Item") } }).body).toContain(
      '<li class="inline-flex items-center gap-1.5" data-slot="breadcrumb-item">',
    );
    const buttonLink = render(BreadcrumbLink, {
      props: { as: "button", type: "button", children: text("Home") },
    }).body;
    expect(buttonLink).toContain("<button");
    expect(buttonLink).toContain('type="button"');
    expect(buttonLink).toContain('class="transition-colors hover:text-foreground"');
    expect(buttonLink).toContain('data-slot="breadcrumb-link"');
    expect(render(BreadcrumbPage, { props: { children: text("Current") } }).body).toContain(
      'aria-current="page"',
    );
  });

  test("renders the default and custom separator plus the fixed ellipsis affordance", () => {
    const defaultSeparator = render(BreadcrumbSeparator).body;
    expect(defaultSeparator).toContain('aria-hidden="true"');
    expect(defaultSeparator).toContain('role="presentation"');
    expect(defaultSeparator).toContain('data-slot="breadcrumb-separator"');
    expect(defaultSeparator).toContain("<svg");
    expect(defaultSeparator).toContain('xmlns="http://www.w3.org/2000/svg"');
    expect(defaultSeparator).toContain('aria-hidden="true"');

    const customSeparator = render(BreadcrumbSeparator, { props: { children: text("/") } }).body;
    expect(customSeparator).toContain("/");
    expect(customSeparator).not.toContain('d="m9 18 6-6-6-6"');

    const ellipsis = render(BreadcrumbEllipsis).body;
    expect(ellipsis).toContain('data-slot="breadcrumb-ellipsis"');
    expect(ellipsis).toContain("<svg");
    expect(ellipsis).toContain('class="size-4"');
    expect(ellipsis).toContain('<span class="sr-only">More</span>');
  });
});
