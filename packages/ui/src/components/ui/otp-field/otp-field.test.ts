import { createRawSnippet } from "svelte";
import { render } from "svelte/server";
import { describe, expect, test, vi } from "vitest";
import * as OTPField from "./index.js";
import OTPFieldHydrationFixture from "./otp-field.hydration-fixture.svelte";
import { otpFieldHydrationHtml } from "./otp-field.hydration-html.js";
import OTPFieldSSRFixture from "./otp-field.ssr-fixture.svelte";
import { normalizeOTP, normalizeOTPValue } from "./otp-field-machine.js";

describe("OTPField contract", () => {
  test.each([
    ["12a3", "numeric", "123"],
    ["A7-xy", "alpha", "Axy"],
    ["A7-x9", "alphanumeric", "A7x9"],
    ["0-3", "none", "0-3"],
  ] as const)("normalizes %s as %s", (raw, type, expected) => {
    expect(normalizeOTP(raw, type)).toBe(expected);
  });

  test("normalizes initial values in the upstream order without reporting user-entry errors", () => {
    expect(normalizeOTPValue(" 1a 2b3 ", 2, "numeric")).toBe("12");
    expect(normalizeOTPValue(" a b c ", 2, "none")).toBe("ab");
    expect(normalizeOTPValue("a-7z", 3, "alphanumeric", (value) => value.toUpperCase())).toBe(
      "A7Z",
    );
    expect(normalizeOTPValue("a7", 2, "alpha", (value) => `${value}9B`)).toBe("aB");

    const invalid = vi.fn();
    const defaultMarkup = render(OTPField.Root, {
      props: {
        "aria-label": "Default code",
        defaultValue: " 1a 2b3 ",
        length: 2,
        name: "default-code",
        onValueInvalid: invalid,
      },
    }).body;
    const controlledMarkup = render(OTPField.Root, {
      props: {
        "aria-label": "Controlled code",
        length: 3,
        name: "controlled-code",
        value: " 98x76 ",
      },
    }).body;

    expect(defaultMarkup).toMatch(/name="default-code"[^>]*value="12"/);
    expect(controlledMarkup).toMatch(/name="controlled-code"[^>]*value="987"/);
    expect(invalid).not.toHaveBeenCalled();
  });

  test("renders root semantics, exact classes, and a single hidden form value", () => {
    const children = createRawSnippet(() => ({
      render: () => `<input data-slot="otp-field-input">`,
    }));
    const { body } = render(OTPField.Root, {
      props: { "aria-label": "Verification code", children, length: 6, name: "code" },
    });
    expect(body).toContain('role="group"');
    expect(body).toContain('data-slot="otp-field"');
    expect(body).toContain('aria-label="Verification code"');
    expect(body).toContain("flex items-center gap-2");
    expect(body).toContain('aria-hidden="true"');
    expect(body).toContain('type="text"');
    expect(body).toContain('minlength="6"');
    expect(body).toContain('maxlength="6"');
    expect(body).toContain('pattern="[0-9]{6}"');
    expect(body).toContain('name="code"');
  });

  test("renders a native slot and exact separator geometry", () => {
    const slot = render(OTPFieldSSRFixture).body;
    expect(slot).toContain("<input");
    expect(slot).toContain('data-slot="otp-field-input"');
    expect(slot).toContain('spellcheck="false"');
    expect(slot).toContain("size-9");

    expect(slot).toContain('data-slot="separator"');
    expect(slot).toContain('role="separator"');
    const separator = slot.match(/<div[^>]*data-slot="separator"[^>]*>/)?.[0];
    expect(separator).not.toContain('aria-hidden="true"');
    expect(slot).toContain("h-0.5");
    expect(slot).toContain("w-3");
    expect(slot).toMatch(
      /<div[^>]*aria-describedby="ssr-security-description"[^>]*aria-labelledby="ssr-security-label"[^>]*data-slot="otp-field"|<div[^>]*aria-labelledby="ssr-security-label"[^>]*aria-describedby="ssr-security-description"[^>]*data-slot="otp-field"/,
    );
    expect(slot).toMatch(
      /<input[^>]*aria-labelledby="ssr-security-label"[^>]*data-slot="otp-field-input"/,
    );
    const fieldLabel = slot.match(/<label[^>]*id="ssr-security-label"[^>]*>/)?.[0];
    const firstSlot = slot.match(/<input[^>]*aria-labelledby="ssr-security-label"[^>]*>/)?.[0];
    expect(fieldLabel?.match(/for="([^"]+)"/)?.[1]).toBe(firstSlot?.match(/id="([^"]+)"/)?.[1]);
  });

  test("keeps genuine Field hydration HTML synchronized with server output", () => {
    const body = render(OTPFieldHydrationFixture).body;
    const label = body.match(/<label[^>]*id="hydrated-security-label"[^>]*>/)?.[0];
    const first = body.match(/<input[^>]*data-testid="hydrated-security-first"[^>]*>/)?.[0];
    expect(label?.match(/for="([^"]+)"/)?.[1]).toBe(first?.match(/id="([^"]+)"/)?.[1]);
    expect(otpFieldHydrationHtml).toBe(body);
  });

  test("exports namespace and compatibility aliases", () => {
    expect(OTPField.OTPField).toBe(OTPField.Root);
    expect(OTPField.OTPFieldInput).toBe(OTPField.Input);
    expect(OTPField.OTPFieldSeparator).toBe(OTPField.Separator);
  });
});
