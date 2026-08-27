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
    expect(slots[0]?.hasAttribute("aria-label")).toBe(false);
    expect(slots[0]?.hasAttribute("aria-labelledby")).toBe(false);

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
    slots[3]?.focus();
    await userEvent.keyboard("{Backspace}");
    expect(slots.map((slot) => slot.value)).toEqual(["1", "2", "3", "", "", ""]);
    expect(document.activeElement).toBe(slots[2]);
    await userEvent.keyboard("{Delete}");
    expect(document.activeElement).toBe(slots[2]);

    const transfer = new DataTransfer();
    transfer.setData("text/plain", "87");
    slots[1]?.focus();
    slots[1]?.setSelectionRange(0, 1);
    slots[1]?.dispatchEvent(
      new ClipboardEvent("paste", { bubbles: true, clipboardData: transfer }),
    );
    await expect.element(slots[1] as HTMLInputElement).toHaveValue("8");
    expect(slots.map((slot) => slot.value)).toEqual(["1", "8", "7", "", "", ""]);
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

    const alpha = page.getByTestId("alpha-otp");
    await userEvent.click(alpha);
    await userEvent.keyboard("a7B");
    const alphaRoot = document.querySelector('[aria-label="Alpha code"]');
    expect(
      Array.from(
        alphaRoot?.querySelectorAll<HTMLInputElement>('[data-slot="otp-field-input"]') ?? [],
      )
        .map((slot) => slot.value)
        .join(""),
    ).toBe("aB");

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
    const fieldSlot = await page.getByTestId("field-otp-first").element();
    const fieldRoot = fieldSlot.closest<HTMLElement>('[data-slot="field"]');
    const fieldOtp = fieldRoot?.querySelector<HTMLElement>('[data-slot="otp-field"]');
    const fieldLabel = fieldRoot?.querySelector<HTMLElement>('[data-slot="field-label"]');
    const fieldDescription = fieldRoot?.querySelector<HTMLElement>(
      '[data-slot="field-description"]',
    );
    await expect
      .element(fieldOtp as HTMLElement)
      .toHaveAttribute("aria-labelledby", fieldLabel?.id);
    await expect
      .element(fieldOtp as HTMLElement)
      .toHaveAttribute("aria-describedby", fieldDescription?.id);
    expect(fieldSlot.getAttribute("aria-labelledby")).toBe(fieldLabel?.id);
    expect(fieldSlot.hasAttribute("aria-describedby")).toBe(false);

    await new Promise(requestAnimationFrame);
    await new Promise(requestAnimationFrame);
    await userEvent.click(page.getByTestId("toggle-field-error"));
    await expect.element(page.getByText("Security code is invalid.")).toBeVisible();
    const fieldError = fieldRoot?.querySelector<HTMLElement>("#field-security-error");
    expect(fieldError).toBeInstanceOf(HTMLElement);
    await expect
      .element(fieldOtp as HTMLElement)
      .toHaveAttribute("aria-describedby", fieldError?.id);
    expect(fieldSlot.hasAttribute("aria-describedby")).toBe(false);

    expect(recoverySlots[0]?.getAttribute("aria-label")).toBe("Recovery character 1");

    const custom = page.getByTestId("custom-otp");
    await userEvent.click(custom);
    await userEvent.keyboard("4");
    await expect.element(custom).toHaveValue("");
    await expect.element(page.getByTestId("otp-invalid-state")).toHaveTextContent("4");

    const normalized = page.getByTestId("normalized-otp");
    await userEvent.click(normalized);
    await userEvent.keyboard("a");
    await expect.element(page.getByTestId("normalized-state")).toHaveTextContent("A:");
  });

  test("reconciles dynamic slots and native internal and external forms", async () => {
    render(OTPFieldFixture);
    const dynamicFirst = page.getByTestId("dynamic-first");
    await userEvent.click(dynamicFirst);
    await userEvent.keyboard("123");
    await userEvent.click(page.getByTestId("toggle-dynamic"));
    const remaining = Array.from(
      document.querySelectorAll<HTMLInputElement>(
        '[aria-label="Dynamic code"] [data-slot="otp-field-input"]',
      ),
    );
    expect(remaining).toHaveLength(2);
    expect(remaining.map((slot) => slot.value)).toEqual(["1", "2"]);
    await userEvent.click(page.getByTestId("toggle-dynamic"));
    const remounted = Array.from(
      document.querySelectorAll<HTMLInputElement>(
        '[aria-label="Dynamic code"] [data-slot="otp-field-input"]',
      ),
    );
    expect(remounted).toHaveLength(3);
    remounted[1]?.focus();
    await userEvent.keyboard("9");
    expect(remounted.map((slot) => slot.value)).toEqual(["1", "9", "3"]);

    const external = document.querySelector<HTMLFormElement>("#external-otp-form");
    const externalFirst = document.querySelector<HTMLInputElement>(
      '[data-testid="external-first"]',
    );
    const externalSecond = document.querySelector<HTMLInputElement>(
      '[data-testid="external-second"]',
    );
    expect(externalFirst?.form).toBe(external);
    expect(externalSecond?.form).toBe(external);
    expect(new FormData(external ?? undefined).getAll("external-code")).toEqual(["12"]);
    externalFirst?.focus();
    await userEvent.keyboard("9");
    expect(new FormData(external ?? undefined).getAll("external-code")).toEqual(["92"]);
    external?.reset();
    await Promise.resolve();
    await expect.element(page.getByTestId("reset-state")).toHaveTextContent("12");

    const slots = primarySlots();
    expect(slots[0]?.form).toBe(document.querySelector('[data-testid="otp-form"]'));
    expect(slots[0]?.required).toBe(true);
    expect(
      document.querySelector<HTMLFormElement>('[data-testid="otp-form"]')?.checkValidity(),
    ).toBe(false);
  });

  test("keeps the separator semantic and exact", () => {
    render(OTPFieldFixture);
    const separator = document.querySelector(
      '[aria-label="Verification code"] [data-slot="separator"]',
    );
    expect(separator?.getAttribute("role")).toBe("separator");
    expect(separator?.getAttribute("aria-orientation")).toBe("horizontal");
    expect(separator?.hasAttribute("aria-hidden")).toBe(false);
    expect(separator?.className).toContain("h-0.5");
    expect(separator?.className).toContain("w-3");
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
