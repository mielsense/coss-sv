import { render } from "svelte/server";
import { describe, expect, test } from "vitest";
import * as PreviewCard from "./index.js";
import PreviewCardSsrFixture from "./preview-card.ssr-fixture.svelte";

describe("PreviewCard SSR contract", () => {
  test("exports the compound and hover-card surfaces", () => {
    expect(PreviewCard.Root).toBeDefined();
    expect(PreviewCard.Trigger).toBeDefined();
    expect(PreviewCard.Popup).toBeDefined();
    expect(PreviewCard.HoverCard).toBe(PreviewCard.Root);
    expect(PreviewCard.HoverCardTrigger).toBe(PreviewCard.Trigger);
    expect(PreviewCard.HoverCardContent).toBe(PreviewCard.Popup);

    const { body } = render(PreviewCardSsrFixture);
    expect(body).toContain('data-slot="preview-card-trigger"');
    expect(body).toContain("coss.com/ui");
  });

  test("creates a detached handle", () => {
    expect(PreviewCard.PreviewCardCreateHandle()).toBeInstanceOf(PreviewCard.Handle);
  });
});
