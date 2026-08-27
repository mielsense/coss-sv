import { render } from "svelte/server";
import { describe, expect, test } from "vitest";
import * as Slider from "./index.js";
import { Root, Slider as SliderAlias, SliderRoot, SliderValue, Value } from "./index.js";

describe("Slider SSR contract", () => {
  test("renders the exact scalar convenience composition", () => {
    const { body } = render(Slider.Root, {
      props: { "aria-label": "Volume", value: 25 },
    });

    expect(body).toContain('role="group"');
    expect(body).not.toContain('data-slot="slider"');
    expect(body).toContain('data-slot="slider-control"');
    expect(body).toContain('data-slot="slider-track"');
    expect(body).toContain('data-slot="slider-indicator"');
    expect(body.match(/data-slot="slider-thumb"/g)).toHaveLength(1);
    expect(body).toContain('type="range"');
    expect(body).toContain('aria-valuenow="25"');
    expect(body).toContain('data-orientation="horizontal"');
    expect(body).toContain("data-[orientation=horizontal]:w-full");
  });

  test("renders one stable indexed thumb per range value", () => {
    const { body } = render(Slider.Root, {
      props: {
        "aria-label": "Price range",
        defaultValue: [20, 50, 80] as const,
        max: 100,
        min: 0,
        name: "price",
      },
    });

    expect(body.match(/data-slot="slider-thumb"/g)).toHaveLength(3);
    expect(body.match(/type="range"/g)).toHaveLength(3);
    expect(body).toContain('data-index="0"');
    expect(body).toContain('data-index="1"');
    expect(body).toContain('data-index="2"');
    expect(body).toContain('aria-valuenow="20"');
    expect(body).toContain('aria-valuenow="50"');
    expect(body).toContain('aria-valuenow="80"');
    expect(body.match(/name="price"/g)).toHaveLength(3);
  });

  test("preserves vertical and disabled state on every automatic part", () => {
    const { body } = render(Slider.Root, {
      props: {
        "aria-label": "Level",
        disabled: true,
        orientation: "vertical",
        value: 40,
      },
    });

    expect(body.match(/data-orientation="vertical"/g)?.length).toBeGreaterThanOrEqual(5);
    expect(body).toContain('aria-orientation="vertical"');
    expect(body).toContain("data-[orientation=vertical]:min-h-44");
    expect(body).toContain("data-disabled:opacity-64");
    expect(body).toContain(" disabled");
  });

  test("exports every styled part, COSS aliases, and the raw Shards namespace", () => {
    expect(Slider.Root).toBeTypeOf("function");
    expect(Slider.Control).toBeTypeOf("function");
    expect(Slider.Track).toBeTypeOf("function");
    expect(Slider.Indicator).toBeTypeOf("function");
    expect(Slider.Thumb).toBeTypeOf("function");
    expect(Slider.Label).toBeTypeOf("function");
    expect(Slider.Value).toBeTypeOf("function");
    expect(Slider.Slider).toBe(Slider.Root);
    expect(Slider.SliderRoot).toBe(Slider.Root);
    expect(Slider.SliderValue).toBe(Slider.Value);
    expect(Slider.SliderPrimitive.Root).toBeTypeOf("function");
    expect(SliderAlias).toBe(Root);
    expect(SliderRoot).toBe(Root);
    expect(SliderValue).toBe(Value);
  });
});
