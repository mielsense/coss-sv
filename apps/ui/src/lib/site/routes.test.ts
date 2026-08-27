import { readFile } from "node:fs/promises";
import { render } from "svelte/server";
import { describe, expect, test } from "vitest";
import HomePage from "../../routes/+page.svelte";
import CreditsPage from "../../routes/credits/+page.svelte";
import HealthPage from "../../routes/preview/_health/+page.svelte";
import SiteFooter from "./SiteFooter.svelte";

describe("documentation routes", () => {
  test("the home route preserves the COSS page hierarchy with Svelte product facts", () => {
    const { body } = render(HomePage);

    expect(body).toContain("A new, modern UI component library built on top of Shards UI.");
    expect(body).toContain("Built for developers and AI.");
    expect(body).toContain("Browse 508 particles");
    expect(body).toContain('href="/docs"');
    expect(body.match(/data-category=/g)).toHaveLength(55);
    expect(body).not.toContain("github.com/mielsense/coss-sv");
  });

  test("shared chrome retains COSS provenance and the exact upstream footer", async () => {
    const header = await readFile(new URL("./SiteHeader.svelte", import.meta.url), "utf8");
    const commandMenu = await readFile(new URL("./CommandMenu.svelte", import.meta.url), "utf8");
    const mobileNav = await readFile(new URL("./MobileNav.svelte", import.meta.url), "utf8");
    const site = await readFile(new URL("./site.ts", import.meta.url), "utf8");
    const footer = render(SiteFooter).body;

    expect(header).toContain("upstreamUrl");
    expect(site).toContain("https://github.com/cosscom/coss");
    expect(header).toContain("10.4k");
    expect(header).toContain('data-theme-glyph="contrast"');
    expect(header).not.toContain("M12 2v2m0 16v2");
    expect(commandMenu).toContain('aria-label="Search documentation"');
    expect(mobileNav).toContain('aria-label="Toggle Menu"');
    expect(header).toContain("coss.com");
    expect(header).toContain(">ui</span>");
    expect(header).toContain("aria-current=");
    expect(footer).toContain('href="/"');
    expect(footer).toContain("© 2026");
    expect(footer).toContain("coss.com</a> – open source, open heart, open mind.");
    expect(footer).not.toContain("coss.com</a> ·");
    expect(footer).not.toContain("github.com/mielsense");
  });

  test("applies the saved theme before Svelte hydrates", async () => {
    const appHtml = await readFile(new URL("../../app.html", import.meta.url), "utf8");

    expect(appHtml).toContain('localStorage.getItem("coss-sv-theme")');
    expect(appHtml).toContain('matchMedia("(prefers-color-scheme: dark)").matches');
    expect(appHtml).toContain("document.documentElement.classList.add(theme)");
    expect(appHtml.indexOf("coss-sv-theme")).toBeLessThan(appHtml.indexOf("%sveltekit.head%"));
  });

  test("the credits route links to the upstream project, Miel, and legal files", () => {
    const { body } = render(CreditsPage);

    expect(body).toContain("https://github.com/cosscom/coss");
    expect(body).toContain("https://github.com/mielsense");
    expect(body).toContain('href="/LICENSE"');
    expect(body).toContain('href="/NOTICE.md"');
    expect(body).toContain('href="/THIRD_PARTY_NOTICES.md"');
  });

  test("the preview health route exposes its readiness marker", () => {
    const { body } = render(HealthPage);

    expect(body).toContain('data-preview-ready="true"');
    expect(body).toContain("ready");
  });
});

