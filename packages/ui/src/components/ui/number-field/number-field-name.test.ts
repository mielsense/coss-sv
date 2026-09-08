import { render } from "svelte/server";
import { expect, test } from "vitest";
import Fixture from "./number-field-name.browser-fixture.svelte";
import { numberFieldNameHtml } from "./number-field-name.hydration-fixture.js";

test("SSR submits the inherited name only on the canonical input", () => {
  const html = render(Fixture).body;
  expect(numberFieldNameHtml).toBe(html);
  expect(html).toContain('data-slot="number-field-native-input"');
  const display = html.match(/<input[^>]*data-slot="number-field-input"[^>]*>/)?.[0];
  expect(display).toContain('form=""');
});
