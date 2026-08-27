import { expect, expectTypeOf, test } from "vitest";
import { createHandle } from "./index.js";
import type {
  DrawerPopupProps,
  DrawerRootProps,
  DrawerSnapPoint,
  DrawerSwipeDirection,
  DrawerTriggerProps,
} from "./index.js";
test("types Drawer position, snapping, callbacks, and variants", () => {
  const points: DrawerSnapPoint[] = [0.25, "320px", 1];
  const root = {
    onOpenChange: (_open: boolean) => undefined,
    onSnapPointChange: (_point) => undefined,
    position: "top",
    snapPoint: points[0] ?? null,
    snapPoints: points,
    swipeDirection: "up",
  } satisfies DrawerRootProps;
  const popup = {
    position: "right",
    showBar: true,
    showCloseButton: true,
    variant: "straight",
  } satisfies DrawerPopupProps;
  expectTypeOf(root.swipeDirection).toEqualTypeOf<"up">();
  expectTypeOf<DrawerSwipeDirection>().toEqualTypeOf<"up" | "down" | "left" | "right">();
  expect(popup.variant).toBe("straight");
});
test("preserves the Drawer payload type through its root, handle, and trigger", () => {
  const handle = createHandle<{ id: number }>();
  const validRoot = { handle } satisfies DrawerRootProps<{ id: number }>;
  const validTrigger = { handle, payload: { id: 1 } } satisfies DrawerTriggerProps<{ id: number }>;
  const invalid = {
    handle,
    // @ts-expect-error Drawer payload must match its parameterized handle.
    payload: { id: "wrong" },
  } satisfies DrawerTriggerProps<{ id: number }>;
  expect(validRoot.handle).toBe(handle);
  expect(validTrigger.payload.id).toBe(1);
  expect(invalid.payload.id).toBe("wrong");
});
