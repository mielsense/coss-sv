import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { expect, type Locator, test } from "@playwright/test";
import { monitorConsole, openReadyPreview, prepareDeterministicPage } from "./helpers/preview.js";

const repositoryRoot = resolve(import.meta.dirname, "../..");
const particles = [
  "p-accordion-1",
  "p-accordion-2",
  "p-accordion-3",
  "p-accordion-4",
  "p-card-1",
  "p-card-10",
  "p-card-11",
  "p-card-2",
  "p-card-3",
  "p-card-4",
  "p-card-5",
  "p-card-6",
  "p-card-7",
  "p-card-8",
  "p-card-9",
  "p-collapsible-1",
  "p-empty-1",
  "p-frame-1",
  "p-frame-2",
  "p-frame-3",
  "p-frame-4",
  "p-separator-1",
  "p-skeleton-1",
  "p-skeleton-2",
  "p-tabs-10",
  "p-tabs-11",
  "p-tabs-12",
  "p-tabs-13",
  "p-tabs-14",
  "p-tabs-15",
  "p-tabs-2",
  "p-tabs-3",
  "p-tabs-4",
  "p-tabs-5",
  "p-tabs-6",
  "p-tabs-7",
  "p-tabs-8",
  "p-tabs-9",
] as const;

function particleSource(id: (typeof particles)[number]): string {
  return readFileSync(
    resolve(repositoryRoot, `apps/ui/registry/default/particles/${id}.svelte`),
    "utf8",
  );
}

test.describe.configure({ mode: "parallel" });
test.setTimeout(120_000);

for (const id of particles) {
  test(`${id} renders with deterministic source and install links`, async ({ page }, testInfo) => {
    const guard = monitorConsole(page);
    const theme = testInfo.project.name === "dark" ? "dark" : "light";
    const source = particleSource(id);
    const responsive = /responsive:\s*true/.test(source);
    const widths = responsive ? (["desktop", "mobile"] as const) : (["desktop"] as const);

    for (const width of widths) {
      let ready: Locator;
      if (testInfo.project.name === "motion") {
        await page.setViewportSize({
          height: width === "mobile" ? 844 : 800,
          width: width === "mobile" ? 390 : 1200,
        });
        const externalRequests = await prepareDeterministicPage(page);
        const response = await page.goto(
          `/preview/${id}?theme=${theme}&width=${width}&timers=manual&align=center&reducedMotion=no-preference`,
          { waitUntil: "networkidle" },
        );
        expect(response?.ok()).toBe(true);
        ready = page.locator('[data-preview-ready="true"]');
        await ready.waitFor({ state: "visible" });
        externalRequests.assertNoExternalRequests();
        await expect(page.locator('[data-preview-reduced-motion="no-preference"]')).toHaveCount(1);
      } else {
        ({ ready } = await openReadyPreview(page, id, theme, width));
      }
      await expect(ready).toHaveAttribute("data-preview-kind", "particle");
      await expect(ready).toHaveAttribute(
        "data-preview-source-href",
        `https://github.com/mielsense/coss-sv/blob/main/apps/ui/registry/default/particles/${id}.svelte`,
      );
      await expect(ready).toHaveAttribute("data-preview-registry-href", `/r/${id}.json`);
      await expect(ready).toHaveAttribute(
        "data-preview-install-command",
        `pnpm dlx shadcn-svelte@latest add https://coss-sv.vercel.app/r/${id}.json`,
      );
      await expect(ready.locator('[data-slot="preview"] > *').first()).toHaveCount(1);

      if (id === "p-skeleton-1") {
        await expect(ready.locator('[data-slot="skeleton"]')).toHaveCount(15);
      } else if (/interactive:\s*true/.test(source)) {
        await expect(
          ready.locator(
            'button, input, select, textarea, a[href], [role="tab"], [role="combobox"]',
          ),
        ).not.toHaveCount(0);
      }

      guard.assertNoErrors();
      guard.clear();
    }
  });
}

