import { render } from "svelte/server";
import { describe, expect, test } from "vitest";
import * as InputGroup from "./index.js";
import InputGroupSsrFixture from "./input-group.ssr-fixture.svelte";

describe("Input Group SSR contract", () => {
  test("renders inputs, textareas, addons, and alignment variants", () => {
    const { body } = render(InputGroupSsrFixture);

    expect(body).toContain('data-slot="input-group"');
    expect(body).toContain('role="group"');
    expect(body).toContain('data-align="inline-start"');
    expect(body).toContain('data-align="block-end"');
    expect(body).toContain('data-slot="input"');
    expect(body).toContain('data-slot="textarea"');
    expect(body).toContain("contents");
  });

  test("exports the compound namespace and compatibility aliases", () => {
    expect(InputGroup.Root).toBe(InputGroup.InputGroup);
    expect(InputGroup.Addon).toBe(InputGroup.InputGroupAddon);
    expect(InputGroup.Text).toBe(InputGroup.InputGroupText);
    expect(InputGroup.Input).toBe(InputGroup.InputGroupInput);
    expect(InputGroup.Textarea).toBe(InputGroup.InputGroupTextarea);
  });
});
