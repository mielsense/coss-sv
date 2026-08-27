import { hydrate, unmount } from "svelte";
import { afterEach, describe, expect, test, vi } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import Fixture from "./table.browser-fixture.svelte";
import HydrationFixture from "./table.hydration-fixture.svelte";

afterEach(() => {
  document.body.innerHTML = "";
});

describe("Table browser contract", () => {
  test("preserves caption, column-header, row and cell semantics", async () => {
    render(Fixture);

    await expect
      .element(page.getByRole("table"))
      .toHaveAccessibleDescription("A list of current projects.");
    expect(document.querySelector("caption")?.textContent).toBe("A list of current projects.");
    expect(document.querySelectorAll('th[scope="col"]')).toHaveLength(3);
    expect(document.querySelectorAll("tbody tr")).toHaveLength(1);
    expect(document.querySelector('td[headers="project"]')?.textContent).toBe("Website Redesign");
    expect(document.querySelector("tfoot td")?.getAttribute("colspan")).toBe("2");
  });

  test("provides horizontal overflow without changing table semantics", async () => {
    render(Fixture);

    const container = document.querySelector<HTMLElement>('[data-slot="table-container"]');
    const table = document.querySelector<HTMLTableElement>('[data-slot="table"]');
    if (!container) throw new Error("Table scroll container did not render.");
    expect(container?.scrollWidth).toBeGreaterThan(container?.clientWidth ?? 0);
    container.scrollLeft = 120;
    expect(container?.scrollLeft).toBe(120);
    expect(table?.parentElement).toBe(container);
    expect(table?.tagName).toBe("TABLE");
  });

  test("forwards callbacks, refs and state attributes", async () => {
    render(Fixture);

    await page.getByTestId("table").click();
    await expect.element(page.getByTestId("state")).toHaveTextContent("1:TABLE:TR");
    await expect.element(page.getByTestId("row")).toHaveAttribute("data-state", "selected");
  });

  test("hydrates server-rendered Table markup without warnings", async () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const target = document.createElement("div");
    target.innerHTML =
      '<!--[--><!--[--><!----><div class="relative w-full overflow-x-auto" data-slot="table-container" data-variant="default"><table class="w-full caption-bottom in-data-[variant=card]:border-separate in-data-[variant=card]:border-spacing-0 text-sm" data-slot="table" aria-label="Hydration records" data-hydration="table"><!----></table><!----></div><!----><!--]--><!--]-->';
    document.body.append(target);
    const component = hydrate(HydrationFixture, { target });

    expect(warning).not.toHaveBeenCalled();
    expect(target.querySelector('[data-hydration="table"]')).not.toBeNull();
    await unmount(component);
    warning.mockRestore();
  });
});
