import { render } from "svelte/server";
import { describe, expect, test } from "vitest";
import PopoverSsrFixture from "./popover.ssr-fixture.svelte";
import * as Popover from "./index.js";

describe("Popover SSR contract", () => {
  test("exports the compound surface and renders a stable trigger", () => {
    expect(Popover.Root).toBeDefined();
    expect(Popover.Trigger).toBeDefined();
    expect(Popover.Popup).toBeDefined();
    expect(Popover.Close).toBeDefined();
    expect(Popover.Title).toBeDefined();
    expect(Popover.Description).toBeDefined();
    expect(Popover.Handle).toBeDefined();

    const { body } = render(PopoverSsrFixture);
    expect(body).toContain('data-slot="popover-trigger"');
    expect(body).toContain("Open Popover");
  });

  test("creates detached handles through both APIs", () => {
    expect(new Popover.Handle()).toBeInstanceOf(Popover.Handle);
    expect(Popover.PopoverCreateHandle()).toBeInstanceOf(Popover.Handle);
  });
});
