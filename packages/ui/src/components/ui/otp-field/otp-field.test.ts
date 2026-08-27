import { createRawSnippet } from "svelte";
import { render } from "svelte/server";
import { describe, expect, test } from "vitest";
import * as OTPField from "./index.js";
import OTPFieldSSRFixture from "./otp-field.ssr-fixture.svelte";
import { normalizeOTP } from "./otp-field-machine.js";

describe("OTPField contract", () => {
  test.each([
    ["12a3", "numeric", "123"],
    ["A7-xy", "alpha", "Axy"],
    ["A7-x9", "alphanumeric", "A7x9"],
    ["0-3", "none", "0-3"],
  ] as const)("normalizes %s as %s", (raw, type, expected) => {
    expect(normalizeOTP(raw, type)).toBe(expected);
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
    expect(body).toContain('type="hidden"');
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
    expect(slot).not.toContain('aria-hidden="true"');
    expect(slot).toContain("h-0.5");
    expect(slot).toContain("w-3");
    expect(slot).toMatch(
      /<div[^>]*aria-describedby="ssr-security-description"[^>]*aria-labelledby="ssr-security-label"[^>]*data-slot="otp-field"|<div[^>]*aria-labelledby="ssr-security-label"[^>]*aria-describedby="ssr-security-description"[^>]*data-slot="otp-field"/,
    );
    expect(slot).toMatch(
      /<input[^>]*aria-labelledby="ssr-security-label"[^>]*data-slot="otp-field-input"/,
    );
  });

  test("exports namespace and compatibility aliases", () => {
    expect(OTPField.OTPField).toBe(OTPField.Root);
    expect(OTPField.OTPFieldInput).toBe(OTPField.Input);
    expect(OTPField.OTPFieldSeparator).toBe(OTPField.Separator);
  });
});
