import { render } from "svelte/server";
import { expect, test } from "vitest";
import NativeWrapperSsr from "./fixtures/native-wrapper-ssr.svelte";
import ShardsButtonCompat from "./fixtures/shards-button-compat.svelte";

test("renders typed native attributes and snippet content during SSR", () => {
  const { body } = render(NativeWrapperSsr);

  expect(body).toContain("Save changes");
  expect(body).toContain('class="fixture"');
  expect(body).toContain('data-forwarded="yes"');
  expect(body).toContain("disabled");
});

test("renders the published Shards UI beta package during SSR", () => {
  const { body } = render(ShardsButtonCompat);

  expect(body).toContain("Shards button");
  expect(body).toContain('data-shards-compat="0.1.0-beta.0"');
});
