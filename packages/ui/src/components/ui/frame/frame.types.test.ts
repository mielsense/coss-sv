import { createRawSnippet } from "svelte";
import { expect, expectTypeOf, test } from "vitest";
import type { FrameHeaderProps, FramePanelProps, FrameProps } from "./index.js";

test("types frame snippets, native callbacks, attributes, and refs", () => {
  const children = createRawSnippet(() => ({ render: () => "content" }));
  const frame = { children, ref: null, role: "group" } satisfies FrameProps;
  const panel = { children, onclick: (_event: MouseEvent) => undefined } satisfies FramePanelProps;
  const header = { children, ref: null } satisfies FrameHeaderProps;

  expect(frame.role).toBe("group");
  expectTypeOf(panel.onclick).toBeFunction();
  expectTypeOf(header.ref).toEqualTypeOf<null>();
});
