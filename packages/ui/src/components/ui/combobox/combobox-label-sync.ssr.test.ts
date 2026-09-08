import { render } from "svelte/server";
import { expect, test } from "vitest";
import Fixture from "./combobox-label-sync.browser-fixture.svelte";

function input(html: string, label: string) {
  return html.match(new RegExp(`<input\\b[^>]*aria-label="${label}"[^>]*>`))?.[0];
}
test("server renders initial and default selected labels into native inputs", () => {
  const { body } = render(Fixture);
  expect(input(body, "Search")).toContain('value="Apple"');
  expect(input(body, "Default selection")).toContain('value="Orange"');
  expect(input(body, "Object label")).toContain('value="Object label"');
  expect(input(body, "Custom label")).toContain('value="Custom label"');
  expect(input(body, "Nested multiple search")).not.toContain('value="Nested name"');
});
test("server rendering respects independent input and default query", () => {
  expect(
    input(render(Fixture, { props: { initialInput: "controlled query" } }).body, "Search"),
  ).toContain('value="controlled query"');
  expect(
    input(render(Fixture, { props: { defaultInput: "default query" } }).body, "Search"),
  ).toContain('value="default query"');
});
