import { describe, expect, test } from "vitest";
import {
  type SegmentedControlItemVariantOptions,
  type SegmentedControlSize,
  type SegmentedControlState,
  segmentedControlItemLayoutClassName,
  segmentedControlItemSizeClassNames,
  segmentedControlItemVariants,
  segmentedControlRootClassName,
} from "./segmented-control.js";

describe("segmented control styling", () => {
  test("exports the exact COSS root, layout, and size classes", () => {
    expect(segmentedControlRootClassName).toBe(
      "relative z-0 flex w-fit items-center justify-center gap-0.5 rounded-lg bg-muted p-0.5",
    );
    expect(segmentedControlItemLayoutClassName).toBe(
      "gap-1.5 [&_svg:not([class*='opacity-'])]:opacity-80 [&_svg:not([class*='size-'])]:size-4.5 sm:[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:-mx-0.5 [&_svg]:shrink-0",
    );
    expect(segmentedControlItemSizeClassNames).toEqual({
      default: "h-8.5 px-[calc(--spacing(2.5)-1px)] sm:h-7.5",
      lg: "h-9.5 px-[calc(--spacing(3)-1px)] sm:h-8.5",
      sm: "h-7.5 px-[calc(--spacing(2)-1px)] sm:h-6.5",
    });
  });

  test.each([
    ["checked", "data-checked:bg-background"],
    ["current", "aria-[current=page]:bg-background"],
    ["pressed", "data-pressed:bg-background"],
  ] as const)("selects the %s state recipe", (state, stateClassName) => {
    const className = segmentedControlItemVariants({ state });

    expect(className).toContain(segmentedControlItemLayoutClassName);
    expect(className).toContain(segmentedControlItemSizeClassNames.default);
    expect(className).toContain(stateClassName);
  });

  test("selects each size and omits state classes when no state is requested", () => {
    for (const size of ["sm", "default", "lg"] satisfies SegmentedControlSize[]) {
      const className = segmentedControlItemVariants({ size });
      expect(className).toContain(segmentedControlItemSizeClassNames[size]);
      expect(className).not.toContain("data-checked:bg-background");
      expect(className).not.toContain("aria-[current=page]:bg-background");
      expect(className).not.toContain("data-pressed:bg-background");
    }
  });

  test("keeps its public option and state types narrow", () => {
    const state: SegmentedControlState = "checked";
    const options = { size: "sm", state } satisfies SegmentedControlItemVariantOptions;
    expect(segmentedControlItemVariants(options)).toContain(segmentedControlItemSizeClassNames.sm);
  });

  test("accepts the exact cva-compatible className option contract", () => {
    const className = segmentedControlItemVariants({
      className: ["grow", { "justify-between": true }],
      size: "lg",
      state: "checked",
    });

    expect(className).toContain("grow");
    expect(className).toContain("justify-between");
    expect(className).toContain(segmentedControlItemSizeClassNames.lg);
    expect(className).toContain("data-checked:bg-background");
  });
});
