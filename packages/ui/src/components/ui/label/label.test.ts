import { createRawSnippet } from "svelte";
import { render } from "svelte/server";
import { describe, expect, test } from "vitest";
import { Label } from "./index.js";

describe("Label SSR contract", () => {
  test("renders a native label with exact COSS styling and forwarded attributes", () => {
    const children = createRawSnippet(() => ({ render: () => "Email" }));
    const { body } = render(Label, {
      props: { children, class: "text-red-500", for: "email", id: "email-label" },
    });

    expect(body).toContain("<label");
    expect(body).toContain('data-slot="label"');
    expect(body).toContain('for="email"');
    expect(body).toContain('id="email-label"');
    expect(body).toContain("inline-flex");
    expect(body).toContain("text-red-500");
    expect(body).not.toContain("text-foreground");
    expect(body).toContain("Email");
  });

  test("supports a polymorphic element without inventing field context", () => {
    const children = createRawSnippet(() => ({ render: () => "Caption" }));
    const { body } = render(Label, { props: { as: "span", children } });
    expect(body).toContain("<span");
    expect(body).toContain('data-slot="label"');
  });
});
