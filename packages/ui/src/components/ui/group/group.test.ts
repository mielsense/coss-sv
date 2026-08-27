import { render } from "svelte/server";
import { describe, expect, test } from "vitest";
import GroupSsrFixture from "./group.ssr-fixture.svelte";
import * as Group from "./index.js";

describe("Group SSR contract", () => {
  test("renders horizontal and vertical variants with exact slots", () => {
    const { body } = render(GroupSsrFixture);

    expect(body).toContain('role="group"');
    expect(body).toContain('data-slot="group"');
    expect(body).toContain('data-orientation="vertical"');
    expect(body).toContain("flex-col");
    expect(body).toContain('data-slot="group-text"');
    expect(body).toContain('data-slot="separator"');
    expect(body.match(/<label/g)).toHaveLength(1);
    expect(body).toContain('for="domain"');
    expect(body).toContain('aria-label="Domain"');
    expect(body).toContain('data-slot="group-text" class="font-medium relative inline-flex');
    expect(body).toContain("text-base text-muted-foreground");
    expect(body).toContain("sm:text-sm");
    expect(body).toContain("relative inline-flex items-center gap-2 whitespace-nowrap");
  });

  test("exports COSS aliases", () => {
    expect(Group.ButtonGroup).toBe(Group.Root);
    expect(Group.ButtonGroupText).toBe(Group.Text);
    expect(Group.ButtonGroupSeparator).toBe(Group.Separator);
  });
});
