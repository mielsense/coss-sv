import { createRawSnippet } from "svelte";
import { expect, expectTypeOf, test } from "vitest";
import type Form from "./form.svelte";
import type { FormProps } from "./index.js";

test("types native form actions, server errors, and value callbacks", () => {
  const children = createRawSnippet(() => ({ render: () => "content" }));
  const props = {
    action: "?/save",
    children,
    errors: { email: ["Required", "Invalid"] },
    method: "POST",
    onFormSubmit: (values: Record<string, unknown>) => values.email,
    onsubmit: (event: SubmitEvent) => event.preventDefault(),
    ref: null,
    validationMode: "onChange",
  } satisfies FormProps;

  expect(props.action).toBe("?/save");
  expect(props.validationMode).toBe("onChange");
  expectTypeOf(props.errors.email).toEqualTypeOf<string[]>();
  expectTypeOf<ReturnType<typeof Form>["validate"]>().toEqualTypeOf<(fieldName?: string) => void>();
});
