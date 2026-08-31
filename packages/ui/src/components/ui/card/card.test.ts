import { createRawSnippet, type Component } from "svelte";
import { render } from "svelte/server";
import { describe, expect, test } from "vitest";
import * as Card from "./index.js";

const content = (value: string) =>
  createRawSnippet(() => ({ render: () => `<span>${value}</span>` }));
const eraseProps = (component: unknown) => component as Component<Record<string, unknown>>;

describe("Card SSR contract", () => {
  test("exports every COSS card and frame part", () => {
    const parts = [
      [eraseProps(Card.Root), "card", "rounded-2xl"],
      [eraseProps(Card.Frame), "card-frame", "[--clip-bottom:-1rem]"],
      [eraseProps(Card.FrameHeader), "card-frame-header", "has-data-[slot=card-frame-action]"],
      [eraseProps(Card.FrameTitle), "card-frame-title", "font-semibold"],
      [eraseProps(Card.FrameDescription), "card-frame-description", "text-muted-foreground"],
      [eraseProps(Card.FrameAction), "card-frame-action", "col-start-2"],
      [eraseProps(Card.FrameFooter), "card-frame-footer", "px-6"],
      [eraseProps(Card.Header), "card-header", "auto-rows-min"],
      [eraseProps(Card.Title), "card-title", "font-heading"],
      [eraseProps(Card.Description), "card-description", "text-muted-foreground"],
      [eraseProps(Card.Action), "card-action", "row-span-2"],
      [eraseProps(Card.Panel), "card-panel", "flex-1"],
      [eraseProps(Card.Footer), "card-footer", "items-center"],
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
    expect(Card.Card).toBe(Card.Root);
    expect(Card.CardHeader).toBe(Card.Header);
    expect(Card.CardTitle).toBe(Card.Title);
    expect(Card.CardDescription).toBe(Card.Description);
    expect(Card.CardAction).toBe(Card.Action);
    expect(Card.CardPanel).toBe(Card.Panel);
    expect(Card.CardContent).toBe(Card.CardPanel);
    expect(Card.Content).toBe(Card.Panel);
    expect(Card.CardFooter).toBe(Card.Footer);
    expect(Card.CardFrame).toBe(Card.Frame);
    expect(Card.CardFrameHeader).toBe(Card.FrameHeader);
  });

  test("supports explicit polymorphic elements and attributes", () => {
    const { body } = render(eraseProps(Card.Root), {
      props: { as: "article", children: content("Article card"), id: "article-card" },
    });
    expect(body).toContain("<article ");
    expect(body).toContain('id="article-card"');
    expect(body).toContain("Article card");
  });
});
