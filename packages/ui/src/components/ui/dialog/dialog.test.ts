import { createRawSnippet } from "svelte";
import { render } from "svelte/server";
import { describe, expect, test } from "vitest";
import * as Dialog from "./index.js";
import DialogFixture from "./dialog.ssr-fixture.svelte";

const children = createRawSnippet(() => ({ render: () => "Dialog body" }));

describe("Dialog SSR contract", () => {
  test("exports the styled namespace and named aliases", () => {
    expect(Dialog.Root).toBe(Dialog.Dialog);
    expect(Dialog.Content).toBe(Dialog.Popup);
    expect(Dialog.Overlay).toBe(Dialog.Backdrop);
    expect(Dialog.DialogPortal).toBe(Dialog.Portal);
    expect(Dialog.DialogHandle).toBe(Dialog.Handle);
    expect(Dialog.DialogCreateHandle()).toBeInstanceOf(Dialog.Handle);
    expect(Dialog.DialogPrimitive.Root).toBeTypeOf("function");
  });

  test("renders COSS parts and classes when open", () => {
    const { body } = render(DialogFixture, { props: { children } });
    expect(body).toContain('data-slot="dialog-popup"');
    expect(body).toContain("max-w-lg origin-center");
    expect(body).toContain('aria-label="Close"');
    expect(body).toContain('data-slot="dialog-title"');
    expect(body).toContain('data-slot="dialog-panel"');
    expect(body).toContain('data-slot="dialog-footer"');
  });
});
