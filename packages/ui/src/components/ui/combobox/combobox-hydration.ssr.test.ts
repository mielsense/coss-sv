import { render } from "svelte/server";
import { expect, test } from "vitest";
import Fixture from "./combobox-hydration.browser-fixture.svelte";
import { hydrationHtml } from "./combobox-hydration.html-fixture.js";

test("uses current server markup for the hydration regression", () => {
  expect(render(Fixture).body).toBe(hydrationHtml);
});