describe("theme boundaries", () => {
  test("the Svelte orange token belongs only to documentation chrome", async () => {
    const appCss = await readFile(new URL("../../app.css", import.meta.url), "utf8");
    const previewCss = await readFile(
      new URL("../../routes/preview/preview.css", import.meta.url),
      "utf8",
    );

    expect(appCss).toMatch(/\.site-shell\s*\{[^}]*--site-primary:\s*#ff3e00;/s);
    expect(appCss).not.toMatch(/(^|\n)\s*--primary:\s*#ff3e00/);
    expect(previewCss).not.toContain("--site-");
    expect(previewCss).toMatch(
      /\.preview-canvas,\s*\[data-preview-theme="light"\]\s*\{[^}]*--primary:/s,
    );
    expect(previewCss).toContain(
      "--border: color-mix(in oklab, var(--color-black) 8%, transparent);",
    );
    expect(previewCss).toContain(
      "--border: color-mix(in oklab, var(--color-white) 6%, transparent);",
    );
  });

  test("the mobile dialog keeps the measured COSS width and edge shadow", async () => {
    const appCss = await readFile(new URL("../../app.css", import.meta.url), "utf8");
    const dialogRule =
      [...appCss.matchAll(/\.mobile-menu-dialog\s*\{([^}]*)\}/g)]
        .map((match) => match[1] ?? "")
        .find((rule) => rule.includes("width:")) ?? "";
    const panelRule = appCss.match(/\.mobile-menu-panel\s*\{([^}]*)\}/)?.[1] ?? "";
    const viewportRule = appCss.match(/\.mobile-menu-viewport\s*\{([^}]*)\}/)?.[1] ?? "";
    const footerRule =
      [...appCss.matchAll(/(?:^|\n)\.site-footer\s*\{([^}]*)\}/g)]
        .map((match) => match[1] ?? "")
        .find((rule) => rule.includes("padding-block:")) ?? "";
    const footerInnerRule = appCss.match(/(?:^|\n)\.footer-inner\s*\{([^}]*)\}/)?.[1] ?? "";

    expect(dialogRule).toContain("width: min(22rem, calc(100% - 3rem));");
    expect(dialogRule).toContain("0 10px 15px -3px rgb(0 0 0 / 5%)");
    expect(dialogRule).toContain("0 4px 6px -4px rgb(0 0 0 / 5%)");
    expect(panelRule).toContain("outline: none;");
    expect(panelRule).toContain("touch-action: pan-y;");
    expect(panelRule).not.toContain("box-shadow");
    expect(viewportRule).toContain("touch-action: none;");
    expect(dialogRule).toContain("transform: translateX(var(--drawer-swipe-movement-x));");
    expect(footerRule).toContain("padding-block: 1.5rem;");
    expect(footerInnerRule).toContain("justify-content: center;");
    expect(appCss).not.toMatch(
      /@media \(max-width: 39\.999rem\)[\s\S]*?\.footer-inner\s*\{[^}]*min-height:/,
    );
  });

  test("routes the upstream header, CTA, and Introduction entry through /docs", async () => {
    const pageSource = await readFile(
      new URL("../../routes/+page.svelte", import.meta.url),
      "utf8",
    );
    const siteSource = await readFile(new URL("./site.ts", import.meta.url), "utf8");
    const docsRoute = await readFile(
      new URL("../../routes/docs/+page.svelte", import.meta.url),
      "utf8",
    );

    expect(pageSource).toContain('href="/docs">Get started</a>');
    expect(siteSource.match(/href: "\/docs"/g)).toHaveLength(2);
    expect(siteSource).not.toContain('/docs/introduction", label: "Introduction"');
    expect(docsRoute).toContain("$content/docs/introduction.svx");
  });

  test("the root layout renders navigation during SSR and removes chrome from previews", async () => {
    const layout = await readFile(new URL("../../routes/+layout.svelte", import.meta.url), "utf8");

    expect(layout).toContain('page.url.pathname.startsWith("/preview")');
    expect(layout.indexOf('import "../tailwind.css";')).toBeLessThan(
      layout.indexOf('import "../app.css";'),
    );
    expect(layout).toContain("<SiteHeader />");
    expect(layout).not.toContain("onMount");
    expect(layout).not.toContain("hydrated");
    expect(layout).not.toContain("mounted");
  });

  test("the preview imports canonical component tokens before its canvas overrides", async () => {
    const previewLayout = await readFile(
      new URL("../../routes/preview/+layout.svelte", import.meta.url),
      "utf8",
    );

    const componentStyles = previewLayout.indexOf('import "@coss-sv/ui/styles/globals.css";');
    const canvasStyles = previewLayout.indexOf('import "./preview.css";');

    expect(componentStyles).toBeGreaterThan(-1);
    expect(canvasStyles).toBeGreaterThan(componentStyles);
  });

  test("the preview registry discovers component parity fixtures without aggregate edits", async () => {
    const registry = await readFile(
      new URL("../../routes/preview/[name]/preview-registry.ts", import.meta.url),
      "utf8",
    );

    expect(registry).toContain(
      'import.meta.glob<PreviewModule>(\n  "../../../lib/parity/components/*.svelte"',
    );
    expect(registry).toContain("Object.entries(componentModules)");
  });

  test("the preview centers short fixtures without clipping the top of tall aggregates", async () => {
    const previewPage = await readFile(
      new URL("../../routes/preview/[name]/+page.svelte", import.meta.url),
      "utf8",
    );
    const frameRule = previewPage.match(/\.preview-frame\s*\{([^}]*)\}/)?.[1] ?? "";
    const surfaceRule = previewPage.match(/\.preview-surface\s*\{([^}]*)\}/)?.[1] ?? "";

    expect(frameRule).toContain("display: flex;");
    expect(frameRule).toContain("align-items: flex-start;");
    expect(frameRule).toContain("justify-content: center;");
    expect(frameRule).toContain("overflow: auto;");
    expect(frameRule).not.toContain("place-items: center;");
    expect(surfaceRule).toContain("flex: 0 0 auto;");
    expect(surfaceRule).toContain("margin-block: auto;");
  });
});
