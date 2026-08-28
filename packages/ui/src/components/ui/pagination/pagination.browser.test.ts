import { hydrate, unmount } from "svelte";
import { afterEach, describe, expect, test, vi } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import Fixture from "./pagination.browser-fixture.svelte";
import HydrationFixture from "./pagination.hydration-fixture.svelte";

afterEach(() => {
  document.body.innerHTML = "";
});

describe("Pagination browser contract", () => {
  test("exposes one named navigation landmark and current page", async () => {
    render(Fixture);

    await expect.element(page.getByRole("navigation", { name: "pagination" })).toBeInTheDocument();
    await expect.element(page.getByTestId("active")).toHaveAttribute("aria-current", "page");
    await expect.element(page.getByTestId("active")).toHaveAttribute("data-active", "true");
    expect(document.querySelectorAll('[aria-current="page"]').length).toBe(1);
    expect(document.querySelector('[data-slot="pagination-content"]')?.tagName).toBe("UL");
    expect(document.querySelectorAll('[data-slot="pagination-item"]')).toHaveLength(5);
  });

  test("forwards link callbacks and refs", async () => {
    render(Fixture);

    await page.getByTestId("active").click();
    await expect.element(page.getByTestId("state")).toHaveTextContent("1:A");
  });

  test("keeps ellipsis hidden and supports a native polymorphic target", async () => {
    render(Fixture);

    const ellipsis = document.querySelector<HTMLElement>('[data-slot="pagination-ellipsis"]');
    expect(ellipsis?.getAttribute("aria-hidden")).toBe("true");
    expect(ellipsis?.textContent).toContain("More pages");
    expect(document.querySelector('[data-testid="button-link"]')?.tagName).toBe("BUTTON");
    await expect.element(page.getByTestId("button-link")).toHaveAttribute("type", "button");
  });

  test("delegates rendering to Button without adding PaginationLink variants", async () => {
    render(Fixture);

    const previous = page.getByTestId("delegated-previous");
    const next = page.getByTestId("delegated-next");
    await expect.element(previous).toBeDisabled();
    await expect.element(previous).toHaveAttribute("aria-label", "Go to previous page");
    expect((await previous.element()).className).toContain("border-input");
    expect((await previous.element()).className).not.toContain("border-transparent");
    expect((await previous.element()).className).not.toContain("size-9");
    await previous.click({ force: true });
    await expect.element(page.getByTestId("state")).toHaveTextContent("0:A:0:BUTTON");
    await next.click();
    await expect.element(page.getByTestId("state")).toHaveTextContent("0:A:1:BUTTON");
    await expect.element(next).toHaveTextContent("Next");
    const nextIcon = (await next.element()).querySelector("svg");
    expect(nextIcon).not.toBeNull();
    expect(nextIcon?.getAttribute("aria-hidden")).toBe("true");
    expect(nextIcon?.querySelectorAll("path").length).toBeGreaterThan(0);
  });

  test("binds the public ref to the delegated Button and clears it on teardown", async () => {
    render(Fixture);

    await expect.element(page.getByTestId("state")).toHaveTextContent("0:A:0:BUTTON");
    expect(document.querySelector('[data-testid="delegated-next"]')?.tagName).toBe("BUTTON");

    await page.getByTestId("toggle-delegated").click();
    await expect.element(page.getByTestId("state")).toHaveTextContent("0:A:0:missing");
    expect(document.querySelector('[data-testid="delegated-next"]')).toBeNull();

    await page.getByTestId("toggle-delegated").click();
    await expect.element(page.getByTestId("state")).toHaveTextContent("0:A:0:BUTTON");
  });

  test("hydrates server-rendered Pagination markup without warnings", async () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const target = document.createElement("div");
    target.innerHTML =
      '<!--[--><!--[--><nav aria-label="Hydration pages" class="mx-auto flex w-full justify-center" data-slot="pagination" data-hydration="pagination"><!----></nav><!--]--><!--]-->';
    document.body.append(target);
    const component = hydrate(HydrationFixture, { target });

    expect(warning).not.toHaveBeenCalled();
    expect(target.querySelector('[data-hydration="pagination"]')).not.toBeNull();
    await unmount(component);
    warning.mockRestore();
  });
});
