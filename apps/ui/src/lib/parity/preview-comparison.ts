import AxeBuilder from "@axe-core/playwright";
import type { Locator, Page } from "playwright";

export type Geometry = { height: number; width: number; x: number; y: number };
export type FocusTarget = {
  ariaLabel: string | null;
  dataSlot: string | null;
  id: string;
  role: string | null;
  tagName: string;
  text: string;
};

export function normalizeGeometry(geometry: Geometry): Geometry {
  return Object.fromEntries(
    Object.entries(geometry).map(([key, value]) => [key, Math.round(value * 100) / 100]),
  ) as Geometry;
}

export function normalizeComputedStyle(
  style: Readonly<Record<string, string>>,
  properties: readonly string[],
): Record<string, string> {
  return Object.fromEntries(
    [...properties].sort().map((property) => [property, style[property] ?? ""]),
  );
}

export async function captureGeometry(locator: Locator): Promise<Geometry | null> {
  const box = await locator.boundingBox();
  return box ? normalizeGeometry(box) : null;
}

export async function captureComputedStyles(
  locator: Locator,
  properties: readonly string[],
): Promise<Record<string, string>> {
  return locator.evaluate((element, names) => {
    const computed = getComputedStyle(element);
    return Object.fromEntries(names.map((name) => [name, computed.getPropertyValue(name)]));
  }, [...properties].sort());
}

export async function captureAccessibility(page: Page, root = "body") {
  const locator = page.locator(root);
  return {
    ariaSnapshot: await locator.ariaSnapshot(),
    violations: (await new AxeBuilder({ page }).include(root).analyze()).violations,
  };
}

export async function captureFocusOrder(page: Page, presses: number): Promise<FocusTarget[]> {
  await page.locator("body").focus();
  const targets: FocusTarget[] = [];
  for (let index = 0; index < presses; index += 1) {
    await page.keyboard.press("Tab");
    targets.push(
      await page.evaluate(() => {
        const active = document.activeElement;
        if (!(active instanceof HTMLElement)) {
          return { ariaLabel: null, dataSlot: null, id: "", role: null, tagName: "", text: "" };
        }
        return {
          ariaLabel: active.getAttribute("aria-label"),
          dataSlot: active.dataset.slot ?? null,
          id: active.id,
          role: active.getAttribute("role"),
          tagName: active.tagName.toLowerCase(),
          text: (active.textContent ?? "").trim().replace(/\s+/g, " "),
        };
      }),
    );
  }
  return targets;
}

export async function captureConsole<T>(
  page: Page,
  operation: () => Promise<T>,
): Promise<{ errors: string[]; result: T; warnings: string[] }> {
  const errors: string[] = [];
  const warnings: string[] = [];
  const onConsole = (message: { text(): string; type(): string }) => {
    if (message.type() === "error") errors.push(message.text());
    if (message.type() === "warning") warnings.push(message.text());
  };
  const onPageError = (cause: Error) => errors.push(cause.message);
  page.on("console", onConsole);
  page.on("pageerror", onPageError);
  try {
    return { errors, result: await operation(), warnings };
  } finally {
    page.off("console", onConsole);
    page.off("pageerror", onPageError);
  }
}

export async function captureScreenshot(
  page: Page,
  path: string,
  maskSelectors: readonly string[] = [],
): Promise<void> {
  await page.screenshot({
    animations: "disabled",
    fullPage: true,
    mask: maskSelectors.map((selector) => page.locator(selector)),
    path,
  });
}
