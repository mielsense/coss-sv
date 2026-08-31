import { hydrate, unmount } from "svelte";
import { afterEach, describe, expect, test, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import { render } from "vitest-browser-svelte";
import OTPFieldFixture from "./otp-field.browser-fixture.svelte";
import OTPFieldHydrationFixture from "./otp-field.hydration-fixture.svelte";
import {
  otpFieldDefaultRootHtml,
  otpFieldEmptyRootHtml,
  otpFieldHydrationHtml,
} from "./otp-field.hydration-html.js";
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
    expect(slots.map((slot) => slot.id)).toEqual([
      "verification-code",
      "verification-code-2",
      "verification-code-3",
      "verification-code-4",
      "verification-code-5",
      "verification-code-6",
    ]);

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
    await expect
      .element(page.getByTestId("otp-state"))
      .toHaveTextContent("123456:123456:3:input-paste:paste:1:input-paste:paste");
    expect(slots.map((slot) => slot.value)).toEqual(["1", "2", "3", "4", "5", "6"]);

    const form = document.querySelector<HTMLFormElement>('[data-testid="otp-form"]');
    expect(new FormData(form ?? undefined).getAll("code")).toEqual(["123456"]);

    const sameValue = new DataTransfer();
    sameValue.setData("text/plain", "123456");
    slots[0]?.dispatchEvent(
      new ClipboardEvent("paste", { bubbles: true, clipboardData: sameValue }),
    );
    await expect
      .element(page.getByTestId("otp-state"))
      .toHaveTextContent("123456:123456:3:input-paste:paste:2:input-paste:paste");
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

    slots[2]?.focus();
    await userEvent.keyboard("{Control>}{Backspace}{/Control}");
    expect(slots.map((slot) => slot.value)).toEqual(["", "", "", "", "", ""]);

    const rtl = [
      await page.getByTestId("rtl-first").element(),
      await page.getByTestId("rtl-second").element(),
      await page.getByTestId("rtl-third").element(),
    ];
    rtl[1]?.focus();
    await userEvent.keyboard("{ArrowLeft}");
    expect(document.activeElement).toBe(rtl[2]);
    await userEvent.keyboard("{ArrowUp}");
    expect(document.activeElement).toBe(rtl[1]);
    await userEvent.keyboard("{Control>}{ArrowRight}{/Control}");
    expect(document.activeElement).toBe(rtl[0]);
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
    expect(disabled?.querySelectorAll('[data-slot="otp-field-input"]:disabled')).toHaveLength(2);
    const readOnly = document.querySelector('[aria-label="Read only code"]');
    const readOnlySlots = Array.from(
      readOnly?.querySelectorAll<HTMLInputElement>('[data-slot="otp-field-input"]') ?? [],
    );
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

    const explicitFieldSlot = page.getByTestId("explicit-field-otp-first");
    await expect.element(explicitFieldSlot).toHaveAccessibleName("Explicit character");
    await expect
      .element(explicitFieldSlot)
      .toHaveAttribute("aria-describedby", "explicit-slot-description");
    expect(explicitFieldSlot.element().hasAttribute("aria-labelledby")).toBe(false);

    await new Promise(requestAnimationFrame);
    await new Promise(requestAnimationFrame);
    await userEvent.click(page.getByTestId("toggle-field-error"));
    await expect.element(page.getByText("Security code is invalid.")).toBeVisible();
    const fieldError = fieldRoot?.querySelector<HTMLElement>("#field-security-error");
    const invalidFieldLabel = fieldRoot?.querySelector<HTMLElement>(
      "#field-security-label-invalid",
    );
    expect(fieldError).toBeInstanceOf(HTMLElement);
    await expect
      .element(fieldOtp as HTMLElement)
      .toHaveAttribute("aria-labelledby", invalidFieldLabel?.id);
    await expect
      .element(fieldOtp as HTMLElement)
      .toHaveAttribute("aria-describedby", fieldError?.id);
    await expect.element(fieldSlot).toHaveAttribute("aria-labelledby", invalidFieldLabel?.id);
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

    await userEvent.click(page.getByTestId("cancelled-otp"));
    await userEvent.keyboard("1");
    await expect.element(page.getByTestId("cancelled-state")).toHaveTextContent("");
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
    expect(externalFirst?.form).toBeNull();
    expect(externalSecond?.form).toBeNull();
    expect(new FormData(external ?? undefined).getAll("external-code")).toEqual(["12"]);
    externalFirst?.focus();
    await userEvent.keyboard("9");
    expect(new FormData(external ?? undefined).getAll("external-code")).toEqual(["92"]);
    external?.reset();
    await Promise.resolve();
    await expect.element(page.getByTestId("reset-state")).toHaveTextContent("12");

    const slots = primarySlots();
    expect(slots[0]?.form).toBe(document.querySelector('[data-testid="otp-form"]'));
    expect(slots[0]?.required).toBe(false);
    const validationInput = document.querySelector<HTMLInputElement>(
      '[aria-label="Verification code"] > input[aria-hidden="true"]',
    );
    expect(validationInput?.form).toBe(document.querySelector('[data-testid="otp-form"]'));
    expect(validationInput?.required).toBe(true);
    expect(validationInput?.minLength).toBe(6);
    expect(validationInput?.maxLength).toBe(6);
    expect(validationInput?.pattern).toBe("[0-9]{6}");
    expect(
      document.querySelector<HTMLFormElement>('[data-testid="otp-form"]')?.checkValidity(),
    ).toBe(false);

    const fieldOwnedForm = document.querySelector<HTMLFormElement>(
      '[data-testid="field-owned-otp-form"]',
    );
    const fieldOwnedNative = fieldOwnedForm?.querySelector<HTMLInputElement>(
      '[data-slot="otp-field"] > input[aria-hidden="true"]',
    );
    expect(fieldOwnedNative?.name).toBe("field-owned-code");
    expect(fieldOwnedForm?.checkValidity()).toBe(false);
  });

  test("submits the owning form after completion", async () => {
    render(OTPFieldFixture);
    await userEvent.click(page.getByTestId("auto-submit-first"));
    await userEvent.keyboard("12");
    await expect.element(page.getByTestId("auto-submit-state")).toHaveTextContent("1");
    const form = document.querySelector<HTMLFormElement>('[data-testid="auto-submit-form"]');
    expect(new FormData(form ?? undefined).get("auto-code")).toBe("12");
  });

  test("normalizes default, controlled, reset, and submitted values without initial invalid reports", async () => {
    render(OTPFieldFixture);

    await expect.element(page.getByTestId("normalized-default-first")).toHaveValue("8");
    await expect.element(page.getByTestId("normalized-default-second")).toHaveValue("7");
    expect(
      new FormData(
        document.querySelector<HTMLFormElement>('[data-testid="normalized-otp-form"]') ?? undefined,
      ).get("normalized-default-code"),
    ).toBe("87");
    await expect.element(page.getByTestId("initial-invalid-reports")).toHaveTextContent("0");

    await expect.element(page.getByTestId("controlled-first")).toHaveValue("9");
    expect(
      new FormData(
        document.querySelector<HTMLFormElement>('[data-testid="controlled-otp-form"]') ?? undefined,
      ).get("controlled-code"),
    ).toBe("987");
    await page.getByTestId("set-controlled-invalid").click();
    await expect.element(page.getByTestId("controlled-first")).toHaveValue("4");
    expect(
      new FormData(
        document.querySelector<HTMLFormElement>('[data-testid="controlled-otp-form"]') ?? undefined,
      ).get("controlled-code"),
    ).toBe("432");

    await page.getByTestId("normalized-default-first").click();
    await userEvent.keyboard("1");
    await page.getByTestId("normalized-default-reset").click();
    await Promise.resolve();
    await expect.element(page.getByTestId("normalized-default-first")).toHaveValue("8");
    await expect.element(page.getByTestId("normalized-default-second")).toHaveValue("7");
    await expect.element(page.getByTestId("normalized-reset-state")).toHaveTextContent("87");
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
    target.innerHTML = otpFieldEmptyRootHtml;
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

  test("hydrates a normalized initial hidden value without a mismatch", async () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const target = document.createElement("div");
    target.innerHTML = otpFieldDefaultRootHtml;
    document.body.append(target);
    const component = hydrate(OTPFieldRoot, {
      props: {
        "aria-label": "Default code",
        defaultValue: " 1a 2b3 ",
        length: 2,
        name: "default-code",
      },
      target,
    });
    expect(target.querySelector<HTMLInputElement>('input[name="default-code"]')?.value).toBe("12");
    expect(warning).not.toHaveBeenCalled();
    await unmount(component);
    warning.mockRestore();
  });

  test("hydrates Field relationships without changing their ARIA targets", async () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const target = document.createElement("div");
    target.innerHTML = otpFieldHydrationHtml;
    document.body.append(target);

    const component = hydrate(OTPFieldHydrationFixture, { target });
    const group = target.querySelector<HTMLElement>('[data-slot="otp-field"]');
    const firstSlot = page.getByTestId("hydrated-security-first");
    const label = target.querySelector<HTMLLabelElement>("#hydrated-security-label");
    await expect
      .element(group as HTMLElement)
      .toHaveAttribute("aria-labelledby", "hydrated-security-label");
    await expect
      .element(group as HTMLElement)
      .toHaveAttribute("aria-describedby", "hydrated-security-description");
    await expect.element(firstSlot).toHaveAttribute("aria-labelledby", "hydrated-security-label");
    expect(firstSlot.element().hasAttribute("aria-describedby")).toBe(false);
    expect(label?.htmlFor).toBe(firstSlot.element().id);
    await label?.click();
    await expect.element(firstSlot).toHaveFocus();
    const explicitLabel = target.querySelector<HTMLLabelElement>("#hydrated-explicit-otp-label");
    const explicitFirst = page.getByTestId("hydrated-explicit-otp");
    expect(explicitLabel?.htmlFor).toBe("hydrated-explicit-otp");
    await expect.element(explicitFirst).toHaveAttribute("id", "hydrated-explicit-otp");
    expect(warning).not.toHaveBeenCalled();
    expect(error).not.toHaveBeenCalled();

    await unmount(component);
    warning.mockRestore();
    error.mockRestore();
  });

  test("moves the Field label target with OTP slot zero across unmount and remount", async () => {
    render(OTPFieldFixture);
    const label = document.querySelector<HTMLLabelElement>(
      '[data-testid="dynamic-field-otp-label"]',
    );
    const first = document.querySelector<HTMLInputElement>(
      '[data-testid="dynamic-field-otp-first"]',
    );
    const second = document.querySelector<HTMLInputElement>(
      '[data-testid="dynamic-field-otp-second"]',
    );
    expect(first?.id).not.toBe(second?.id);
    expect(label?.htmlFor).toBe(first?.id);

    await page.getByTestId("toggle-first-field-slot").click();
    await expect
      .element(page.getByTestId("dynamic-field-otp-second"))
      .toHaveAttribute("id", label?.htmlFor ?? "missing-label-target");
    await page.getByTestId("toggle-first-field-slot").click();
    const remounted = document.querySelector<HTMLInputElement>(
      '[data-testid="dynamic-field-otp-first"]',
    );
    expect(remounted?.id).not.toBe(second?.id);
    await expect
      .element(page.getByTestId("dynamic-field-otp-first"))
      .toHaveAttribute("id", label?.htmlFor ?? "missing-label-target");
  });
});
