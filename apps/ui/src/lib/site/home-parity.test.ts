import { render } from "svelte/server";
import { expect, test } from "vitest";
import Home from "../../routes/(site)/+page.svelte";

test("category links retain headings inside canonical inset Card frames", () => {
  const { body } = render(Home);
  expect(body.match(/data-slot="card-frame"/g)).toHaveLength(55);
  expect(body.match(/data-slot="card-frame-header"/g)).toHaveLength(55);
  expect(body.match(/data-slot="card-panel"/g)).toHaveLength(55);
  expect(body).toContain('href="/docs/components/autocomplete"');
  expect(body).toContain("Get started");
});
