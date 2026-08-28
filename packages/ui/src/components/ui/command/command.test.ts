import { render } from "svelte/server";
import { describe, expect, test } from "vitest";
import * as Command from "./index.js";
import Fixture from "./command.ssr-fixture.svelte";
describe("Command SSR and export contract", () => {
  test("renders the exact COSS standalone command slots", () => {
    const { body } = render(Fixture);
    expect(body).toContain('data-slot="autocomplete-input"');
    expect(body).not.toContain('data-slot="command-panel"');
    expect(body).toContain('data-slot="command-list"');
    expect(body).toContain('data-slot="command-footer"');
    expect(body).toContain('data-slot="command-shortcut"');
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
