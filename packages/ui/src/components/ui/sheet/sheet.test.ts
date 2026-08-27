import { render } from "svelte/server";
import { describe, expect, test } from "vitest";
import * as Sheet from "./index.js";
import SheetFixture from "./sheet.ssr-fixture.svelte";

describe("Sheet SSR contract", () => {
  test("exports styled namespace aliases", () => {
    expect(Sheet.Root).toBe(Sheet.Sheet);
    expect(Sheet.Content).toBe(Sheet.Popup);
    expect(Sheet.Overlay).toBe(Sheet.Backdrop);
    expect(Sheet.SheetPortal).toBe(Sheet.Portal);
    expect(Sheet.SheetHandle).toBe(Sheet.Handle);
  });

  test("renders every COSS side and inset variant", () => {
    const body = render(SheetFixture).body;
    expect(body).toContain('data-side="right"');
    expect(body).toContain('data-side="left"');
    expect(body).toContain('data-side="top"');
    expect(body).toContain('data-side="bottom"');
    expect(body).toContain("sm:rounded-2xl sm:border");
  });
});
