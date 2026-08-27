import { render } from "svelte/server";
import { describe, expect, test } from "vitest";
import FormSsrFixture from "./form.ssr-fixture.svelte";
import { Form, FormPrimitive } from "./index.js";

describe("Form SSR contract", () => {
  test("renders a native form and preserves native action attributes", () => {
    const { body } = render(FormSsrFixture);

    expect(body).toContain("<form");
    expect(body).toContain('data-slot="form"');
    expect(body).toContain('action="?/save"');
    expect(body).toContain('method="POST"');
    expect(body).toContain("novalidate");
    expect(body).toContain('class="contents"');
  });

  test("exports the Shards primitive", () => {
    expect(Form).toBeTypeOf("function");
    expect(FormPrimitive).toBeTypeOf("function");
  });
});
