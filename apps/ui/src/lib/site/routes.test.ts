import { readFile } from "node:fs/promises";
import { render } from "svelte/server";
import { describe, expect, test } from "vitest";
import HomePage from "../../routes/+page.svelte";
import CreditsPage from "../../routes/credits/+page.svelte";
import HealthPage from "../../routes/preview/_health/+page.svelte";
import SiteFooter from "./SiteFooter.svelte";
import SiteHeader from "./SiteHeader.svelte";

describe("documentation routes", () => {
  test("the home route preserves the COSS page hierarchy with Svelte product facts", () => {
    const { body } = render(HomePage);

    expect(body).toContain("A new, modern UI component library built on top of Shards UI.");
    expect(body).toContain("Built for developers and AI.");
    expect(body).toContain("Browse 508 particles");
    expect(body.match(/data-category=/g)).toHaveLength(55);
    expect(body).not.toContain("github.com/mielsense/coss-sv");
  });

  test("shared chrome retains COSS provenance and the exact upstream footer", () => {
    const header = render(SiteHeader).body;
    const footer = render(SiteFooter).body;

    expect(header).toContain("https://github.com/cosscom/coss");
    expect(header).toContain("<span>10.4k</span>");
    expect(header).toContain('data-theme-glyph="contrast"');
    expect(header).not.toContain("M12 2v2m0 16v2");
    expect(header).toContain('aria-label="Search documentation"');
    expect(header).toContain('aria-label="Toggle Menu"');
    expect(footer).toContain('href="/"');
    expect(footer).toContain("© 2026");
    expect(footer).toContain("coss.com</a> – open source, open heart, open mind.");
    expect(footer).not.toContain("coss.com</a> ·");
    expect(footer).not.toContain("Miel");
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
    expect(previewCss).toMatch(/\.preview-canvas\s*\{[^}]*--primary:/s);
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
});
