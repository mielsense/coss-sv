import { render } from "svelte/server";
import { describe, expect, test } from "vitest";
import * as Meter from "./index.js";

describe("Meter SSR contract", () => {
  test("renders the exact default track and indicator", () => {
    const { body } = render(Meter.Root, { props: { "aria-label": "Usage", value: 75 } });

    expect(body).toContain('role="meter"');
    expect(body).toContain('aria-valuenow="75"');
    expect(body).toContain('aria-valuetext="75%"');
    expect(body).toContain('data-slot="meter-track"');
    expect(body).toContain('data-slot="meter-indicator"');
    expect(body).toContain("width:75%");
    expect(body).not.toContain('data-slot="meter"');
  });

  test("exports the wrapped namespace and Shards namespace", () => {
    expect(Meter.Root).toBeTypeOf("function");
    expect(Meter.Track).toBeTypeOf("function");
    expect(Meter.MeterPrimitive.Root).toBeTypeOf("function");
  });
});
