import { expect, test } from "@playwright/test";
import { assertNoAxeViolations, monitorConsole, openReadyPreview } from "./helpers/preview.js";

test("renders the exact Skeleton particle and motion contract", async ({ page }, testInfo) => {
  const guard = monitorConsole(page);
  const theme = testInfo.project.name === "dark" ? "dark" : "light";

  for (const width of ["desktop", "mobile"] as const) {
    const { ready } = await openReadyPreview(page, "skeleton", theme, width);
    const skeletons = ready.locator('[data-slot="skeleton"]');
    await expect(skeletons).toHaveCount(5);

    const metrics = await skeletons.evaluateAll((elements) =>
      elements.map((element) => {
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        const normalizeColor = (color: string) => {
          const canvas = document.createElement("canvas");
          canvas.width = 1;
          canvas.height = 1;
          const context = canvas.getContext("2d", { willReadFrequently: true });
          if (!context) throw new Error("Unable to create a color-normalization context.");
          context.clearRect(0, 0, 1, 1);
          context.fillStyle = color;
          context.fillRect(0, 0, 1, 1);
          return Array.from(context.getImageData(0, 0, 1, 1).data);
        };
        const highlight = style.getPropertyValue("--skeleton-highlight").trim();
        const animation = element.getAnimations()[0];
        const keyframes =
          animation?.effect instanceof KeyframeEffect
            ? animation.effect.getKeyframes().map((keyframe) => ({
                backgroundPositionX: String(keyframe.backgroundPositionX),
                backgroundPositionY: String(keyframe.backgroundPositionY),
                offset: keyframe.computedOffset,
              }))
            : [];
        return {
          animationDelay: style.animationDelay,
          animationDuration: style.animationDuration,
          animationIterationCount: style.animationIterationCount,
          animationKeyframes: keyframes,
          animationName: style.animationName,
          animationTimingFunction: style.animationTimingFunction,
          backgroundAttachment: style.backgroundAttachment,
          backgroundClip: style.backgroundClip,
          backgroundColorRgba: normalizeColor(style.backgroundColor),
          backgroundImage: style.backgroundImage,
          backgroundOrigin: style.backgroundOrigin,
          backgroundPosition: style.backgroundPosition,
          backgroundRepeat: style.backgroundRepeat,
          backgroundSize: style.backgroundSize,
          height: rect.height,
          highlightRgba: normalizeColor(highlight),
          radius: style.borderRadius,
          width: rect.width,
        };
      }),
    );
    const particle = await skeletons.first().evaluate((element) => {
      const root = element.parentElement;
      if (!root) throw new Error("Skeleton is missing its particle root.");
      const rect = root.getBoundingClientRect();
      return { className: root.className, height: rect.height, width: rect.width };
    });
    expect(particle).toEqual({
      className: "flex w-full max-w-92 items-center gap-4",
      height: 40,
      width: width === "desktop" ? 368 : 308,
    });
    expect(metrics[0]).toMatchObject({
      animationDelay: "-1s",
      animationDuration: "2s",
      animationIterationCount: "infinite",
      animationName: "skeleton",
      animationTimingFunction: "linear",
      backgroundAttachment: "fixed",
      backgroundClip: "border-box",
      backgroundColorRgba: theme === "dark" ? [255, 255, 255, 10] : [0, 0, 0, 10],
      backgroundOrigin: "padding-box",
      backgroundRepeat: "repeat",
      backgroundSize: "200% 100%",
      height: 40,
      highlightRgba: theme === "dark" ? [255, 255, 255, 10] : [255, 255, 255, 163],
      width: 40,
    });
    expect(metrics[0]?.radius).not.toBe("2px");
    expect(metrics.slice(1).map(({ height }) => height)).toEqual([16, 16, 16, 24]);
    expect(metrics.slice(1).map(({ width: skeletonWidth }) => skeletonWidth)).toEqual([
      ...(width === "desktop" ? [216, 106, 106] : [168, 82, 82]),
      68,
    ]);
    for (const metric of metrics) {
      expect(metric.animationDelay).toBe("-1s");
      expect(metric.animationDuration).toBe("2s");
      expect(metric.animationIterationCount).toBe("infinite");
      expect(metric.animationKeyframes).toEqual([
        { backgroundPositionX: "0px", backgroundPositionY: "0px", offset: 0 },
        { backgroundPositionX: "-200%", backgroundPositionY: "0px", offset: 1 },
      ]);
      expect(metric.animationName).toBe("skeleton");
      expect(metric.animationTimingFunction).toBe("linear");
      expect(metric.backgroundAttachment).toBe("fixed");
      expect(metric.backgroundClip).toBe("border-box");
      expect(metric.backgroundColorRgba).toEqual(
        theme === "dark" ? [255, 255, 255, 10] : [0, 0, 0, 10],
      );
      expect(metric.backgroundImage).toMatch(
        /^linear-gradient\(120deg, rgba\(0, 0, 0, 0\) 40%, .+, rgba\(0, 0, 0, 0\) 60%\)$/,
      );
      expect(metric.backgroundOrigin).toBe("padding-box");
      const [animatedX, animatedY] = metric.backgroundPosition.split(" ");
      expect(Number.parseFloat(animatedX ?? "")).toBeGreaterThanOrEqual(-200);
      expect(Number.parseFloat(animatedX ?? "")).toBeLessThanOrEqual(0);
      expect(animatedY).toBe("0px");
      expect(metric.backgroundRepeat).toBe("repeat");
      expect(metric.backgroundSize).toBe("200% 100%");
      expect(metric.highlightRgba).toEqual(
        theme === "dark" ? [255, 255, 255, 10] : [255, 255, 255, 163],
      );
    }
    await assertNoAxeViolations(page, '[data-preview-ready="true"]');
    guard.assertNoErrors();
  }
});
