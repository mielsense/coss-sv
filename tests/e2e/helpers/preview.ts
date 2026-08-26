import AxeBuilder from "@axe-core/playwright";
import type { Locator, Page, TestInfo } from "@playwright/test";

type ConsoleGuard = {
  assertNoErrors: () => void;
  clear: () => void;
  failures: string[];
};

export type ComputedStyleSnapshot = {
  boundingBox: Awaited<ReturnType<Locator["boundingBox"]>>;
  properties: Record<string, string>;
};

type ActiveElementSnapshot = {
  ariaLabel: string | null;
  role: string | null;
  tagName: string | null;
  text: string | null;
};

function activeElementSnapshot(page: Page): Promise<ActiveElementSnapshot> {
  return page.evaluate(() => {
    const active = document.activeElement;
    return {
      ariaLabel: active?.getAttribute("aria-label") ?? null,
      role: active?.getAttribute("role") ?? null,
      tagName: active?.tagName.toLowerCase() ?? null,
      text: active?.textContent?.trim() ?? null,
    };
  });
}

export function monitorConsole(page: Page): ConsoleGuard {
  const failures: string[] = [];

  page.on("console", (message) => {
    const text = message.text();
    if (message.type() === "error" || /hydration/i.test(text)) {
      const location = message.location();
      failures.push(
        `console.${message.type()}: ${text}${location.url ? ` (${location.url}:${location.lineNumber ?? 0})` : ""}`,
      );
    }
  });
  page.on("pageerror", (error) => failures.push(`pageerror: ${error.message}`));

  return {
    failures,
    assertNoErrors() {
      if (failures.length > 0) {
        throw new Error(`Preview emitted browser errors:\n${failures.join("\n")}`);
      }
    },
    clear() {
      failures.length = 0;
    },
  };
}

export async function openReadyPreview(page: Page, name: string, theme: "dark" | "light") {
  const response = await page.goto(`/preview/${encodeURIComponent(name)}?theme=${theme}`, {
    waitUntil: "networkidle",
  });
  if (!response?.ok()) {
    throw new Error(`Preview request failed with ${response?.status() ?? "no response"}.`);
  }

  const ready = page.locator('[data-preview-ready="true"]');
  await ready.waitFor({ state: "visible" });
  return { ready, serverHtml: await response.text() };
}

export async function snapshotComputedStyles(
  locator: Locator,
  properties: string[],
): Promise<ComputedStyleSnapshot> {
  const boundingBox = await locator.boundingBox();
  const values = await locator.evaluate((element, requestedProperties) => {
    const style = getComputedStyle(element);
    return Object.fromEntries(
      requestedProperties.map((property) => [property, style.getPropertyValue(property)]),
    );
  }, properties);

  return { boundingBox, properties: values };
}

export async function attachPreviewEvidence(
  locator: Locator,
  testInfo: TestInfo,
  styleProperties: string[],
) {
  const screenshot = await locator.screenshot({ animations: "disabled" });
  const dom = await locator.evaluate((element) => element.outerHTML);
  const aria = await locator.ariaSnapshot();
  const styles = await snapshotComputedStyles(locator, styleProperties);

  await testInfo.attach("preview.png", { body: screenshot, contentType: "image/png" });
  await testInfo.attach("preview.html", { body: dom, contentType: "text/html" });
  await testInfo.attach("preview.aria.yml", { body: aria, contentType: "text/yaml" });
  await testInfo.attach("preview.styles.json", {
    body: JSON.stringify(styles, null, 2),
    contentType: "application/json",
  });

  return styles;
}

export async function runKeyboardTrace(page: Page, testInfo: TestInfo, keys: string[]) {
  const trace = [];

  for (const key of keys) {
    const before = await activeElementSnapshot(page);
    await page.keyboard.press(key);
    const after = await activeElementSnapshot(page);
    trace.push({ after, before, key });
  }

  await testInfo.attach("preview.keyboard.json", {
    body: JSON.stringify(trace, null, 2),
    contentType: "application/json",
  });
  return trace;
}

export async function assertNoAxeViolations(page: Page, include = "body") {
  const results = await new AxeBuilder({ page }).include(include).analyze();
  if (results.violations.length > 0) {
    const summary = results.violations.map((violation) => ({
      id: violation.id,
      impact: violation.impact,
      nodes: violation.nodes.map((node) => node.target),
    }));
    throw new Error(`Axe found accessibility violations:\n${JSON.stringify(summary, null, 2)}`);
  }
}
