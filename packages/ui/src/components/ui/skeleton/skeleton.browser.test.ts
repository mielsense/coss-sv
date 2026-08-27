import { hydrate, unmount } from "svelte";
import { afterEach, describe, expect, test, vi } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import SkeletonFixture from "./skeleton.browser-fixture.svelte";
import Skeleton from "./skeleton.svelte";

afterEach(() => {
  document.body.innerHTML = "";
});

describe("Skeleton browser contract", () => {
  test("forwards callbacks, refs, and snippets", async () => {
    render(SkeletonFixture);

    await expect.element(page.getByTestId("skeleton-state")).toHaveTextContent("0:DIV");
    await expect.element(page.getByTestId("skeleton-content")).toHaveTextContent("Loading profile");
    await page.getByTestId("skeleton").click();
    await expect.element(page.getByTestId("skeleton-state")).toHaveTextContent("1:DIV");
  });

  test("hydrates server-equivalent markup without a mismatch", async () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const target = document.createElement("div");
    target.innerHTML =
      '<div class="animate-skeleton rounded-sm [--skeleton-highlight:--alpha(var(--color-white)/64%)] [background:linear-gradient(120deg,transparent_40%,var(--skeleton-highlight),transparent_60%)_var(--color-muted)_0_0/200%_100%_fixed] dark:[--skeleton-highlight:--alpha(var(--color-white)/4%)]" data-slot="skeleton"></div>';
    document.body.append(target);

    const component = hydrate(Skeleton, { target });

    expect(warning).not.toHaveBeenCalled();
    await unmount(component);
    warning.mockRestore();
  });
});
