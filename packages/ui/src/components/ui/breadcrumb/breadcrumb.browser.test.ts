import { hydrate, unmount } from "svelte";
import { afterEach, describe, expect, test, vi } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import BreadcrumbFixture from "./breadcrumb.browser-fixture.svelte";
import Breadcrumb from "./breadcrumb.svelte";

afterEach(() => {
  document.body.innerHTML = "";
});

describe("Breadcrumb browser contract", () => {
  test("forwards native callbacks, refs, snippets, and custom element rendering", async () => {
    render(BreadcrumbFixture);

    const nav = page.getByTestId("breadcrumb");
    await expect.element(nav).toHaveAttribute("aria-label", "Project path");
    await expect.element(page.getByTestId("custom-separator")).toHaveTextContent("/");
    await expect.element(page.getByTestId("breadcrumb-state")).toHaveTextContent("0:NAV:BUTTON");
    await expect.element(page.getByText("More")).toHaveClass("sr-only");

    await page.getByTestId("breadcrumb-link").click();
    await expect.element(page.getByTestId("breadcrumb-state")).toHaveTextContent("1:NAV:BUTTON");
  });

  test("hydrates server-equivalent root markup without a mismatch", async () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const target = document.createElement("div");
    target.innerHTML = '<nav aria-label="breadcrumb" data-slot="breadcrumb"></nav>';
    document.body.append(target);

    const component = hydrate(Breadcrumb, { target });

    expect(warning).not.toHaveBeenCalled();
    await unmount(component);
    warning.mockRestore();
  });
});
