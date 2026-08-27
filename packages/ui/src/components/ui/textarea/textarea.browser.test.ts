import { hydrate, unmount } from "svelte";
import { afterEach, describe, expect, test, vi } from "vitest";
import { page } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import TextareaFixture from "./textarea.browser-fixture.svelte";
import Textarea from "./textarea.svelte";

afterEach(() => {
  document.body.innerHTML = "";
});

describe("Textarea browser contract", () => {
  test("forwards refs, values, events, form fields, and native state", async () => {
    render(TextareaFixture);
    const textarea = page.getByTestId("bound-textarea");
    await expect.element(textarea).toHaveValue("Draft");
    await expect.element(page.getByTestId("textarea-state")).toHaveTextContent("Draft:0:TEXTAREA");
    await textarea.fill("Sent");
    await expect.element(page.getByTestId("textarea-state")).toHaveTextContent("Sent:1:TEXTAREA");

    const defaultValueTextarea = page.getByTestId("default-value-textarea");
    await expect.element(defaultValueTextarea).toHaveValue("Default draft");

    const callbackTextarea = page.getByTestId("callback-textarea");
    await callbackTextarea.fill("Callback draft");
    await expect
      .element(page.getByTestId("textarea-callback-state"))
      .toHaveTextContent("Callback draft");

    const form = document.querySelector<HTMLFormElement>('[data-testid="textarea-form"]');
    expect(form).not.toBeNull();
    expect(new FormData(form ?? undefined).get("message")).toBe("Sent");
    expect(new FormData(form ?? undefined).get("defaulted")).toBe("Default draft");
    await expect.element(page.getByTestId("readonly-textarea")).toHaveAttribute("readonly");
    await expect
      .element(page.getByTestId("readonly-textarea"))
      .toHaveAttribute("aria-invalid", "true");

    const fieldTextarea = page.getByTestId("field-textarea");
    await fieldTextarea.fill("valid");
    await expect.element(fieldTextarea).toHaveAttribute("data-dirty");
    await expect.element(fieldTextarea).toHaveAttribute("data-filled");

    const validatedTextarea = page.getByTestId("validated-textarea");
    await expect.element(validatedTextarea).toHaveValue("Initial message");
    await validatedTextarea.fill("");
    const textareaError = page.getByTestId("textarea-error");
    await expect.element(textareaError).toHaveTextContent("Message is required.");
    await expect.element(validatedTextarea).toHaveAttribute("aria-invalid", "true");
    const errorId = (await textareaError.element()).id;
    expect(errorId).not.toBe("");
    await expect.element(validatedTextarea).toHaveAttribute("aria-describedby", errorId);
  });

  test("hydrates the Shards-backed textarea without a mismatch", async () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const target = document.createElement("div");
    target.innerHTML = `<span data-size="default" data-slot="textarea-control"><textarea id="hydrated-textarea" data-slot="textarea" class="field-sizing-content min-h-17.5 w-full rounded-[inherit] px-[calc(--spacing(3)-1px)] py-[calc(--spacing(1.5)-1px)] text-foreground outline-none placeholder:text-muted-foreground/72 max-sm:min-h-20.5"></textarea></span>`;
    document.body.append(target);

    const component = hydrate(Textarea, {
      props: { id: "hydrated-textarea", unstyled: true },
      target,
    });

    expect(warning).not.toHaveBeenCalled();
    expect(target.querySelector("textarea")?.id).toBe("hydrated-textarea");
    await unmount(component);
    warning.mockRestore();
  });
});
