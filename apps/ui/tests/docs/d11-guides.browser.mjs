import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

let baseUrl = process.env.COSS_TEST_BASE_URL;
const appDirectory = fileURLToPath(new URL("../..", import.meta.url));
const viteExecutable = fileURLToPath(
  new URL("../../node_modules/vite/bin/vite.js", import.meta.url),
);
let preview;

const guides = [
  ["/docs", "Introduction"],
  ["/docs/get-started", "Get Started"],
  ["/docs/styling", "Styling"],
  ["/docs/radix-migration", "Migrating from shadcn-svelte and Bits UI"],
  ["/docs/skills", "Agent Skill"],
  ["/docs/changelog", "Changelog"],
  ["/docs/roadmap", "Roadmap"],
  ["/docs/hooks/use-media-query", "useMediaQuery"],
  ["/docs/hooks/use-copy-to-clipboard", "useCopyToClipboard"],
];

async function availablePort() {
  const probe = createServer();
  const port = await new Promise((resolve, reject) => {
    probe.once("error", reject);
    probe.listen(0, "127.0.0.1", () => {
      const address = probe.address();
      if (!address || typeof address === "string") return reject(new Error("no preview port"));
      resolve(address.port);
    });
  });
  await new Promise((resolve, reject) =>
    probe.close((error) => (error ? reject(error) : resolve())),
  );
  return port;
}

