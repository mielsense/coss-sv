import { hydrate, unmount } from "svelte";
import { afterEach, describe, expect, test, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import InputFixture from "./input.browser-fixture.svelte";
import Input from "./input.svelte";
import InputFieldHydrationFixture from "./input-field.hydration-fixture.svelte";
import { inputFieldHydrationHtml } from "./input-field.hydration-html.js";

afterEach(() => {
  document.body.innerHTML = "";
});

describe("Input browser contract", () => {
  test("forwards refs, value changes, events, form fields, and state attributes", async () => {
    render(InputFixture);

    const input = page.getByTestId("bound-input");
    await expect.element(input).toHaveValue("seed");
    await expect.element(input).toHaveAttribute("data-forwarded", "yes");
    await expect.element(input).toHaveAttribute("data-slot", "input");
    await expect.element(page.getByTestId("input-state")).toHaveTextContent("seed:0:INPUT");

    await input.fill("updated");
    await expect.element(page.getByTestId("input-state")).toHaveTextContent("updated:1:INPUT");

    const defaultValueInput = page.getByTestId("default-value-input");
    await expect.element(defaultValueInput).toHaveValue("default seed");

    const callbackInput = page.getByTestId("callback-input");
    await callbackInput.fill("callback value");
    await expect
      .element(page.getByTestId("input-callback-state"))
      .toHaveTextContent("callback value");

    const nativeInput = page.getByTestId("native-input");
    await expect.element(nativeInput).toHaveValue("native seed");
    await expect
      .element(page.getByTestId("native-input-state"))
      .toHaveTextContent("native seed:0:INPUT");
    await nativeInput.fill("native value");
    await expect
      .element(page.getByTestId("native-input-state"))
      .toHaveTextContent("native value:1:INPUT");
    await expect
      .element(page.getByTestId("native-default-value-input"))
      .toHaveValue("native default");

    const form = document.querySelector<HTMLFormElement>('[data-testid="input-form"]');
    expect(form).not.toBeNull();
    expect(new FormData(form ?? undefined).get("query")).toBe("updated");
    expect(new FormData(form ?? undefined).get("defaulted")).toBe("default seed");
    expect(new FormData(form ?? undefined).get("native")).toBe("native value");
    expect(new FormData(form ?? undefined).get("native-defaulted")).toBe("native default");

    const fileInput = document.querySelector<HTMLInputElement>('[data-testid="file-input"]');
    const nativeFileInput = document.querySelector<HTMLInputElement>(
      '[data-testid="native-file-input"]',
    );
    expect(fileInput).not.toBeNull();
    expect(nativeFileInput).not.toBeNull();

    const shardFile = new File(["shards"], "shards.txt", { type: "text/plain" });
    const shardTransfer = new DataTransfer();
    shardTransfer.items.add(shardFile);
    if (fileInput) {
      fileInput.files = shardTransfer.files;
      fileInput.dispatchEvent(new Event("change", { bubbles: true }));
    }

    const nativeFile = new File(["native"], "native.txt", { type: "text/plain" });
    const nativeTransfer = new DataTransfer();
    nativeTransfer.items.add(nativeFile);
    if (nativeFileInput) {
      nativeFileInput.files = nativeTransfer.files;
      nativeFileInput.dispatchEvent(new Event("change", { bubbles: true }));
    }

    expect(fileInput?.files?.item(0)?.name).toBe("shards.txt");
    expect(nativeFileInput?.files?.item(0)?.name).toBe("native.txt");
    const submittedData = new FormData(form ?? undefined);
    expect((submittedData.get("asset") as File).name).toBe("shards.txt");
    expect((submittedData.get("native-asset") as File).name).toBe("native.txt");
    await expect.element(page.getByTestId("file-state")).toHaveTextContent("1:1");
    await expect.element(page.getByTestId("invalid-input")).toHaveAttribute("aria-invalid", "true");
    await expect.element(page.getByTestId("invalid-input")).toBeDisabled();

    const fieldInput = page.getByTestId("field-input");
    await fieldInput.fill("valid");
    await expect.element(fieldInput).toHaveAttribute("data-dirty");
    await expect.element(fieldInput).toHaveAttribute("data-filled");

    const nullAriaInput = page.getByTestId("null-aria-input");
    await expect.element(nullAriaInput).not.toHaveAttribute("aria-labelledby");
    await expect.element(nullAriaInput).not.toHaveAttribute("aria-describedby");
    await expect.element(nullAriaInput).toHaveAccessibleName("Removed input label");

    const mergedAriaInput = page.getByTestId("merged-aria-input");
    await expect.element(mergedAriaInput).toHaveAccessibleName("Inherited input label");
    await expect
      .element(mergedAriaInput)
      .toHaveAccessibleDescription("External input description Inherited input description");
  });

  test("hydrates the native-input escape hatch without a mismatch", async () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const target = document.createElement("div");
    target.innerHTML = `<span data-size="default" data-slot="input-control"><input type="text" data-slot="input" class="h-8.5 w-full min-w-0 rounded-[inherit] px-[calc(--spacing(3)-1px)] text-foreground leading-8.5 outline-none [transition:background-color_5000000s_ease-in-out_0s] placeholder:text-muted-foreground/72 sm:h-7.5 sm:leading-7.5 autofill:[-webkit-text-fill-color:var(--foreground)]" id="hydrated-input"></span>`;
    document.body.append(target);

    const component = hydrate(Input, {
      props: { id: "hydrated-input", nativeInput: true, type: "text", unstyled: true },
      target,
    });

    expect(warning).not.toHaveBeenCalled();
    expect(target.querySelector("input")?.id).toBe("hydrated-input");
    await unmount(component);
    warning.mockRestore();
  });

  test("reconciles reactive Field descriptions across null, inherited, merged, and rapid transitions", async () => {
    render(InputFixture);
    const input = page.getByTestId("reactive-aria-input");

    await expect.element(input).not.toHaveAttribute("aria-describedby");
    await userEvent.click(page.getByTestId("input-description-inherit"));
    await expect
      .element(input)
      .toHaveAttribute("aria-describedby", "reactive-input-field-description");
    await userEvent.click(page.getByTestId("input-description-external"));
    await expect
      .element(input)
      .toHaveAttribute(
        "aria-describedby",
        "reactive-input-external reactive-input-field-description",
      );
    await userEvent.click(page.getByTestId("input-description-remove"));
    await expect.element(input).not.toHaveAttribute("aria-describedby");
    await userEvent.click(page.getByTestId("input-description-race"));
    await expect
      .element(input)
      .toHaveAttribute(
        "aria-describedby",
        "reactive-input-external reactive-input-field-description",
      );
  });

  test("disconnects the null-removal observer when a Field input unmounts", async () => {
    render(InputFixture);
    const input = document.querySelector<HTMLInputElement>('[data-testid="reactive-aria-input"]');
    if (!input) throw new Error("reactive input missing");

    await userEvent.click(page.getByTestId("input-description-mount"));
    input.setAttribute("aria-describedby", "detached-description");
    await Promise.resolve();
    expect(input.getAttribute("aria-describedby")).toBe("detached-description");
  });

  test("hydrates inherited and explicitly removed Field relationships without a mismatch", async () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const target = document.createElement("div");
    target.innerHTML = inputFieldHydrationHtml;
    document.body.append(target);

    const component = hydrate(InputFieldHydrationFixture, { target });
    const inherited = target.querySelector<HTMLInputElement>(
      '[data-testid="hydrated-field-input"]',
    );
    const inheritedLabel = target.querySelector<HTMLLabelElement>("label");
    const removedLabel = target.querySelector<HTMLLabelElement>("#removed-input-label");
    const removed = page.getByTestId("hydrated-null-input");

    await expect
      .element(inherited as HTMLInputElement)
      .toHaveAttribute("aria-labelledby", inheritedLabel?.id ?? "missing-label");
    await expect
      .element(inherited as HTMLInputElement)
      .toHaveAttribute("aria-describedby", "hydrated-input-description");
    await expect.element(removed).not.toHaveAttribute("aria-labelledby");
    await expect.element(removed).not.toHaveAttribute("aria-describedby");
    expect(inheritedLabel?.htmlFor).toBe(inherited?.id);
    expect(removedLabel?.htmlFor).toBe("hydrated-null-input");
    expect(warning).not.toHaveBeenCalled();
    expect(error).not.toHaveBeenCalled();

    await unmount(component);
    warning.mockRestore();
    error.mockRestore();
  });
});
