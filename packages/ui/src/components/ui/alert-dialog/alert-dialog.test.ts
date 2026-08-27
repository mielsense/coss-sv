import { render } from "svelte/server";
import { describe, expect, test } from "vitest";
import * as AlertDialog from "./index.js";
import AlertDialogFixture from "./alert-dialog.ssr-fixture.svelte";

describe("Alert Dialog SSR contract", () => {
  test("exports styled namespace aliases", () => {
    expect(AlertDialog.Root).toBe(AlertDialog.AlertDialog);
    expect(AlertDialog.Content).toBe(AlertDialog.Popup);
    expect(AlertDialog.Overlay).toBe(AlertDialog.Backdrop);
    expect(AlertDialog.AlertDialogPortal).toBe(AlertDialog.Portal);
    expect(AlertDialog.AlertDialogHandle).toBe(AlertDialog.Handle);
    expect(AlertDialog.AlertDialogCreateHandle()).toBeInstanceOf(AlertDialog.Handle);
  });

  test("renders COSS alertdialog parts when open", () => {
    const body = render(AlertDialogFixture).body;
    expect(body).toContain('role="alertdialog"');
    expect(body).toContain('data-slot="alert-dialog-popup"');
    expect(body).toContain('data-slot="alert-dialog-header"');
    expect(body).toContain('data-slot="alert-dialog-footer"');
  });
});
