import { render } from "svelte/server";
import { expect, test } from "vitest";
import { highlightSource } from "../../src/lib/code/highlight.js";
import CodeSource from "../../src/lib/content/components/CodeSource.svelte";

test("manual source is initially clipped but remains server rendered", async () => {
  const source = await highlightSource("const example = 1;\n".repeat(40), "typescript");
  const { body } = render(CodeSource, { props: { source, title: "component.svelte" } });
  expect(body).toContain("data-source-collapse-panel");
  expect(body).toContain('aria-expanded="false"');
  expect(body).toContain("Expand");
  expect(body).toContain("example");
});

test("embedded preview source keeps its fixed height and has no expand controls", async () => {
  const source = await highlightSource("const example = 1;", "typescript");
  const { body } = render(CodeSource, { props: { source, embedded: true } });
  expect(body).toContain("--source-height: 450px");
  expect(body).not.toContain("data-source-collapse-panel");
  expect(body).not.toContain("Expand");
});
