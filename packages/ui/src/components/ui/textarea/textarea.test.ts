import { render } from "svelte/server";
import { describe, expect, test } from "vitest";
import { FieldPrimitive, Textarea } from "./index.js";

describe("Textarea SSR contract", () => {
  test("renders the COSS wrapper and native textarea contract", () => {
    const { body } = render(Textarea, {
      props: {
        "aria-invalid": "true",
        class: "w-80",
        name: "message",
        placeholder: "Message",
        size: "sm",
      },
    });

    expect(body).toContain('data-slot="textarea-control"');
    expect(body).toContain('data-size="sm"');
    expect(body).toContain("w-80");
    expect(body).toContain("<textarea");
    expect(body).toContain('data-slot="textarea"');
    expect(body).toContain('aria-invalid="true"');
    expect(body).toContain('name="message"');
    expect(body).toContain("field-sizing-content");
    expect(body).toContain("min-h-16.5");
  });

  test("keeps rows as a native attribute and numeric size off the textarea", () => {
    const { body } = render(Textarea, { props: { rows: 8, size: 12, unstyled: true } });
    expect(body).toContain('data-size="12"');
    expect(body).toContain('rows="8"');
    expect(body).not.toMatch(/<textarea[^>]*\ssize="12"/);
    expect(body).not.toContain("relative inline-flex");
  });

  test("exports the wrapped component and Shards field primitive", () => {
    expect(Textarea).toBeTypeOf("function");
    expect(FieldPrimitive).toBeTypeOf("object");
  });
});