test("D4 keyboard paths preserve disclosure, tabs, and Select behavior", async ({
  page,
}, testInfo) => {
  const theme = testInfo.project.name === "dark" ? "dark" : "light";

  let preview = await openReadyPreview(page, "p-accordion-1", theme, "desktop");
  const accordionTrigger = preview.ready.getByRole("button", { name: "What is Base UI?" });
  const accordionIndicator = accordionTrigger.locator('[data-slot="accordion-indicator"]');
  await expect(accordionIndicator).toHaveAttribute("aria-hidden", "true");
  await expect(accordionIndicator).toHaveCSS("rotate", "none");
  await accordionTrigger.focus();
  await page.keyboard.press("Enter");
  await expect(accordionTrigger).toHaveAttribute("aria-expanded", "true");
  await expect(accordionIndicator).toHaveCSS("rotate", "180deg");
  await expect(preview.ready).toContainText(
    "Base UI is a library of high-quality unstyled React components for design systems and web apps.",
  );
  await expect(preview.ready).not.toContainText(
    /ShardsUI|headless, accessible Svelte 5 components/,
  );

  preview = await openReadyPreview(page, "p-collapsible-1", theme, "desktop");
  const collapsibleTrigger = preview.ready.getByRole("button", { name: "Show recovery keys" });
  await collapsibleTrigger.focus();
  await page.keyboard.press("Space");
  await expect(collapsibleTrigger).toHaveAttribute("aria-expanded", "true");
  await expect(preview.ready.getByText("4829-1735-6621")).toBeVisible();

  preview = await openReadyPreview(page, "p-tabs-2", theme, "desktop");
  const tabs = preview.ready.getByRole("tab");
  await tabs.first().focus();
  await page.keyboard.press("ArrowRight");
  await expect(tabs.nth(1)).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
  await expect(preview.ready.getByText("Tab 2 content")).toBeVisible();

  preview = await openReadyPreview(page, "p-card-1", theme, "desktop");
  const framework = preview.ready.getByRole("combobox", { name: "Framework" });
  await framework.focus();
  await page.keyboard.press("ArrowDown");
  await expect(page.getByRole("option", { name: "Next.js" })).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await expect(page.getByRole("option", { name: "Vite" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(framework).toContainText("Vite");
});

test("all four Accordion examples preserve the exact COSS interactions and motion", async ({
  page,
}, testInfo) => {
  const theme = testInfo.project.name === "dark" ? "dark" : "light";
  const reducedMotion = testInfo.project.name === "motion" ? "no-preference" : "reduce";

  await page.setViewportSize({ height: 800, width: 1200 });
  const externalRequests = await prepareDeterministicPage(page);
  const response = await page.goto(
    `/preview/p-accordion-1?theme=${theme}&width=desktop&timers=real&align=start&reducedMotion=${reducedMotion}`,
    { waitUntil: "networkidle" },
  );
  expect(response?.ok()).toBe(true);
  let ready = page.locator('[data-preview-ready="true"]');
  await ready.waitFor({ state: "visible" });
  externalRequests.assertNoExternalRequests();

  const firstTrigger = ready.getByRole("button", { name: "What is Base UI?" });
  const initialTrigger = ready.getByRole("button", { name: "Can I use it for my project?" });
  await expect(initialTrigger).toHaveAttribute("aria-expanded", "true");

  if (reducedMotion === "no-preference") {
    const startingStyle = page.evaluate(
      () =>
        new Promise<{ duration: string; height: number; starting: boolean }>((resolve) => {
          const observer = new MutationObserver(() => {
            const panel = document.querySelector<HTMLElement>(
              '[data-slot="accordion-panel"][data-starting-style]',
            );
            if (!panel) return;
            const style = getComputedStyle(panel);
            observer.disconnect();
            resolve({
              duration: style.transitionDuration,
              height: panel.getBoundingClientRect().height,
              starting: panel.hasAttribute("data-starting-style"),
            });
          });
          observer.observe(document.body, { attributes: true, childList: true, subtree: true });
        }),
    );
    await firstTrigger.click();
    const starting = await startingStyle;
    expect(starting.starting).toBe(true);
    expect(starting.height).toBe(0);
    expect(starting.duration).toBe("0.2s");
  } else {
    await firstTrigger.click();
    const openedPanel = ready.locator('[data-slot="accordion-panel"]').filter({
      hasText:
        "Base UI is a library of high-quality unstyled React components for design systems and web apps.",
    });
    await expect(openedPanel).toBeVisible();
    expect(await openedPanel.evaluate((panel) => getComputedStyle(panel).transitionDuration)).toBe(
      "0s",
    );
  }
  await expect(firstTrigger).toHaveAttribute("aria-expanded", "true");
  await expect(initialTrigger).toHaveAttribute("aria-expanded", "false");
  await expect(ready).toContainText(
    "Base UI is a library of high-quality unstyled React components for design systems and web apps.",
  );

  ({ ready } = await openReadyPreview(page, "p-accordion-2", theme, "desktop", "real", "start"));
  const singleTrigger = ready.getByRole("button", { name: "What is Base UI?" });
  await singleTrigger.click();
  await expect(singleTrigger).toHaveAttribute("aria-expanded", "true");
  await singleTrigger.click();
  await expect(singleTrigger).toHaveAttribute("aria-expanded", "false");

  ({ ready } = await openReadyPreview(page, "p-accordion-3", theme, "desktop", "real", "start"));
  const multipleFirst = ready.getByRole("button", { name: "What is Base UI?" });
  const multipleSecond = ready.getByRole("button", { name: "How do I get started?" });
  await multipleFirst.click();
  await multipleSecond.click();
  await expect(multipleFirst).toHaveAttribute("aria-expanded", "true");
  await expect(multipleSecond).toHaveAttribute("aria-expanded", "true");

  ({ ready } = await openReadyPreview(page, "p-accordion-4", theme, "desktop", "real", "start"));
  await ready.getByRole("button", { name: "Open First Two" }).click();
  await expect(ready.getByText("Open items: item-1, item-2")).toBeVisible();
  await expect(ready.getByRole("button", { name: "What is Base UI?" })).toHaveAttribute(
    "aria-expanded",
    "true",
  );
  await expect(ready.getByRole("button", { name: "How do I get started?" })).toHaveAttribute(
    "aria-expanded",
    "true",
  );
});

test("p-tabs-13 keeps tab geometry and tooltip behavior through the approved wrapper", async ({
  page,
}, testInfo) => {
  const theme = testInfo.project.name === "dark" ? "dark" : "light";

  for (const width of ["desktop", "mobile"] as const) {
    const { ready } = await openReadyPreview(page, "p-tabs-13", theme, width);
    const list = ready.getByRole("tablist");
    const wrappers = list.locator(':scope > [data-slot="tooltip-trigger"]');
    const tabs = list.getByRole("tab");

    await expect(wrappers).toHaveCount(3);
    await expect(tabs).toHaveCount(3);
    for (const [index, name] of ["Overview", "Projects", "Settings"].entries()) {
      await expect(tabs.nth(index)).toHaveAccessibleName(name);
    }

    const geometry = await list.evaluate((element) => {
      const wrapperElements = [
        ...element.querySelectorAll<HTMLElement>(':scope > [data-slot="tooltip-trigger"]'),
      ];
      const tabElements = [
        ...element.querySelectorAll<HTMLElement>(':scope > span > [role="tab"]'),
      ];
      const rect = (node: HTMLElement) => {
        const box = node.getBoundingClientRect();
        return { height: box.height, left: box.left, top: box.top, width: box.width };
      };

      return {
        gap: Number.parseFloat(getComputedStyle(element).columnGap),
        tabs: tabElements.map((node) => ({
          flexGrow: getComputedStyle(node).flexGrow,
          rect: rect(node),
        })),
        wrappers: wrapperElements.map((node) => ({
          flexGrow: getComputedStyle(node).flexGrow,
          role: node.getAttribute("role"),
          tabindex: node.getAttribute("tabindex"),
          rect: rect(node),
        })),
      };
    });

    expect(geometry.gap).toBe(2);
    expect(geometry.wrappers.map(({ role, tabindex }) => ({ role, tabindex }))).toEqual([
      { role: null, tabindex: null },
      { role: null, tabindex: null },
      { role: null, tabindex: null },
    ]);
    expect(geometry.wrappers.map(({ flexGrow }) => flexGrow)).toEqual(["1", "1", "1"]);
    expect(geometry.tabs.map(({ flexGrow }) => flexGrow)).toEqual(["1", "1", "1"]);
    expect(geometry.wrappers.map(({ rect }) => rect)).toEqual(
      geometry.tabs.map(({ rect }) => rect),
    );
    for (let index = 1; index < geometry.wrappers.length; index += 1) {
      const previous = geometry.wrappers[index - 1]?.rect;
      const current = geometry.wrappers[index]?.rect;
      expect((current?.left ?? 0) - (previous?.left ?? 0) - (previous?.width ?? 0)).toBe(2);
    }

    await tabs.first().focus();
    await expect(page.getByRole("tooltip")).toHaveText("Overview");
    await page.keyboard.press("ArrowRight");
    await expect(tabs.nth(1)).toBeFocused();
    await expect(page.getByRole("tooltip", { name: "Projects" })).toHaveAttribute("data-open", "");
    await page.keyboard.press("Enter");
    await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
    await expect(ready.getByText("Projects content")).toBeVisible();

    await page.mouse.move(0, 0);
    await wrappers.nth(2).hover();
    await expect(page.getByRole("tooltip", { name: "Settings" })).toHaveAttribute("data-open", "");
  }
});
