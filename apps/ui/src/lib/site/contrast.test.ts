import { access, readFile } from "node:fs/promises";
import { describe, expect, test } from "vitest";

type Rgb = [red: number, green: number, blue: number];

const themeCss = await readFile(new URL("../../styles/theme.css", import.meta.url), "utf8");
const contentCss = await readFile(new URL("../../styles/content.css", import.meta.url), "utf8");
const homeSource = await readFile(
  new URL("../../routes/(site)/+page.svelte", import.meta.url),
  "utf8",
);
const thumbnailSource = await readFile(
  new URL("./CategoryThumbnail.svelte", import.meta.url),
  "utf8",
);
const headerSource = await readFile(new URL("./SiteHeader.svelte", import.meta.url), "utf8");
const badgeSource = await readFile(new URL("./NewBadge.svelte", import.meta.url), "utf8");
const contentPageSource = await readFile(new URL("./ContentPage.svelte", import.meta.url), "utf8");
const docsTableSource = await readFile(
  new URL("../content/components/DocsTable.svelte", import.meta.url),
  "utf8",
);

function rgb(hex: string): Rgb {
  return [1, 3, 5].map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16)) as Rgb;
}

function luminance(color: Rgb): number {
  const [red, green, blue] = color.map((channel) => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * (red ?? 0) + 0.7152 * (green ?? 0) + 0.0722 * (blue ?? 0);
}

function contrast(foreground: string, background: string): number {
  const values = [luminance(rgb(foreground)), luminance(rgb(background))];
  return (Math.max(...values) + 0.05) / (Math.min(...values) + 0.05);
}

describe("documentation color contracts", () => {
  test("keeps Svelte orange scoped to the site chrome", () => {
    expect(themeCss).toMatch(/\.site-shell\s*\{[^}]*--site-primary:\s*#ff3e00;/s);
    expect(themeCss).not.toMatch(/(^|\n)\s*--primary:\s*#ff3e00/);
    expect(themeCss).toContain("--thumb-primary-to: var(--primary);");
    expect(homeSource).toContain("bg-site-primary");
    expect(headerSource).toContain("bg-[#ff3e00]");
    expect(headerSource).toContain("text-[#171717]");
  });

  test.each([
    ["light body text", "#272727", "#fafafa"],
    ["light muted text", "#686868", "#fafafa"],
    ["light primary action", "#fff8f5", "#c93200"],
    ["Svelte badge", "#171717", "#ff3e00"],
    ["dark body text", "#f4f4f4", "#111111"],
    ["dark muted text", "#9d9d9d", "#111111"],
  ])("%s clears WCAG AA", (_label, foreground, background) => {
    expect(contrast(foreground, background)).toBeGreaterThanOrEqual(4.5);
  });

  test("defines explicit light and dark component tokens", () => {
    expect(themeCss).toMatch(/\.site-shell\s*\{[^}]*--site-background:\s*#fafafa;/s);
    expect(themeCss).toMatch(/html\.dark \.site-shell\s*\{[^}]*--site-background:\s*#111111;/s);
    expect(themeCss).toMatch(
      /html\.dark \.site-shell\s*\{[^}]*--site-muted:\s*var\(--muted-foreground\);/s,
    );
    expect(themeCss).toMatch(/html\.dark\s*\{[^}]*--muted-foreground:\s*#818181;/s);
  });
});

describe("documentation layout and interaction contracts", () => {
  test("expresses page-owned geometry with Tailwind utilities", () => {
    expect(homeSource).toContain("py-8");
    expect(homeSource).toContain("md:py-12");
    expect(homeSource).toContain("lg:py-16");
    expect(homeSource).toContain("h-55");
    expect(homeSource).toContain("overflow-x-auto");
    expect(thumbnailSource).toContain("px-8 py-6");
  });

  test("uses the exact COSS type metrics with the licensed Cal Sans variable face", () => {
    const rootRule = themeCss.match(/:root\s*\{([^}]*)\}/)?.[1] ?? "";

    expect(themeCss).toContain('font-family: "Cal Sans";');
    expect(themeCss).toContain('src: url("/fonts/cal-sans/CalSansVF.woff2") format("woff2");');
    expect(rootRule).toContain('--site-font-sans:\n    "Cal Sans", ui-sans-serif, system-ui');
    expect(themeCss).toMatch(/body\s*\{[^}]*--font-sans:\s*var\(--site-font-sans\)/s);
    expect(themeCss).toMatch(/body\s*\{[^}]*font-family:\s*var\(--site-font-sans\)/s);
    expect(homeSource).toContain("font-heading text-4xl leading-10 font-bold");
    expect(homeSource).toContain("text-site-muted text-sm leading-5");
    expect(rootRule).not.toContain("font-variation-settings");
  });

  test("uses the upstream responsive column progression", () => {
    expect(homeSource).toContain("sm:grid-cols-2");
    expect(homeSource).toContain("lg:grid-cols-3");
    expect(homeSource).toContain("min-[80rem]:grid-cols-4");
  });

  test("keeps page typography in Tailwind and custom CSS limited to generated code", async () => {
    const htmlRule = themeCss.match(/(?:^|\n)html\s*\{([^}]*)\}/)?.[1] ?? "";

    expect(htmlRule).not.toContain("min-width");
    expect(themeCss).toMatch(
      /\.site-container\s*\{[^}]*max-width:\s*88\.5rem;[^}]*padding-inline:\s*1rem;/s,
    );
    expect(themeCss).toMatch(
      /@media \(min-width: 64rem\)[\s\S]*?\.site-container\s*\{[^}]*padding-inline:\s*1\.5rem;/,
    );
    expect(contentCss).toContain(".shiki");
    expect(contentCss).toContain(".docs-code-block");
    expect(contentCss).not.toContain(".content-page");
    expect(contentPageSource).toContain("[&>h2]:mt-12");
    expect(contentPageSource).toContain("[&>p:not(:first-child)]:mt-6");
    expect(docsTableSource).toContain("max-w-full overflow-x-auto");
    await expect(access(new URL("../../app.css", import.meta.url))).rejects.toThrow();
  });

  test("keeps COSS controls, badges, focus, and reduced-motion behavior in component markup", () => {
    expect(homeSource).toContain("rounded-[0.625rem]");
    expect(homeSource).toContain("font-medium");
    expect(homeSource).toContain("whitespace-nowrap");
    expect(homeSource).toContain("active:shadow-");
    expect(badgeSource).toContain("h-4.5");
    expect(badgeSource).toContain("bg-info/8");
    expect(themeCss).toContain(".header-markers");
    expect(headerSource).toContain("focus-visible:outline-2");
    expect(thumbnailSource).toContain("motion-reduce:transition-none");
    expect(contentPageSource).toContain("[&_a:focus-visible]:outline-site-primary");
    expect(contentPageSource).not.toContain("focus-visible:outline-none");
  });
});
