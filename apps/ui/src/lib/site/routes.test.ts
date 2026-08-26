import { readFile } from "node:fs/promises";
import { render } from "svelte/server";
import { describe, expect, test } from "vitest";
import HomePage from "../../routes/+page.svelte";
import CreditsPage from "../../routes/credits/+page.svelte";
import HealthPage from "../../routes/preview/_health/+page.svelte";

describe("documentation routes", () => {
  test("the home route identifies the project and its author", () => {
    const { body } = render(HomePage);
    const visibleText = body.replaceAll(/<!--.*?-->|<[^>]+>/gs, "");

    expect(body).toContain("COSS for Svelte");
    expect(visibleText).toContain("Unofficial Svelte port made by Miel.");
    expect(body).toContain("https://github.com/mielsense");
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
    expect(appCss).not.toMatch(/--primary:\s*#ff3e00/);
    expect(previewCss).not.toContain("--site-");
    expect(previewCss).toMatch(/\.preview-canvas\s*\{[^}]*--primary:/s);
  });

  test("the root layout renders navigation during SSR and removes chrome from previews", async () => {
    const layout = await readFile(new URL("../../routes/+layout.svelte", import.meta.url), "utf8");

    expect(layout).toContain('page.url.pathname.startsWith("/preview")');
    expect(layout).toContain("<SiteHeader />");
    expect(layout).not.toContain("onMount");
    expect(layout).not.toContain("hydrated");
    expect(layout).not.toContain("mounted");
  });
});
