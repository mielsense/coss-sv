import { hydrate, unmount } from "svelte";
import { afterEach, describe, expect, test, vi } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import GroupFixture from "./group.browser-fixture.svelte";
import GroupRoot from "./group-root.svelte";
import { groupClasses } from "./group-styles.js";

afterEach(() => {
  document.body.innerHTML = "";
});

describe("Group browser contract", () => {
  test("matches COSS default-attribute and polymorphic layout contracts", async () => {
    render(GroupFixture);

    await expect.element(page.getByTestId("default-group")).not.toHaveAttribute("data-orientation");
    await expect
      .element(page.getByTestId("vertical-group"))
      .toHaveAttribute("data-orientation", "vertical");
    await expect.element(page.getByTestId("vertical-group")).toHaveClass(/flex-col/);
    expect(document.querySelector('[data-testid="label-text"]')?.tagName).toBe("LABEL");
    const delegated = page.getByTestId("delegated-label");
    await expect.element(delegated).toHaveAttribute("data-slot", "group-text");
    await expect.element(delegated).toHaveAttribute("for", "delegated-domain");
    await expect.element(delegated).toHaveClass(/font-medium/);
    await expect.element(delegated).toHaveClass(/text-muted-foreground/);
    await expect.element(page.getByTestId("delegated-ref")).toHaveTextContent("LABEL");
    await delegated.click();
    await expect.element(page.getByLabelText("Domain", { exact: true })).toHaveFocus();
  });

  test("hydrates the default horizontal class set without adding an orientation attribute", async () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const target = document.createElement("div");
    target.innerHTML = `<div data-slot="group" role="group" class="${groupClasses()}" data-testid="hydrated-group"></div>`;
    document.body.append(target);

    const component = hydrate(GroupRoot, { props: { "data-testid": "hydrated-group" }, target });

    expect(warning).not.toHaveBeenCalled();
    await expect
      .element(page.getByTestId("hydrated-group"))
      .not.toHaveAttribute("data-orientation");
    await unmount(component);
    warning.mockRestore();
  });
});