async function waitForPreview() {
  for (let attempt = 0; attempt < 120; attempt += 1) {
    try {
      if ((await fetch(`${baseUrl}/preview/_health`)).ok) return;
    } catch {
      // The production preview is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`preview did not become ready at ${baseUrl}`);
}

if (!baseUrl) {
  const port = await availablePort();
  baseUrl = `http://127.0.0.1:${port}`;
  preview = spawn(
    process.execPath,
    [viteExecutable, "preview", "--host", "127.0.0.1", "--port", String(port), "--strictPort"],
    { cwd: appDirectory, env: process.env, stdio: "inherit" },
  );
  await Promise.race([
    waitForPreview(),
    new Promise((_, reject) =>
      preview.once("exit", (code, signal) =>
        reject(new Error(`preview exited early (${code ?? "none"}/${signal ?? "none"})`)),
      ),
    ),
  ]);
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  permissions: ["clipboard-read", "clipboard-write"],
  viewport: { height: 900, width: 1280 },
});
const page = await context.newPage();
const diagnostics = [];

page.on("console", (message) => {
  if (["warning", "error"].includes(message.type())) {
    diagnostics.push(`${message.type()}: ${message.text()}`);
  }
});
page.on("pageerror", (error) => diagnostics.push(`pageerror: ${error.message}`));

try {
  for (const [route, heading] of guides) {
    const response = await page.goto(`${baseUrl}${route}`);
    assert.equal(response?.status(), 200, `${route} should return 200`);
    await page.getByRole("heading", { level: 1, name: heading, exact: true }).waitFor();
    await page.getByRole("button", { name: "Copy Markdown", exact: true }).waitFor();
    assert.equal(await page.locator("[data-docs-frame]").count(), 1);
  }

  await page.goto(`${baseUrl}/docs/get-started`);
  const copyMarkdown = page.getByRole("button", { name: "Copy Markdown", exact: true });
  const iconPaths = () =>
    copyMarkdown
      .locator("svg path")
      .evaluateAll((paths) => paths.map((path) => path.getAttribute("d")));
  const copiedPath = "M5 14L8.5 17.5L19 6.5";
  const showsCopiedIcon = async () => (await iconPaths()).includes(copiedPath);
  const initialIcon = await iconPaths();
  await copyMarkdown.click();
  assert.equal(await copyMarkdown.innerText(), "Copy Markdown");
  assert.equal(await showsCopiedIcon(), true, "successful copy should swap only the icon");
  assert.match(await page.evaluate(() => navigator.clipboard.readText()), /^# Get Started/m);
  await page.waitForTimeout(1_200);
  await copyMarkdown.click();
  await page.waitForTimeout(1_000);
  assert.equal(await showsCopiedIcon(), true, "a repeated copy should restart the feedback timer");
  await page.waitForTimeout(1_100);
  assert.equal(await showsCopiedIcon(), false);
  assert.deepEqual(await iconPaths(), initialIcon);

  await copyMarkdown.click();
  await page.goto(`${baseUrl}/docs/styling`);
  await page.waitForTimeout(2_100);
  assert.equal(await page.getByRole("button", { name: "Copy Markdown", exact: true }).count(), 1);

  await page.goto(`${baseUrl}/docs/get-started`);
  await page.evaluate(async () => {
    await navigator.clipboard.writeText("clipboard sentinel");
    window.__d11FeedbackTimers = 0;
    const originalSetTimeout = window.setTimeout.bind(window);
    window.setTimeout = (handler, delay, ...arguments_) => {
      if (delay === 2_000) window.__d11FeedbackTimers += 1;
      return originalSetTimeout(handler, delay, ...arguments_);
    };
  });
  let releaseMarkdownResponse;
  const markdownResponseGate = new Promise((resolve) => {
    releaseMarkdownResponse = resolve;
  });
  let markMarkdownRequested;
  const markdownRequested = new Promise((resolve) => {
    markMarkdownRequested = resolve;
  });
  await page.route("**/docs/get-started.md", async (route) => {
    markMarkdownRequested();
    await markdownResponseGate;
    try {
      await route.fulfill({
        body: "# stale copy must not reach the clipboard",
        contentType: "text/plain",
        status: 200,
      });
    } catch {
      // The component aborted its fetch during client navigation.
    }
  });
  await page.getByRole("button", { name: "Copy Markdown", exact: true }).click();
  await markdownRequested;
  await page.locator('a[href="/docs/styling"]').first().click();
  await page.getByRole("heading", { level: 1, name: "Styling", exact: true }).waitFor();
  releaseMarkdownResponse();
  await page.waitForTimeout(100);
  assert.equal(await page.evaluate(() => navigator.clipboard.readText()), "clipboard sentinel");
  assert.equal(await page.evaluate(() => window.__d11FeedbackTimers), 0);
  await page.unroute("**/docs/get-started.md");

  await page.goto(`${baseUrl}/docs/changelog`);
  assert.equal(await page.getByText("Agent migration prompt:", { exact: true }).count(), 9);
  assert.equal(
    await page.locator("pre").filter({ hasText: "Update the local coss Tabs component" }).count(),
    1,
  );
  assert.equal(
    await page.getByRole("heading", { level: 2, name: "Svelte port status", exact: true }).count(),
    1,
  );

  await page.goto(`${baseUrl}/docs/roadmap`);
  await page
    .getByRole("heading", { level: 2, name: "Upstream COSS roadmap", exact: true })
    .waitFor();
  await page.getByRole("heading", { level: 2, name: "Svelte port status", exact: true }).waitFor();

  await page.goto(`${baseUrl}/docs/hooks/use-media-query`);
  const demo = page.locator("[data-testid='media-query-demo']");
  await demo.waitFor();
  await demo.getByRole("heading", { name: "Device & preferences", exact: true }).waitFor();
  assert.equal((await demo.getByText("true", { exact: true }).count()) > 0, true);
  await page.setViewportSize({ height: 844, width: 390 });
  await page.waitForFunction(() => document.documentElement.clientWidth === 390);
  assert.equal((await demo.getByText("false", { exact: true }).count()) > 0, true);
  assert.equal(await page.locator("[data-docs-frame]").count(), 1);

  await page.goto(`${baseUrl}/credits`);
  const creditsArticle = page.locator("article");
  const credit = creditsArticle.getByText("Unofficial Svelte port made by", { exact: false });
  await credit.waitFor();
  assert.equal(
    await creditsArticle.getByRole("link", { name: "Miel", exact: true }).getAttribute("href"),
    "https://github.com/mielsense",
  );
  assert.match(await creditsArticle.innerText(), /not endorsed by COSS/);

  for (const route of [
    "/llms.txt",
    "/llms-full.txt",
    "/docs/get-started.md",
    "/docs/hooks/use-copy-to-clipboard.md",
  ]) {
    const response = await context.request.get(`${baseUrl}${route}`);
    assert.equal(response.status(), 200, `${route} should return 200`);
    assert.match(response.headers()["content-type"], /^text\/plain/);
  }

  const guideMarkdown = await context.request.get(`${baseUrl}/docs/get-started.md`);
  assert.doesNotMatch(await guideMarkdown.text(), /CopyMarkdownButton/);

  const canonicalSkill = await context.request.get(`${baseUrl}/skill.md`);
  const discoveredSkill = await context.request.get(
    `${baseUrl}/.well-known/agent-skills/coss-svelte/SKILL.md`,
  );
  const legacySkill = await context.request.get(
    `${baseUrl}/.well-known/skills/coss-svelte/skill.md`,
  );
  for (const response of [canonicalSkill, discoveredSkill, legacySkill]) {
    assert.equal(response.status(), 200);
    assert.match(response.headers()["content-type"], /^text\/markdown/);
  }
  assert.equal(await discoveredSkill.text(), await canonicalSkill.text());
  assert.equal(await legacySkill.text(), await canonicalSkill.text());

  const agentIndex = await context.request.get(`${baseUrl}/.well-known/agent-skills/index.json`);
  const legacyIndex = await context.request.get(`${baseUrl}/.well-known/skills/index.json`);
  assert.equal(agentIndex.status(), 200);
  assert.equal(legacyIndex.status(), 200);
  assert.match(agentIndex.headers()["content-type"], /^application\/json/);
  assert.match(legacyIndex.headers()["content-type"], /^application\/json/);
  assert.deepEqual((await agentIndex.json()).skills[0], {
    description:
      "Install and compose COSS for Svelte components with the registry, Svelte 5, and Shards UI.",
    name: "coss-svelte",
    type: "skill-md",
    url: "/.well-known/agent-skills/coss-svelte/SKILL.md",
  });
  assert.deepEqual((await legacyIndex.json()).skills[0], {
    description:
      "Install and compose COSS for Svelte components with the registry, Svelte 5, and Shards UI.",
    files: ["skill.md"],
    name: "coss-svelte",
  });

  for (const reference of ["component-catalog.md", "implementation-guide.md"]) {
    const response = await context.request.get(
      `${baseUrl}/.well-known/agent-skills/coss-svelte/references/${reference}`,
    );
    assert.equal(response.status(), 200, `${reference} should return 200`);
    assert.match(response.headers()["content-type"], /^text\/markdown/);
    assert.match(await response.text(), /^# /);
  }

  assert.deepEqual(diagnostics, []);
} finally {
  await context.close();
  await browser.close();
  preview?.kill("SIGTERM");
}

console.log("D11 production guide checks passed");
