import { hydrate, unmount } from "svelte";
import { afterEach, describe, expect, test, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import CheckboxGroupFixture from "./checkbox-group.browser-fixture.svelte";
import CheckboxGroupDefaultFixture from "./checkbox-group-default.browser-fixture.svelte";
import CheckboxGroupRoot from "./checkbox-group-root.svelte";

afterEach(() => {
  document.body.innerHTML = "";
});

describe("Checkbox Group browser contract", () => {
  test("supports bindable values, callbacks, refs, disabled inheritance, and declined writes", async () => {
    render(CheckboxGroupFixture);

    const next = page.getByRole("checkbox", { name: "Next.js", exact: true });
    const vite = page.getByRole("checkbox", { name: "Vite", exact: true });
    const astro = page.getByRole("checkbox", { name: "Astro", exact: true });

    await expect.element(next).toHaveAttribute("aria-checked", "true");
    await vite.click();
    await expect.element(vite).toHaveAttribute("aria-checked", "true");
    await expect.element(page.getByTestId("basic-value")).toHaveTextContent("next,vite");
    await expect.element(page.getByTestId("basic-changes")).toHaveTextContent("next+vite");
    await expect.element(page.getByTestId("basic-ref")).toHaveTextContent("DIV");
    await expect.element(astro).toHaveAttribute("aria-disabled", "true");

    await page.getByRole("checkbox", { name: "Declined Vite" }).click();
    await expect
      .element(page.getByRole("checkbox", { name: "Declined Next.js" }))
      .toHaveAttribute("aria-checked", "true");
    await expect
      .element(page.getByRole("checkbox", { name: "Declined Vite" }))
      .toHaveAttribute("aria-checked", "false");
    await expect.element(page.getByTestId("declined-writes")).toHaveTextContent("1");

    const disabledOne = page.getByRole("checkbox", { name: "Disabled one" });
    await expect.element(disabledOne).toHaveAttribute("aria-disabled", "true");
    await disabledOne.click({ force: true });
    await expect.element(disabledOne).toHaveAttribute("aria-checked", "false");
  });

  test("derives parent state, stable controls, and select-all or clear-all behavior", async () => {
    render(CheckboxGroupFixture);

    const parent = page.getByRole("checkbox", { name: "Permissions", exact: true });
    const view = page.getByRole("checkbox", { name: "View", exact: true });
    const edit = page.getByRole("checkbox", { name: "Edit", exact: true });
    const remove = page.getByRole("checkbox", { name: "Delete", exact: true });

    await expect.element(parent).toHaveAttribute("aria-checked", "mixed");
    const controls = (await parent.element()).getAttribute("aria-controls")?.split(" ") ?? [];
    expect(controls).toHaveLength(3);
    expect(
      controls.every(
        (id) => (document.getElementById(id) as HTMLInputElement | null)?.type === "checkbox",
      ),
    ).toBe(true);

    await parent.click();
    await expect.element(parent).toHaveAttribute("aria-checked", "true");
    await expect.element(view).toHaveAttribute("aria-checked", "true");
    await expect.element(edit).toHaveAttribute("aria-checked", "true");
    await expect.element(remove).toHaveAttribute("aria-checked", "true");
    await expect.element(page.getByTestId("parent-value")).toHaveTextContent("view,edit,delete");

    await parent.click();
    await expect.element(parent).toHaveAttribute("aria-checked", "false");
    await expect.element(view).toHaveAttribute("aria-checked", "false");
    await expect.element(page.getByTestId("parent-value")).toHaveTextContent("");
  });

  test("selecting a parent excludes disabled unchecked children", async () => {
    render(CheckboxGroupFixture);

    await page.getByRole("checkbox", { name: "Select enabled permissions" }).click();

    await expect
      .element(page.getByRole("checkbox", { name: "Selectable view" }))
      .toHaveAttribute("aria-checked", "true");
    await expect
      .element(page.getByRole("checkbox", { name: "Disabled unchecked edit" }))
      .toHaveAttribute("aria-checked", "false");
    await expect
      .element(page.getByRole("checkbox", { name: "Selectable delete" }))
      .toHaveAttribute("aria-checked", "true");
    await expect
      .element(page.getByTestId("disabled-select-value"))
      .toHaveTextContent("view,delete");
  });

  test("clearing a parent preserves disabled checked children", async () => {
    render(CheckboxGroupFixture);

    await page.getByRole("checkbox", { name: "Clear enabled permissions" }).click();

    await expect
      .element(page.getByRole("checkbox", { name: "Clearable view" }))
      .toHaveAttribute("aria-checked", "false");
    await expect
      .element(page.getByRole("checkbox", { name: "Disabled checked edit" }))
      .toHaveAttribute("aria-checked", "true");
    await expect
      .element(page.getByRole("checkbox", { name: "Clearable delete" }))
      .toHaveAttribute("aria-checked", "false");
    await expect.element(page.getByTestId("disabled-clear-value")).toHaveTextContent("edit");
  });

  test("cancellable change details suppress child and parent binding writes", async () => {
    render(CheckboxGroupFixture);

    const next = page.getByRole("checkbox", { name: "Canceled Next.js" });
    const vite = page.getByRole("checkbox", { name: "Canceled Vite" });
    const parent = page.getByRole("checkbox", { name: "Canceled parent" });
    const formInputs = () =>
      Array.from(document.querySelectorAll<HTMLInputElement>('input[name="canceled"]'));

    await vite.click();
    await expect.element(page.getByTestId("canceled-writes")).toHaveTextContent("0");
    await expect.element(page.getByTestId("canceled-value")).toHaveTextContent("next");
    await expect.element(next).toHaveAttribute("aria-checked", "true");
    await expect.element(vite).toHaveAttribute("aria-checked", "false");
    expect(formInputs().map((input) => input.checked)).toEqual([true, false]);
    await expect
      .element(page.getByTestId("canceled-details"))
      .toHaveTextContent("next+vite:none:click:missing:true:true");

    await parent.click();
    await expect.element(page.getByTestId("canceled-writes")).toHaveTextContent("0");
    await expect.element(page.getByTestId("canceled-value")).toHaveTextContent("next");
    await expect.element(parent).toHaveAttribute("aria-checked", "mixed");
    await expect.element(next).toHaveAttribute("aria-checked", "true");
    await expect.element(vite).toHaveAttribute("aria-checked", "false");
    expect(formInputs().map((input) => input.checked)).toEqual([true, false]);
    await expect
      .element(page.getByTestId("canceled-details"))
      .toHaveTextContent(
        "next+vite:none:click:missing:true:true,next+vite:none:click:missing:true:true",
      );
  });

  test("retries select-on when a parent function binding rejects the write", async () => {
    render(CheckboxGroupFixture);

    const parent = page.getByRole("checkbox", { name: "Rejected parent", exact: true });
    const view = page.getByRole("checkbox", { name: "Rejected parent view", exact: true });
    const edit = page.getByRole("checkbox", { name: "Rejected parent edit", exact: true });
    const nativeInputs = () =>
      Array.from(document.querySelectorAll<HTMLInputElement>('input[name="rejected-parent"]'));

    await parent.click();
    await parent.click();

    await expect.element(page.getByTestId("rejected-parent-value")).toHaveTextContent("view");
    await expect
      .element(page.getByTestId("rejected-parent-attempts"))
      .toHaveTextContent("view+edit,view+edit");
    await expect.element(parent).toHaveAttribute("aria-checked", "mixed");
    await expect.element(view).toHaveAttribute("aria-checked", "true");
    await expect.element(edit).toHaveAttribute("aria-checked", "false");
    expect(nativeInputs().map((input) => input.checked)).toEqual([true, false]);
  });

  test("forwards form and required to a parent input while omitting its name", async () => {
    render(CheckboxGroupFixture);

    const parent = await page
      .getByRole("checkbox", { name: "External parent", exact: true })
      .element();
    const input = document.querySelector<HTMLInputElement>(`#${parent.id}-input`);
    const form = document.querySelector<HTMLFormElement>("#parent-owner");

    expect(input?.form).toBe(form);
    expect(input?.required).toBe(true);
    expect(input?.hasAttribute("name")).toBe(false);
    expect(new FormData(form ?? undefined).has("parent-must-not-submit")).toBe(false);
  });

  test("keeps nested parent groups synchronized through their public callbacks", async () => {
    render(CheckboxGroupFixture);

    const innerParent = page.getByRole("checkbox", { name: "Manage users" });
    await innerParent.click();
    await expect.element(innerParent).toHaveAttribute("aria-checked", "true");
    await expect.element(page.getByTestId("inner-value")).toHaveTextContent("create,edit");
    await expect.element(page.getByTestId("outer-value")).toHaveTextContent("manage");

    await page.getByRole("checkbox", { name: "Create user" }).click();
    await expect.element(innerParent).toHaveAttribute("aria-checked", "mixed");
    await expect.element(page.getByTestId("inner-value")).toHaveTextContent("edit");
    await expect.element(page.getByTestId("outer-value")).toHaveTextContent("");
  });

  test("uses independent checkbox keyboard order and submits every checked value", async () => {
    render(CheckboxGroupFixture);

    const next = page.getByRole("checkbox", { name: "Next.js", exact: true });
    const vite = page.getByRole("checkbox", { name: "Vite", exact: true });
    (await next.element()).focus();
    await userEvent.keyboard("{Space}");
    await expect.element(next).toHaveAttribute("aria-checked", "false");
    await userEvent.keyboard("{ArrowRight}");
    await expect.element(next).toHaveFocus();
    await userEvent.keyboard("{Tab}");
    await expect.element(vite).toHaveFocus();

    await page.getByRole("checkbox", { name: "Form Vite" }).click();
    await page.getByRole("button", { name: "Submit frameworks" }).click();
    await expect.element(page.getByTestId("submitted-value")).toHaveTextContent("next,vite");
  });

  test("reads defaultValue once and ignores later default prop changes", async () => {
    const view = render(CheckboxGroupDefaultFixture, { defaultValue: ["one"] });
    const one = page.getByRole("checkbox", { name: "Default one" });
    const two = page.getByRole("checkbox", { name: "Default two" });

    await expect.element(one).toHaveAttribute("aria-checked", "true");
    await view.rerender({ defaultValue: ["two"] });
    await expect.element(one).toHaveAttribute("aria-checked", "true");
    await expect.element(two).toHaveAttribute("aria-checked", "false");
  });

  test("hydrates the exact empty server root without a mismatch", async () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const target = document.createElement("div");
    target.innerHTML =
      '<!--[--><!--$s1--><!--$s2--><!----><div role="group" class="flex flex-col items-start gap-3"><!----><!----></div><!----><!--]-->';
    document.body.append(target);

    const component = hydrate(CheckboxGroupRoot, { target });

    expect(warning).not.toHaveBeenCalled();
    expect(target.querySelector('[role="group"]')).not.toBeNull();
    await unmount(component);
    warning.mockRestore();
  });
});
