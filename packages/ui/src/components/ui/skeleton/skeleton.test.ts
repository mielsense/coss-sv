import { createRawSnippet } from "svelte";
import { render } from "svelte/server";
import { describe, expect, test } from "vitest";
import { Skeleton } from "./index.js";

describe("Skeleton SSR contract", () => {
  test("renders the exact COSS loading gradient and forwards native attributes", () => {
    const children = createRawSnippet(() => ({ render: () => "<span>loading</span>" }));
    const body = render(Skeleton, {
      props: { class: "h-4 w-full", "data-forwarded": "yes", children },
    }).body;

    expect(body).toContain("<div");
    expect(body).toContain('data-slot="skeleton"');
    expect(body).toContain('data-forwarded="yes"');
    expect(body).toContain("animate-skeleton rounded-sm");
    expect(body).toContain("[--skeleton-highlight:--alpha(var(--color-white)/64%)]");
    expect(body).toContain(
      "[background:linear-gradient(120deg,transparent_40%,var(--skeleton-highlight),transparent_60%)_var(--color-muted)_0_0/200%_100%_fixed]",
    );
    expect(body).toContain("dark:[--skeleton-highlight:--alpha(var(--color-white)/4%)]");
    expect(body).toContain("h-4 w-full");
    expect(body).toContain("loading");
    expect(body).not.toContain('role="progressbar"');
  });

  test("exports Skeleton", () => {
    expect(Skeleton).toBeTypeOf("function");
  });
});
