import { expect, expectTypeOf, test } from "vitest";
import type {
  DrawerPopupProps,
  DrawerRootProps,
  DrawerSnapPoint,
  DrawerSwipeDirection,
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
