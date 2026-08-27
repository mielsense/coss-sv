import AxeBuilder from "@axe-core/playwright";
import type { Locator, Page, TestInfo } from "@playwright/test";
import {
  type PreviewWidth,
  previewWidths,
} from "../../../apps/ui/src/routes/preview/[name]/preview-contract.js";

type ConsoleGuard = {
  assertNoErrors: () => void;
  clear: () => void;
  failures: string[];
};

type ExternalRequestGuard = {
  assertNoExternalRequests: () => void;
  clear: () => void;
  failures: string[];
};

export const fixedClockTime = "2026-01-15T12:00:00.000Z";
export const localPreviewOrigins = new Set([
  "http://127.0.0.1:4000",
  "http://127.0.0.1:4173",
  "http://localhost:4000",
  "http://localhost:4173",
  "ws://127.0.0.1:4000",
  "ws://127.0.0.1:4173",
  "ws://localhost:4000",
  "ws://localhost:4173",
]);

const deterministicPages = new WeakMap<Page, ExternalRequestGuard>();

export const previewViewportHeights = {
  mobile: 844,
  tablet: 1024,
  desktop: 800,
} as const satisfies Record<PreviewWidth, number>;

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

export async function prepareDeterministicPage(page: Page): Promise<ExternalRequestGuard> {
  const existing = deterministicPages.get(page);
  if (existing) return existing;

  const failures: string[] = [];
  const guard: ExternalRequestGuard = {
    failures,
    assertNoExternalRequests() {
      if (failures.length > 0) {
        throw new Error(`Preview requested external resources:\n${failures.join("\n")}`);
      }
    },
    clear() {
      failures.length = 0;
    },
  };

  await page.clock.setFixedTime(new Date(fixedClockTime));
  await page.route("**/*", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    if (
      localPreviewOrigins.has(url.origin) ||
      url.protocol === "data:" ||
      url.protocol === "blob:"
    ) {
      await route.continue();
      return;
    }

    failures.push(`${request.method()} ${request.url()}`);
    await route.abort("blockedbyclient");
  });
  await page.routeWebSocket(/^wss?:\/\//, async (socket) => {
    const url = new URL(socket.url());
    if (localPreviewOrigins.has(url.origin)) {
      socket.connectToServer();
      return;
    }

    failures.push(`WEBSOCKET ${socket.url()}`);
    await socket.close({ code: 1008, reason: "External WebSocket blocked by parity harness" });
  });
  deterministicPages.set(page, guard);
  return guard;
}

export async function openReadyPreview(
  page: Page,
  name: string,
  theme: "dark" | "light",
  width: PreviewWidth,
) {
  await page.setViewportSize({
    height: previewViewportHeights[width],
    width: previewWidths[width],
  });
  const externalRequests = await prepareDeterministicPage(page);
  const response = await page.goto(
    `/preview/${encodeURIComponent(name)}?theme=${theme}&width=${width}`,
    {
      waitUntil: "networkidle",
    },
  );
  if (!response?.ok()) {
    throw new Error(`Preview request failed with ${response?.status() ?? "no response"}.`);
  }

  const ready = page.locator('[data-preview-ready="true"]');
  await ready.waitFor({ state: "visible" });
  externalRequests.assertNoExternalRequests();
  return { externalRequests, ready, serverHtml: await response.text() };
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
