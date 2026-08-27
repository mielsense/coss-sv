import { createRawSnippet } from "svelte";
import { render } from "svelte/server";
import { describe, expect, test } from "vitest";
import * as Card from "./index.js";

const content = (value: string) =>
  createRawSnippet(() => ({ render: () => `<span>${value}</span>` }));

describe("Card SSR contract", () => {
  test("exports every COSS card and frame part", () => {
    const parts = [
      [Card.Card, "card", "rounded-2xl"],
      [Card.CardFrame, "card-frame", "[--clip-bottom:-1rem]"],
      [Card.CardFrameHeader, "card-frame-header", "has-data-[slot=card-frame-action]"],
      [Card.CardFrameTitle, "card-frame-title", "font-semibold"],
      [Card.CardFrameDescription, "card-frame-description", "text-muted-foreground"],
      [Card.CardFrameAction, "card-frame-action", "col-start-2"],
      [Card.CardFrameFooter, "card-frame-footer", "px-6"],
      [Card.CardHeader, "card-header", "auto-rows-min"],
      [Card.CardTitle, "card-title", "font-heading"],
      [Card.CardDescription, "card-description", "text-muted-foreground"],
      [Card.CardAction, "card-action", "row-span-2"],
      [Card.CardPanel, "card-panel", "flex-1"],
      [Card.CardFooter, "card-footer", "items-center"],
    ] as const;

    for (const [Component, slot, className] of parts) {
      const { body } = render(Component, {
        props: {
          children: content(slot),
          class: "consumer-class",
          "data-forwarded": "yes",
        },
      });
      expect(body).toContain(`data-slot="${slot}"`);
      expect(body).toContain('data-forwarded="yes"');
      expect(body).toContain("consumer-class");
      expect(body).toContain(className);
      expect(body).toContain(slot);
    }
  });

  test("keeps CardContent as the CardPanel compatibility alias", () => {
    expect(Card.CardContent).toBe(Card.CardPanel);
  });

  test("supports explicit polymorphic elements and attributes", () => {
    const { body } = render(Card.Card, {
      props: { as: "article", children: content("Article card"), id: "article-card" },
    });
    expect(body).toContain("<article ");
    expect(body).toContain('id="article-card"');
    expect(body).toContain("Article card");
  });
});
