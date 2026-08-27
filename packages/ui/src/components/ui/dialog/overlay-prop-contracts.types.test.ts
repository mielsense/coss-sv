import type { AlertDialog, Dialog, Drawer } from "@shardsui/svelte";
import type { ComponentProps } from "svelte";
import { expect, expectTypeOf, test } from "vitest";
import type { AlertDialogBackdropProps } from "../alert-dialog/alert-dialog-backdrop.svelte";
import type { AlertDialogCloseProps } from "../alert-dialog/alert-dialog-close.svelte";
import type { AlertDialogViewportProps } from "../alert-dialog/alert-dialog-viewport.svelte";
import type { DrawerBackdropProps } from "../drawer/drawer-backdrop.svelte";
import type { DrawerCloseProps } from "../drawer/drawer-close.svelte";
import type { SheetBackdropProps } from "../sheet/sheet-backdrop.svelte";
import type { SheetCloseProps } from "../sheet/sheet-close.svelte";
import type { DialogBackdropProps } from "./dialog-backdrop.svelte";
import type { DialogCloseProps } from "./dialog-close.svelte";
import type { DialogViewportProps } from "./dialog-viewport.svelte";

test("keeps the emitted overlay prop contracts identical to their Shards primitives", () => {
  expectTypeOf<DialogBackdropProps>().toEqualTypeOf<ComponentProps<typeof Dialog.Backdrop>>();
  expectTypeOf<DialogCloseProps>().toMatchTypeOf<ComponentProps<typeof Dialog.Close>>();
  expectTypeOf<ComponentProps<typeof Dialog.Close>>().toMatchTypeOf<DialogCloseProps>();
  expectTypeOf<DialogViewportProps>().toEqualTypeOf<ComponentProps<typeof Dialog.Viewport>>();
  expectTypeOf<AlertDialogBackdropProps>().toEqualTypeOf<
    ComponentProps<typeof AlertDialog.Backdrop>
  >();
  expectTypeOf<AlertDialogCloseProps>().toMatchTypeOf<ComponentProps<typeof AlertDialog.Close>>();
  expectTypeOf<ComponentProps<typeof AlertDialog.Close>>().toMatchTypeOf<AlertDialogCloseProps>();
  expectTypeOf<AlertDialogViewportProps>().toEqualTypeOf<
    ComponentProps<typeof AlertDialog.Viewport>
  >();
  expectTypeOf<SheetBackdropProps>().toEqualTypeOf<ComponentProps<typeof Dialog.Backdrop>>();
  expectTypeOf<SheetCloseProps>().toMatchTypeOf<ComponentProps<typeof Dialog.Close>>();
  expectTypeOf<ComponentProps<typeof Dialog.Close>>().toMatchTypeOf<SheetCloseProps>();
  expectTypeOf<DrawerBackdropProps>().toEqualTypeOf<ComponentProps<typeof Drawer.Backdrop>>();
  expectTypeOf<DrawerCloseProps>().toMatchTypeOf<ComponentProps<typeof Dialog.Close>>();
  expectTypeOf<ComponentProps<typeof Dialog.Close>>().toMatchTypeOf<DrawerCloseProps>();
  expect(true).toBe(true);
});
