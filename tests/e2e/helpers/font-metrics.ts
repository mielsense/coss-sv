const absoluteRendererTolerance = 1;
const relativeRendererTolerance = 0.03;

export function assertFontMetricWidth(received: number | undefined, expected: number): void {
  if (received === undefined) throw new Error("Element has no measurable width.");

  // Browsers can round a box by one device-independent pixel, while CoreText
  // and FreeType produce different glyph advances for the same bundled font.
  const tolerance = absoluteRendererTolerance + expected * relativeRendererTolerance;
  const difference = Math.abs(received - expected);
  if (difference > tolerance) {
    throw new Error(
      `Expected font-derived width ${received}px to be within ${tolerance}px of ${expected}px.`,
    );
  }
}
