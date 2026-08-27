import { hydrate, unmount } from "svelte";
import { afterEach, describe, expect, test, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import OTPFieldFixture from "./otp-field.browser-fixture.svelte";
import OTPFieldRoot from "./otp-field-root.svelte";

afterEach(() => {
  document.body.innerHTML = "";
});

function primarySlots(): HTMLInputElement[] {
  const root = document.querySelector('[aria-label="Verification code"]');
  return Array.from(
    root?.querySelectorAll<HTMLInputElement>('[data-slot="otp-field-input"]') ?? [],
  );
}

describe("OTPField browser contract", () => {
  test("types, advances, pastes, completes, binds, and submits one value", async () => {
    render(OTPFieldFixture);
    const slots = primarySlots();
    expect(slots).toHaveLength(6);
    expect(slots[0]?.autocomplete).toBe("one-time-code");
    expect(slots[0]?.inputMode).toBe("numeric");
    expect(slots[0]?.tabIndex).toBe(0);
    expect(slots[1]?.tabIndex).toBe(-1);

    slots[0]?.focus();
    await userEvent.keyboard("12");
    expect(slots.map((slot) => slot.value)).toEqual(["1", "2", "", "", "", ""]);
    expect(document.activeElement).toBe(slots[2]);

    slots[2]?.dispatchEvent(
      new ClipboardEvent("paste", {
        bubbles: true,
        clipboardData: new DataTransfer(),
      }),
    );
    const transfer = new DataTransfer();
    transfer.setData("text/plain", "3456");
    slots[2]?.dispatchEvent(
      new ClipboardEvent("paste", { bubbles: true, clipboardData: transfer }),
    );
    await expect.element(page.getByTestId("otp-state")).toHaveTextContent("123456:123456:");
    expect(slots.map((slot) => slot.value)).toEqual(["1", "2", "3", "4", "5", "6"]);

    const form = document.querySelector<HTMLFormElement>('[data-testid="otp-form"]');
    expect(new FormData(form ?? undefined).getAll("code")).toEqual(["123456"]);
  });

  test("supports arrows, replacement, Backspace, Delete, and partial paste", async () => {
    render(OTPFieldFixture);
    const slots = primarySlots();
    slots[0]?.focus();
    await userEvent.keyboard("1234");
    expect(document.activeElement).toBe(slots[4]);
    await userEvent.keyboard("{ArrowLeft}");
    expect(document.activeElement).toBe(slots[3]);
    await userEvent.keyboard("9");
    expect(slots[3]?.value).toBe("9");
    await userEvent.keyboard("{Backspace}");
    expect(slots[3]?.value).toBe("");
    expect(document.activeElement).toBe(slots[3]);
    await userEvent.keyboard("{Delete}");
    expect(document.activeElement).toBe(slots[3]);
  });

  test("supports alphanumeric, disabled, read-only, and accessibility semantics", async () => {
    render(OTPFieldFixture);
    const recovery = document.querySelector('[aria-label="Recovery code"]');
    const recoverySlots = Array.from(
      recovery?.querySelectorAll<HTMLInputElement>('[data-slot="otp-field-input"]') ?? [],
    );
    recoverySlots[0]?.focus();
    await userEvent.keyboard("A-7x");
    expect(recoverySlots.map((slot) => slot.value).join("")).toBe("A7x");

    const disabled = document.querySelector('[aria-label="Disabled code"]');
    expect(disabled?.querySelectorAll("input:disabled")).toHaveLength(2);
    const readOnly = document.querySelector('[aria-label="Read only code"]');
    const readOnlySlots = Array.from(readOnly?.querySelectorAll<HTMLInputElement>("input") ?? []);
    expect(readOnlySlots.every((slot) => slot.readOnly)).toBe(true);
    readOnlySlots[0]?.focus();
    await userEvent.keyboard("9");
    expect(readOnlySlots.map((slot) => slot.value).join("")).toBe("12");

    await expect.element(page.getByTestId("field-otp-first")).toHaveAccessibleName("Security code");
    await expect
      .element(page.getByTestId("field-otp-second"))
      .toHaveAccessibleName("Security character 2");

    const custom = page.getByTestId("custom-otp");
    await userEvent.click(custom);
    await userEvent.keyboard("4");
    await expect.element(custom).toHaveValue("");
    await expect.element(page.getByTestId("otp-invalid-state")).toHaveTextContent("4");
  });

  test("hydrates its SSR root without a mismatch", async () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const target = document.createElement("div");
    target.innerHTML = `<!--[--><div aria-label="Code" class="flex items-center gap-2 has-disabled:opacity-64 has-disabled:**:data-[slot=otp-field-input]:shadow-none has-disabled:**:data-[slot=otp-field-input]:before:shadow-none!" data-size="default" data-slot="otp-field" role="group"><!----> <!--[-1--><!--]--></div><!--]-->`;
    document.body.append(target);
    const component = hydrate(OTPFieldRoot, {
      props: { "aria-label": "Code", length: 2 },
      target,
    });
    expect(target.querySelector('[data-slot="otp-field"]')).not.toBeNull();
    expect(warning).not.toHaveBeenCalled();
    await unmount(component);
    warning.mockRestore();
  });
});
