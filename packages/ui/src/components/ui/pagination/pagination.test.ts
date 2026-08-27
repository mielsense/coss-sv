import { createRawSnippet } from "svelte";
import { render } from "svelte/server";
import { describe, expect, test } from "vitest";
import Button from "../button/button.svelte";
import type { PaginationLinkDelegateProps } from "./index.js";
import * as Pagination from "./index.js";
import HydrationFixture from "./pagination.hydration-fixture.svelte";

const text = (value: string) => createRawSnippet(() => ({ render: () => `<span>${value}</span>` }));

describe("Pagination SSR contract", () => {
  test("renders the hydration fixture on the server", () => {
    const { body } = render(HydrationFixture);
    expect(body).toContain('data-hydration="pagination"');
    expect(body).toContain('aria-label="Hydration pages"');
  });
  test("renders the navigation landmark, list and item semantics", () => {
    const item = createRawSnippet(() => ({
      render: () => '<li data-slot="pagination-item">Page item</li>',
    }));
    const content = createRawSnippet(() => ({
      render: () =>
        `<ul data-slot="pagination-content">${render(Pagination.PaginationItem, { props: { children: text("One") } }).body}</ul>`,
    }));
    const { body } = render(Pagination.Pagination, {
      props: {
        "aria-label": "Project pages",
        children: content,
        class: "consumer",
        "data-forwarded": "yes",
      },
    });

    expect(body).toContain("<nav");
    expect(body).toContain('aria-label="Project pages"');
    expect(body).toContain('data-slot="pagination"');
    expect(body).toContain('data-forwarded="yes"');
    expect(body).toContain("mx-auto flex w-full justify-center consumer");
    expect(render(Pagination.PaginationContent, { props: { children: item } }).body).toContain(
      "flex flex-row items-center gap-1",
    );
    expect(render(Pagination.PaginationItem, { props: { children: text("One") } }).body).toContain(
      "<li",
    );
  });

  test("marks only the active page as current and preserves link attributes", () => {
    const active = render(Pagination.PaginationLink, {
      props: {
        children: text("2"),
        href: "/projects?page=2",
        isActive: true,
        rel: "next",
        target: "_self",
      },
    }).body;
    const inactive = render(Pagination.PaginationLink, {
      props: { children: text("3"), href: "/projects?page=3" },
    }).body;

    expect(active).toContain('aria-current="page"');
    expect(active).toContain('data-active="true"');
    expect(active).toContain('href="/projects?page=2"');
    expect(active).toContain('rel="next"');
    expect(active).toContain('target="_self"');
    expect(active).toContain("border-input");
    expect(inactive).not.toContain("aria-current");
    expect(inactive).toContain("border-transparent");
  });

  test("renders exact previous, next and ellipsis accessible copy", () => {
    const previous = render(Pagination.PaginationPrevious, {
      props: { href: "/projects?page=1" },
    }).body;
    const next = render(Pagination.PaginationNext, {
      props: { href: "/projects?page=3" },
    }).body;
    const ellipsis = render(Pagination.PaginationEllipsis).body;

    expect(previous).toContain('aria-label="Go to previous page"');
    expect(previous).toContain("Previous");
    expect(previous).toContain("lucide-chevron-left");
    expect(next).toContain('aria-label="Go to next page"');
    expect(next).toContain("Next");
    expect(next).toContain("lucide-chevron-right");
    expect(ellipsis).toContain('aria-hidden="true"');
    expect(ellipsis).toContain("lucide-ellipsis");
    expect(ellipsis).toContain("More pages");
  });

  test("supports an explicit native polymorphic link target", () => {
    const { body } = render(Pagination.PaginationLink, {
      props: {
        as: "button",
        children: text("Load page 4"),
        isActive: false,
        type: "button",
      },
    });

    expect(body).toContain("<button");
    expect(body).toContain('type="button"');
    expect(body).toContain("Load page 4");
  });

  test("delegates previous and next rendering while preserving their owned content", () => {
    const delegate = createRawSnippet<[PaginationLinkDelegateProps]>((getDelegateProps) => ({
      render: () =>
        render(Button, {
          props: {
            ...getDelegateProps().props,
            disabled: true,
            onclick: () => undefined,
            size: "sm",
            variant: "outline",
          },
        }).body,
    }));
    const previous = render(Pagination.Previous, {
      props: { class: "sm:*:[svg]:hidden", delegate },
    }).body;
    const next = render(Pagination.Next, {
      props: { class: "sm:*:[svg]:hidden", delegate },
    }).body;

    for (const body of [previous, next]) {
      expect(body).toContain("border-input");
      expect(body).not.toContain("border-transparent");
      expect(body).not.toContain("size-9");
      expect(body).toContain("disabled");
      expect(body).toContain('data-slot="pagination-link"');
    }
    expect(previous).toContain("Previous");
    expect(previous).toContain("lucide-chevron-left");
    expect(next).toContain("Next");
    expect(next).toContain("lucide-chevron-right");
  });
});
