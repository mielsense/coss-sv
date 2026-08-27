import { render } from "svelte/server";
import { describe, expect, test } from "vitest";
import * as Tooltip from "./index.js";
import TooltipSsrFixture from "./tooltip.ssr-fixture.svelte";

describe("Tooltip SSR contract", () => {
  test("exports provider, compound parts, and detached handles", () => {
    expect(Tooltip.Provider).toBeDefined();
    expect(Tooltip.Root).toBeDefined();
    expect(Tooltip.Trigger).toBeDefined();
    expect(Tooltip.Popup).toBeDefined();
    expect(Tooltip.Handle).toBeDefined();
    expect(Tooltip.TooltipCreateHandle()).toBeInstanceOf(Tooltip.Handle);

    const { body } = render(TooltipSsrFixture);
    expect(body).toContain('data-slot="tooltip-trigger"');
    expect(body).toContain("Hover me");
  });
});
