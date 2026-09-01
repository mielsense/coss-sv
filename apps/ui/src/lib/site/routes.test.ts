import { access, readFile } from "node:fs/promises";
import { render } from "svelte/server";
import { describe, expect, test } from "vitest";
import ErrorPage from "../../routes/+error.svelte";
import HomePage from "../../routes/(site)/+page.svelte";
import CreditsPage from "../../routes/(site)/credits/+page.svelte";
import HealthPage from "../../routes/(preview)/preview/_health/+page.svelte";
import SiteFooter from "./SiteFooter.svelte";
import { componentCategories } from "./categories.js";

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

  test("shared chrome links to the Svelte port and keeps upstream provenance separate", async () => {
    const header = await readFile(new URL("./SiteHeader.svelte", import.meta.url), "utf8");
    const commandMenu = await readFile(new URL("./CommandMenu.svelte", import.meta.url), "utf8");
    const mobileNav = await readFile(new URL("./MobileNav.svelte", import.meta.url), "utf8");
    const site = await readFile(new URL("./site.ts", import.meta.url), "utf8");
    const footer = render(SiteFooter).body;

    expect(header).toContain("repositoryUrl");
    expect(header).not.toContain("upstreamUrl");
    expect(site).toContain("https://github.com/mielsense/coss-sv");
    expect(site).toContain("https://github.com/cosscom/coss");
    expect(header).not.toContain("10.4k");
    expect(header).toContain('aria-label="COSS for Svelte repository"');
    expect(header).toContain('<span class="hidden sm:inline">0</span>');
    expect(header).toContain('data-theme-glyph="contrast"');
    expect(header).not.toContain("M12 2v2m0 16v2");
    expect(commandMenu).toContain('aria-label="Search documentation"');
    expect(mobileNav).toContain('aria-label="Toggle Menu"');
    expect(header).toContain("coss.com");
    expect(header).toContain(">ui</span>");
    expect(header).toContain("bg-[#ff3e00]");
    expect(header).toContain("text-site-foreground");
    expect(header).not.toContain("text-[#171717]");
    expect(header).toContain(">Svelte</span");
    expect(header).toContain("aria-current=");
    expect(footer).toContain('href="/"');
    expect(footer).toContain("coss.com <span");
    expect(footer).toContain(">ui</span>");
    expect(footer).toContain("Unofficial Svelte port made by");
    expect(footer).toContain("https://github.com/mielsense");
    expect(footer).toContain('href="/credits"');
  });

  test("shared chrome renders every interface icon from Hugeicons", async () => {
    const sources = await Promise.all(
      ["SiteHeader.svelte", "MobileNav.svelte", "CommandMenu.svelte"].map(async (file) => ({
        file,
        source: await readFile(new URL(`./${file}`, import.meta.url), "utf8"),
      })),
    );

    for (const { file, source } of sources) {
      expect(source, file).toContain('from "@hugeicons/core-free-icons/');
      expect(source, file).toContain("HugeiconsIcon");
      expect(source, file).not.toContain("<svg");
      expect(source, file).not.toContain("<path");
      expect(source, file).not.toContain("<circle");
      expect(source, file).not.toContain("<ellipse");
    }

    expect(sources.find(({ file }) => file === "SiteHeader.svelte")?.source).toContain(
      "GithubIcon",
    );
    expect(sources.find(({ file }) => file === "SiteHeader.svelte")?.source).toContain(
      "ContrastIcon",
    );
    expect(sources.find(({ file }) => file === "MobileNav.svelte")?.source).toContain("Menu09Icon");
    expect(sources.find(({ file }) => file === "CommandMenu.svelte")?.source).toContain(
      "Atom01Icon",
    );
    expect(sources.find(({ file }) => file === "CommandMenu.svelte")?.source).toContain(
      "BookOpen02Icon",
    );
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

  test("every component navigation entry has an HTML route behind one docs loader", async () => {
    await Promise.all(
      componentCategories.map(({ slug }) =>
        expect(
          access(
            new URL(`../../routes/(site)/docs/components/${slug}/+page.svelte`, import.meta.url),
          ),
        ).resolves.toBeUndefined(),
      ),
    );
    await expect(
      access(new URL("../../routes/(site)/docs/+layout.server.ts", import.meta.url)),
    ).resolves.toBeUndefined();
  });

  test("exports and production-wires the preview presentation", async () => {
    const siteIndex = await readFile(new URL("./index.ts", import.meta.url), "utf8");
    const presentationRoute = await readFile(
      new URL("../../routes/(site)/docs/preview/[name]/+page.svelte", import.meta.url),
      "utf8",
    );
    const presentationLayout = await readFile(
      new URL("../../routes/(site)/docs/preview/+layout@(site).svelte", import.meta.url),
      "utf8",
    );

    expect(siteIndex).toContain(
      'export { default as PreviewPresentation } from "./PreviewPresentation.svelte";',
    );
    expect(presentationRoute).toContain(
      'import { ContentPage, PreviewPresentation } from "@/site/index.js";',
    );
    expect(presentationRoute).toContain("<PreviewPresentation");
    expect(presentationLayout).toContain("{@render children()}");
  });

  test("runs site browser contracts from package and root test gates", async () => {
    const packageManifest = JSON.parse(
      await readFile(new URL("../../../package.json", import.meta.url), "utf8"),
    ) as { scripts: Record<string, string> };
    const rootManifest = JSON.parse(
      await readFile(new URL("../../../../../package.json", import.meta.url), "utf8"),
    ) as { scripts: Record<string, string> };

    expect(packageManifest.scripts["test:browser"]).toContain("vitest.browser.config.ts");
    expect(packageManifest.scripts["test:unit"]).toContain("test:browser");
    expect(packageManifest.scripts.test).toContain("test:unit");
    expect(rootManifest.scripts["test:docs:browser"]).toContain("test:browser");
    expect(rootManifest.scripts.test).toContain("turbo run test:unit");
  });

  test("the error route keeps the upstream 404 copy and recovery action", () => {
    const { body } = render(ErrorPage, {
      context: new Map([
        ["__request__", { page: { status: 404, url: new URL("https://example.com/missing") } }],
      ]),
    });

    expect(body).toContain("Page Not Found");
    expect(body).toContain("doesn't exist or may have been moved");
    expect(body).toContain("Back to Home");
  });
});

