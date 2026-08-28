import { render } from "svelte/server";
import { describe, expect, test } from "vitest";
import { Input, InputPrimitive } from "./index.js";
import InputFieldHydrationFixture from "./input-field.hydration-fixture.svelte";
import { inputFieldHydrationHtml } from "./input-field.hydration-html.js";

describe("Input SSR contract", () => {
  test("renders the COSS wrapper and inner input contract", () => {
    const { body } = render(Input, {
      props: {
        "aria-invalid": "true",
        "data-probe": "forwarded",
        class: "w-72",
        name: "email",
        placeholder: "Email",
        size: "lg",
        type: "email",
      },
    });

    expect(body).toContain('data-slot="input-control"');
    expect(body).toContain('data-size="lg"');
    expect(body).toContain("w-72");
    expect(body).toContain('data-slot="input"');
    expect(body).toContain('data-probe="forwarded"');
    expect(body).toContain('aria-invalid="true"');
    expect(body).toContain('name="email"');
    expect(body).toContain('type="email"');
    expect(body).toContain("sm:h-8.5");
  });

  test("keeps numeric size on the native control and removes wrapper styling only", () => {
    const { body } = render(Input, {
      props: { class: "probe", size: 12, unstyled: true },
    });

    expect(body).toContain('data-size="12"');
    expect(body).toContain('class="probe"');
    expect(body).toContain('size="12"');
    expect(body).toContain('data-slot="input"');
    expect(body).not.toContain("relative inline-flex");
  });

  test("exports the wrapped component and Shards primitive", () => {
    expect(Input).toBeTypeOf("function");
    expect(InputPrimitive).toBeTypeOf("function");
  });

  test("server-renders inherited Field relationships and explicit null removal", () => {
    const body = render(InputFieldHydrationFixture).body;
    const inherited = body.match(/<input[^>]*id="hydrated-field-input"[^>]*>/)?.[0];
    const removed = body.match(/<input[^>]*id="hydrated-null-input"[^>]*>/)?.[0];

    expect(inherited).toContain('aria-labelledby="hydrated-input-label"');
    expect(inherited).toContain('aria-describedby="hydrated-input-description"');
    expect(removed).not.toContain("aria-labelledby");
    expect(removed).not.toContain("aria-describedby");
    expect(inputFieldHydrationHtml).toBe(body);
  });
});
