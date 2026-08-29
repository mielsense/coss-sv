import { render } from "svelte/server";
import { describe, expect, test } from "vitest";
import Fixture from "./combobox.ssr-fixture.svelte";
import * as Combobox from "./index.js";

describe("Combobox SSR and export contract", () => {
  test("renders the COSS input composition and slots", () => {
    const { body } = render(Fixture);
    expect(body).toContain('role="combobox"');
    expect(body).toContain('data-slot="combobox-input"');
    expect(body).toContain('data-slot="combobox-trigger"');
    expect(body).toContain('data-slot="combobox-clear"');
    expect(body).toContain('aria-label="Clear fruit"');
    expect(body).toContain('data-testid="composed-clear"');
    const composedClear = body.match(
      /<button[^>]*data-testid="composed-clear"[^>]*>(.*?)<\/button>/s,
    );
    expect(composedClear?.[1]).toContain("<svg");
    expect(composedClear?.[1]).toContain('stroke-width="2"');
    const bareClear = body.match(/<button[^>]*data-testid="bare-clear"[^>]*>(.*?)<\/button>/s);
    expect(bareClear).not.toBeNull();
    expect(bareClear?.[0]).not.toContain("aria-label");
    expect(bareClear?.[1]?.replace(/<!--.*?-->/gs, "")).toBe("");
  });
  test("keeps addon and end-adornment selectors on the input control", () => {
    const { body } = render(Fixture);
    const control = body.match(/<span[^>]*data-slot="input-control"[^>]*>/)?.[0] ?? "";
    const input = body.match(/<input[^>]*data-slot="combobox-input"[^>]*>/)?.[0] ?? "";

    expect(control).toContain('data-size="sm"');
    expect(control).toContain(
      "data-[size=sm]:*:data-[slot=combobox-input]:ps-[calc(--spacing(7.5)-1px)]",
    );
    expect(control).toContain(
      "has-[+[data-slot=combobox-trigger],+[data-slot=combobox-clear]]:*:data-[slot=combobox-input]:pe-6.5",
    );
    expect(input).not.toContain("data-size=");
    expect(input).not.toContain("*:data-[slot=combobox-input]");
  });
  test("does not invent content for a bare public trigger", () => {
    const { body } = render(Fixture);
    const trigger = body.match(
      /<button[^>]*data-testid="bare-combobox-trigger"[^>]*>(.*?)<\/button>/s,
    );
    expect(trigger).not.toBeNull();
    expect(trigger?.[1]?.replace(/<!--.*?-->/gs, "")).toBe("");
  });
  test("renders a typed custom object value snippet without recursion", () => {
    const { body } = render(Fixture);
    expect(body).toContain('data-testid="combobox-object-value">Grace Hopper</span>');
  });
  test("exports the compound and long-form API", () => {
    expect(Combobox.Combobox).toBe(Combobox.Root);
    expect(Combobox.ComboboxInput).toBe(Combobox.Input);
    expect(Combobox.ComboboxPrimitive).toBeTypeOf("object");
    expect(Combobox.useComboboxFilter).toBe(Combobox.createFilter);
  });
});