describe("theme boundaries", () => {
  test("the Svelte orange token belongs only to documentation chrome", async () => {
    const themeCss = await readFile(new URL("../../styles/theme.css", import.meta.url), "utf8");
    const previewCss = await readFile(
      new URL("../../routes/(preview)/preview/preview.css", import.meta.url),
      "utf8",
    );

    expect(themeCss).toMatch(/\.site-shell\s*\{[^}]*--site-primary:\s*#ff3e00;/s);
    expect(themeCss).not.toMatch(/(^|\n)\s*--primary:\s*#ff3e00/);
    expect(themeCss).toMatch(/\.site-shell\s*\{[^}]*--site-accent:/s);
    expect(themeCss).toMatch(/html\.dark \.site-shell\s*\{[^}]*--site-accent:/s);
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
    const mobileNav = await readFile(new URL("./MobileNav.svelte", import.meta.url), "utf8");
    const footer = await readFile(new URL("./SiteFooter.svelte", import.meta.url), "utf8");

    expect(mobileNav).toContain("w-[min(22rem,calc(100%-3rem))]");
    expect(mobileNav).toContain("0_10px_15px_-3px_rgb(0_0_0/5%)");
    expect(mobileNav).toContain("0_4px_6px_-4px_rgb(0_0_0/5%)");
    expect(mobileNav).toContain("outline-none");
    expect(mobileNav).toContain("touch-pan-y");
    expect(mobileNav).toContain("touch-none");
    expect(mobileNav).toContain("translate-x-[var(--drawer-swipe-movement-x)]");
    expect(footer).toContain("py-6");
    expect(footer).toContain("justify-between");
  });

  test("routes the upstream header, CTA, and Introduction entry through /docs", async () => {
    const pageSource = await readFile(
      new URL("../../routes/(site)/+page.svelte", import.meta.url),
      "utf8",
    );
    const siteSource = await readFile(new URL("./site.ts", import.meta.url), "utf8");
    const docsRoute = await readFile(
      new URL("../../routes/(site)/docs/+page.svelte", import.meta.url),
      "utf8",
    );

    expect(pageSource).toContain('href="/docs"');
    expect(pageSource).toContain("Get started");
    expect(siteSource.match(/href: "\/docs"/g)).toHaveLength(2);
    expect(siteSource).not.toContain('/docs/introduction", label: "Introduction"');
    expect(docsRoute).toContain("$content/docs/introduction.svx");
  });

  test("the docs route uses the measured three-column COSS shell", async () => {
    const docsLayout = await readFile(
      new URL("../../routes/(site)/docs/+layout.svelte", import.meta.url),
      "utf8",
    );
    const sidebar = await readFile(new URL("./DocsSidebar.svelte", import.meta.url), "utf8");
    const toc = await readFile(new URL("./DocsToc.svelte", import.meta.url), "utf8");
    expect(docsLayout).toContain("<DocsSidebar />");
    expect(docsLayout).toContain("<DocsToc items={documentation?.tableOfContents ?? []} />");
    expect(docsLayout).toContain("docs-content flex flex-col");
    expect(docsLayout).toContain("grid-cols-[15rem_minmax(0,1fr)_18rem]");
    expect(docsLayout).toContain("lg:m-8 lg:mx-4");
    expect(docsLayout).toContain("lg:p-8");
    expect(sidebar).toContain("documentationNavigationGroups");
    expect(sidebar).toContain(
      'aria-current={page.url.pathname === item.href ? "page" : undefined}',
    );
    expect(toc).toContain("IntersectionObserver");
    expect(toc).toContain("document.getElementById(id)");
    expect(toc).not.toContain("MutationObserver");
  });

  test("pathless route groups isolate the site, preview, API, and machine surfaces", async () => {
    const rootLayout = await readFile(
      new URL("../../routes/+layout.svelte", import.meta.url),
      "utf8",
    );
    const siteLayout = await readFile(
      new URL("../../routes/(site)/+layout.svelte", import.meta.url),
      "utf8",
    );

    expect(rootLayout).toContain('import "../tailwind.css";');
    expect(rootLayout).toContain('import "../styles/theme.css";');
    expect(rootLayout).toContain('import "../styles/content.css";');
    expect(rootLayout).not.toContain("SiteHeader");
    expect(rootLayout).not.toContain("page.url.pathname");
    expect(siteLayout).toContain("<SiteHeader />");
    expect(siteLayout).toContain("<SiteFooter />");
    await expect(
      access(new URL("../../routes/(preview)/preview", import.meta.url)),
    ).resolves.toBeUndefined();
    await expect(
      access(new URL("../../routes/(api)/api", import.meta.url)),
    ).resolves.toBeUndefined();
    await expect(
      access(new URL("../../routes/(machine)/llms.txt", import.meta.url)),
    ).resolves.toBeUndefined();
  });

  test("the preview inherits canonical tokens before applying canvas overrides", async () => {
    const rootLayout = await readFile(
      new URL("../../routes/+layout.svelte", import.meta.url),
      "utf8",
    );
    const previewLayout = await readFile(
      new URL("../../routes/(preview)/preview/+layout.svelte", import.meta.url),
      "utf8",
    );

    expect(rootLayout).toContain('import "@coss-sv/ui/styles/globals.css";');
    expect(previewLayout).toContain('import "./preview.css";');
    expect(previewLayout).not.toContain("@coss-sv/ui/styles/globals.css");
  });

  test("the preview registry discovers component parity fixtures without aggregate edits", async () => {
    const registry = await readFile(
      new URL("../../routes/(preview)/preview/[name]/preview-registry.ts", import.meta.url),
      "utf8",
    );

    expect(registry).toContain("import.meta.glob<PreviewModule>(");
    expect(registry).toContain('"../../../../lib/parity/components/*.svelte"');
    expect(registry).toContain("Object.entries(componentModules)");
  });

  test("the preview centers horizontally and applies each vertical alignment", async () => {
    const previewPage = await readFile(
      new URL("../../routes/(preview)/preview/[name]/+page.svelte", import.meta.url),
      "utf8",
    );
    const frameRule = previewPage.match(/\.preview-frame\s*\{([^}]*)\}/)?.[1] ?? "";
    const surfaceRule = previewPage.match(/\.preview-surface\s*\{([^}]*)\}/)?.[1] ?? "";
    const alignmentRule = (alignment: "start" | "center" | "end") =>
      previewPage.match(
        new RegExp(`\\.preview-frame\\[data-preview-align="${alignment}"\\]\\s*\\{([^}]*)\\}`),
      )?.[1] ?? "";

    expect(frameRule).toContain("display: flex;");
    expect(frameRule).toContain("justify-content: center;");
    expect(frameRule).toContain("overflow-y: auto;");
    expect(frameRule).not.toContain("place-items: center;");
    expect(alignmentRule("start")).toMatch(/align-items\s*:\s*flex-start\s*;/);
    expect(alignmentRule("center")).toMatch(/align-items\s*:\s*center\s*;/);
    expect(alignmentRule("end")).toMatch(/align-items\s*:\s*flex-end\s*;/);
    expect(surfaceRule).toContain("flex: 0 0 auto;");
    expect(surfaceRule).not.toContain("margin-block: auto;");
  });
});
