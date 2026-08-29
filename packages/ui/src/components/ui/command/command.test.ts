import { render } from "svelte/server";
import { describe, expect, test } from "vitest";
import Fixture from "./command.ssr-fixture.svelte";
import * as Command from "./index.js";

describe("Command SSR and export contract", () => {
  test("renders the exact COSS standalone command slots", () => {
    const { body } = render(Fixture);
    expect(body).toContain('data-slot="autocomplete-input"');
    expect(body).not.toContain('data-slot="command-panel"');
    expect(body).toContain('data-slot="command-list"');
    expect(body).toContain('data-slot="command-footer"');
    expect(body).toContain('data-slot="command-shortcut"');
    expect(body).toContain("<svg");
    expect(body).toContain('stroke-width="2"');
  });
  test("merges consumer classes without replacing command group and label styling", () => {
    const { body } = render(Fixture);
    const group = body.match(/<div[^>]*data-testid="command-group"[^>]*>/)?.[0] ?? "";
    const label = body.match(/<div[^>]*data-testid="command-group-label"[^>]*>/)?.[0] ?? "";

    expect(group).toContain("[[role=group]+&amp;]:mt-1.5");
    expect(group).toContain("consumer-group");
    expect(label).toContain("px-2 py-1.5 font-medium text-muted-foreground text-xs");
    expect(label).toContain("consumer-label");
  });
  test("exports dialog composition, detached handle, and long aliases", () => {
    expect(Command.Command).toBe(Command.Root);
    expect(Command.CommandDialog).toBe(Command.DialogRoot);
    expect(Command.CommandDialogBackdrop).toBe(Command.DialogBackdrop);
    expect(Command.CommandDialogViewport).toBe(Command.DialogViewport);
    expect(Command.CommandDialogPrimitive).toBeTypeOf("object");
    expect(Command.createHandle()).toBeInstanceOf(Command.Handle);
  });
});
