import { createRawSnippet } from "svelte";
import { render } from "svelte/server";
import { describe, expect, test } from "vitest";
import AvatarHydrationFixture from "./avatar.hydration-fixture.svelte";
import * as Avatar from "./index.js";

describe("Avatar SSR contract", () => {
  test("renders the exact COSS root and fallback contract", () => {
    const { body } = render(Avatar.Root, {
      props: {
        class: "custom-avatar",
        children: createRawSnippet(() => ({
          render: () => '<span data-slot="avatar-fallback">LT</span>',
        })),
      },
    });

    expect(body).toContain('data-slot="avatar"');
    expect(body).toContain("inline-flex size-8");
    expect(body).toContain("rounded-full bg-background");
    expect(body).toContain("custom-avatar");
  });

  test("exports every wrapped part and the Shards namespace", () => {
    expect(Avatar.Root).toBeTypeOf("function");
    expect(Avatar.Image).toBeTypeOf("function");
    expect(Avatar.Fallback).toBeTypeOf("function");
    expect(Avatar.AvatarPrimitive.Root).toBeTypeOf("function");
  });

  test("server-renders the real image and fallback hydration fixture in its loading state", () => {
    const { body } = render(AvatarHydrationFixture);

    expect(body).toContain('data-testid="hydration-avatar"');
    expect(body).toContain('data-testid="hydration-avatar-fallback"');
    expect(body).toContain("HY");
    expect(body).not.toContain('data-testid="hydration-avatar-image"');
  });
});
