import { render } from "svelte/server";
import { describe, expect, test } from "vitest";
import { Switch, SwitchPrimitive } from "./index.js";

describe("Switch SSR contract", () => {
  test("renders the exact COSS root and built-in thumb contract", () => {
    const { body } = render(Switch, {
      props: {
        checked: true,
        class: "custom-switch",
        name: "marketing",
      },
    });

    expect(body).toContain('data-slot="switch"');
    expect(body).toContain("h-[calc(var(--thumb-size)+2px)]");
    expect(body).toContain("[--thumb-size:--spacing(5)]");
    expect(body).toContain("custom-switch");
    expect(body).toContain('data-slot="switch-thumb"');
    expect(body).toContain("data-checked:translate-x-[calc(var(--thumb-size)-4px)]");
    expect(body).toContain('aria-checked="true"');
    expect(body).toContain('name="marketing"');
  });

  test("exports the styled wrapper and Shards primitive namespace", () => {
    expect(Switch).toBeTypeOf("function");
    expect(SwitchPrimitive.Root).toBeTypeOf("function");
    expect(SwitchPrimitive.Thumb).toBeTypeOf("function");
  });
});
