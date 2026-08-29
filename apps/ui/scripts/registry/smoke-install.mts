import { access, mkdir, mkdtemp, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";
import { dirname, join, resolve } from "node:path";
import {
  type RegistryDefinition,
  type RegistryItem,
  serializeRegistry,
  validateRegistry,
} from "../../registry/registry.js";
import { buildValidatedRegistry } from "./build.mjs";
import { appRoot, findPrivateSmokeArtifacts, listFiles, run, runLocalShadcn } from "./lib.mjs";

const sourceFiles: Record<string, string> = {
  "registry/private-leaf/private-leaf.svelte": `<script lang="ts">
  import type { Snippet } from "svelte";

  let { children, tone = "quiet" }: { children?: Snippet; tone?: "quiet" | "loud" } = $props();
</script>

<span data-tone={tone}>{@render children?.()}</span>
`,
  "registry/private-compound/private-compound-root.svelte": `<script lang="ts">
  import type { Snippet } from "svelte";

  let { children }: { children?: Snippet } = $props();
</script>

<section data-private-compound="root">{@render children?.()}</section>
`,
  "registry/private-compound/private-compound-panel.svelte": `<script lang="ts">
  import type { Snippet } from "svelte";

  let { children }: { children?: Snippet } = $props();
</script>

<div data-private-compound="panel">{@render children?.()}</div>
`,
  "registry/private-compound/index.ts": `export { default as Root } from "./private-compound-root.svelte";
export { default as Panel } from "./private-compound-panel.svelte";
`,
  "registry/private-overlay/private-overlay.svelte": `<script lang="ts">
  import type { Snippet } from "svelte";

  let { children, open = false }: { children?: Snippet; open?: boolean } = $props();
</script>

{#if open}
  <dialog open aria-label="Private overlay fixture">{@render children?.()}</dialog>
{/if}
`,
  "registry/private-special/use-private-special.svelte.ts": `export class PrivateSpecialState {
  value = $state(0);

  increment(): void {
    this.value += 1;
  }
}
`,
  "registry/private-special/private-special.svelte": `<script lang="ts">
  import { PrivateSpecialState } from "$lib/hooks/use-private-special.svelte.js";

  const state = new PrivateSpecialState();
</script>

<button type="button" onclick={() => state.increment()}>Count: {state.value}</button>
`,
  "registry/private-styled/private-styled.svelte": `<script lang="ts">
  import { clsx } from "clsx";

  let { active = false }: { active?: boolean } = $props();
</script>

<div class={clsx("private-styled", { active })}>Styled fixture</div>
`,
  "registry/private-bundle/private-bundle.svelte": `<p data-private-bundle>Bundle fixture</p>
`,
};

function registryItems(registryRoot: string): RegistryItem[] {
  const source = (path: string) => resolve(registryRoot, path);
  return [
    {
      name: "private-leaf",
      type: "registry:ui",
      description: "Private leaf fixture.",
      registryDependencies: [],
      files: [{ path: source("registry/private-leaf/private-leaf.svelte"), type: "registry:ui" }],
    },
    {
      name: "private-compound",
      type: "registry:ui",
      description: "Private compound fixture.",
      registryDependencies: [],
      files: [
        {
          path: source("registry/private-compound/private-compound-root.svelte"),
          type: "registry:ui",
        },
        {
          path: source("registry/private-compound/private-compound-panel.svelte"),
          type: "registry:ui",
        },
        { path: source("registry/private-compound/index.ts"), type: "registry:ui" },
      ],
    },
    {
      name: "private-overlay",
      type: "registry:ui",
      description: "Private overlay fixture.",
      registryDependencies: [],
      files: [
        { path: source("registry/private-overlay/private-overlay.svelte"), type: "registry:ui" },
      ],
    },
    {
      name: "private-special",
      type: "registry:component",
      description: "Private Svelte state fixture.",
      registryDependencies: [],
      files: [
        {
          path: source("registry/private-special/use-private-special.svelte.ts"),
          type: "registry:hook",
        },
        {
          path: source("registry/private-special/private-special.svelte"),
          type: "registry:component",
        },
      ],
    },
    {
      name: "private-styled",
      type: "registry:ui",
      description: "Private CSS variable and dependency fixture.",
      dependencies: ["clsx@2.1.1"],
      registryDependencies: [],
      cssVars: {
        theme: { "color-private-accent": "var(--private-accent)" },
        light: { "private-accent": "oklch(0.65 0.2 40)" },
        dark: { "private-accent": "oklch(0.72 0.18 40)" },
      },
      files: [
        { path: source("registry/private-styled/private-styled.svelte"), type: "registry:ui" },
      ],
    },
    {
      name: "private-bundle",
      type: "registry:block",
      description: "Private local dependency bundle fixture.",
      dependencies: ["clsx@2.1.1"],
      registryDependencies: [
        "local:private-leaf",
        "local:private-compound",
        "local:private-overlay",
        "local:private-special",
        "local:private-styled",
      ],
      cssVars: {
        theme: { "color-private-accent": "var(--private-accent)" },
        light: { "private-accent": "oklch(0.65 0.2 40)" },
        dark: { "private-accent": "oklch(0.72 0.18 40)" },
      },
      files: [
        {
          path: source("registry/private-bundle/private-bundle.svelte"),
          type: "registry:component",
        },
      ],
    },
  ];
}

async function writePrivateRegistry(registryRoot: string): Promise<RegistryDefinition> {
  await writeFile(
    resolve(registryRoot, "package.json"),
    `${JSON.stringify(
      {
        name: "coss-sv-private-registry-author",
        version: "0.0.0",
        private: true,
        type: "module",
        dependencies: { clsx: "2.1.1", svelte: "5.56.10" },
      },
      null,
      2,
    )}\n`,
    "utf8",
  );

  for (const [path, content] of Object.entries(sourceFiles)) {
    const output = resolve(registryRoot, path);
    await mkdir(dirname(output), { recursive: true });
    await writeFile(output, content, "utf8");
  }

  const registry: RegistryDefinition = {
    $schema: "https://shadcn-svelte.com/schema/registry.json",
    name: "coss-sv-private-smoke",
    homepage: "http://127.0.0.1",
    aliases: {
      lib: "$lib",
      ui: "$lib/components/ui",
      components: "$lib/components",
      utils: "$lib/utils",
      hooks: "$lib/hooks",
    },
    items: registryItems(registryRoot),
  };

  await validateRegistry(registry, {
    allowedSourceRoots: [resolve(registryRoot, "registry")],
  });
  await writeFile(resolve(registryRoot, "registry.json"), serializeRegistry(registry), "utf8");
  return registry;
}

async function writeConsumerFixture(fixtureRoot: string): Promise<void> {
  const files: Record<string, string> = {
    "package.json": `${JSON.stringify(
      {
        name: "coss-sv-registry-smoke",
        version: "0.0.0",
        private: true,
        type: "module",
        packageManager: "pnpm@10.22.0",
        engines: { node: ">=22.18 <25" },
        dependencies: {
          clsx: "2.1.1",
          "tailwind-merge": "3.4.0",
        },
        scripts: {
          check: "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json",
          build: "vite build",
        },
        devDependencies: {
          "@sveltejs/kit": "2.70.3",
          "@sveltejs/vite-plugin-svelte": "7.3.0",
          "@types/node": "24.13.3",
          svelte: "5.56.10",
          "svelte-check": "4.7.6",
          "shadcn-svelte": "1.5.0",
          tailwindcss: "4.3.3",
          typescript: "6.0.3",
          vite: "8.2.2",
        },
      },
      null,
      2,
    )}\n`,
    "vite.config.ts": `import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({ plugins: [sveltekit()] });
`,
    "tsconfig.json": `${JSON.stringify(
      {
        extends: "./.svelte-kit/tsconfig.json",
        compilerOptions: {
          baseUrl: ".",
          ignoreDeprecations: "6.0",
          skipLibCheck: true,
          paths: {
            $lib: ["src/lib"],
            "$lib/*": ["src/lib/*"],
          },
        },
      },
      null,
      2,
    )}\n`,
    "src/app.css": `:root {}
.dark {}
`,
    "src/app.d.ts": `declare global {}

export {};
`,
    "src/app.html": `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    %sveltekit.head%
  </head>
  <body data-sveltekit-preload-data="hover">
    <div style="display: contents">%sveltekit.body%</div>
  </body>
</html>
`,
    "src/lib/utils.ts": `import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
`,
    "src/routes/+layout.svelte": `<script lang="ts">
  import "../app.css";
  import type { Snippet } from "svelte";

  let { children }: { children: Snippet } = $props();
</script>

{@render children()}
`,
    "src/routes/+page.svelte": `<h1>Registry smoke fixture</h1>
`,
  };

  for (const [path, content] of Object.entries(files)) {
    const output = resolve(fixtureRoot, path);
    await mkdir(dirname(output), { recursive: true });
    await writeFile(output, content, "utf8");
  }

  const componentsTemplate = await readFile(
    resolve(appRoot, "tests/registry/fixtures/components.json"),
    "utf8",
  );
  await writeFile(resolve(fixtureRoot, "components.json"), componentsTemplate, "utf8");
}

async function startRegistryServer(
  outputRoot: string,
): Promise<{ server: Server; baseUrl: string }> {
  const server = createServer(async (request, response) => {
    try {
      const requestUrl = new URL(request.url ?? "/", "http://127.0.0.1");
      const relativePath = decodeURIComponent(requestUrl.pathname).replace(/^\/r\//, "");
      if (
        !relativePath.endsWith(".json") ||
        relativePath.includes("..") ||
        relativePath.includes("/")
      ) {
        response.writeHead(404).end("Not found");
        return;
      }

      const body = await readFile(resolve(outputRoot, relativePath));
      response.writeHead(200, {
        "cache-control": "no-store",
        "content-type": "application/json; charset=utf-8",
      });
      response.end(body);
    } catch {
      response.writeHead(404).end("Not found");
    }
  });

  await new Promise<void>((resolvePromise, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => resolvePromise());
  });
  const address = server.address() as AddressInfo;
  return { server, baseUrl: `http://127.0.0.1:${address.port}/r` };
}

async function closeServer(server: Server | undefined): Promise<void> {
  if (!server) return;
  server.closeAllConnections();
  await new Promise<void>((resolvePromise, reject) => {
    server.close((error) => (error ? reject(error) : resolvePromise()));
  });
}

function isolatedEnvironment(temporaryRoot: string): NodeJS.ProcessEnv {
  const childPath = [resolve(dirname(process.execPath)), "/usr/local/bin", "/usr/bin", "/bin"].join(
    ":",
  );

  return {
    ...process.env,
    CI: "1",
    COREPACK_HOME: resolve(temporaryRoot, "corepack"),
    HOME: resolve(temporaryRoot, "home"),
    NPM_CONFIG_CACHE: resolve(temporaryRoot, "npm-cache"),
    NPM_CONFIG_PREFIX: resolve(temporaryRoot, "npm-prefix"),
    NPM_CONFIG_STORE_DIR: resolve(temporaryRoot, "pnpm-store"),
    NPM_CONFIG_USERCONFIG: resolve(temporaryRoot, "npmrc"),
    PATH: childPath,
    PNPM_HOME: resolve(temporaryRoot, "pnpm-home"),
    XDG_CACHE_HOME: resolve(temporaryRoot, "xdg-cache"),
    XDG_CONFIG_HOME: resolve(temporaryRoot, "xdg-config"),
    XDG_DATA_HOME: resolve(temporaryRoot, "xdg-data"),
    USERPROFILE: resolve(temporaryRoot, "user-profile"),
  };
}

async function verifyIsolatedEnvironment(
  environment: NodeJS.ProcessEnv,
  temporaryRoot: string,
): Promise<void> {
  const expectedHome = resolve(temporaryRoot, "home");
  const expectedUserProfile = resolve(temporaryRoot, "user-profile");
  await mkdir(expectedHome, { recursive: true });
  await mkdir(expectedUserProfile, { recursive: true });

  if (environment.HOME !== expectedHome || environment.USERPROFILE !== expectedUserProfile) {
    throw new Error("Smoke environment did not replace inherited home directories.");
  }

  const effective = JSON.parse(
    await run(
      process.execPath,
      [
        "-e",
        "process.stdout.write(JSON.stringify({ HOME: process.env.HOME, USERPROFILE: process.env.USERPROFILE }))",
      ],
      { env: environment, quiet: true },
    ),
  ) as { HOME?: string; USERPROFILE?: string };
  if (effective.HOME !== expectedHome || effective.USERPROFILE !== expectedUserProfile) {
    throw new Error("Child processes did not receive the isolated home directories.");
  }
}

async function assertRemoved(path: string): Promise<void> {
  try {
    await access(path);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return;
    throw error;
  }
  throw new Error(`Smoke cleanup left its temporary root behind: ${path}`);
}

async function verifyInstalledFixture(fixtureRoot: string): Promise<void> {
  const files = await listFiles(resolve(fixtureRoot, "src/lib"));
  const expectedFiles = [
    "components/private-bundle.svelte",
    "components/private-special.svelte",
    "components/ui/private-compound/index.ts",
    "components/ui/private-compound/private-compound-panel.svelte",
    "components/ui/private-compound/private-compound-root.svelte",
    "components/ui/private-leaf.svelte",
    "components/ui/private-overlay.svelte",
    "components/ui/private-styled.svelte",
    "hooks/use-private-special.svelte.ts",
    "utils.ts",
  ];
  if (JSON.stringify(files) !== JSON.stringify(expectedFiles)) {
    throw new Error(`Smoke install wrote unexpected alias destinations: ${files.join(", ")}`);
  }

  const packageJsonText = await readFile(resolve(fixtureRoot, "package.json"), "utf8");
  const packageJson = JSON.parse(packageJsonText) as {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  };
  const appCss = await readFile(resolve(fixtureRoot, "src/app.css"), "utf8");
  if (!packageJson.dependencies?.clsx)
    throw new Error("Smoke install did not record the clsx dependency.");
  if (packageJson.devDependencies?.svelte !== "5.56.10")
    throw new Error("Smoke install changed the fixture's Svelte peer baseline.");
  if (/"react(?:-dom)?"|@base-ui/.test(packageJsonText.toLowerCase()))
    throw new Error("Smoke fixture contains a forbidden dependency.");
  if (
    !appCss.includes("--private-accent") ||
    !appCss.includes("oklch(0.65 0.2 40)") ||
    !appCss.includes("oklch(0.72 0.18 40)")
  ) {
    throw new Error("Smoke install did not merge light and dark private CSS variables.");
  }

  const rootPrefix = `${fixtureRoot}/`;
  const installedPaths = await listFiles(fixtureRoot);
  for (const file of installedPaths) {
    const absolutePath = resolve(fixtureRoot, file);
    if (!absolutePath.startsWith(rootPrefix))
      throw new Error(`Smoke install escaped the fixture root: ${file}`);
  }
}

type ProductionRegistryIndexItem = {
  name: string;
  relativeUrl: string;
  type: string;
};

type ProductionRegistryDocument = {
  dependencies?: string[];
  files?: Array<{ target?: string; type?: string }>;
  name: string;
  registryDependencies?: string[];
  type: string;
};

async function productionRegistryItems(): Promise<ProductionRegistryIndexItem[]> {
  const items = JSON.parse(
    await readFile(resolve(appRoot, "static/r/index.json"), "utf8"),
  ) as ProductionRegistryIndexItem[];
  return items.filter(({ name, type }) => type === "registry:ui" && name !== "ui");
}

async function productionParticleItems(
  names: readonly string[],
): Promise<ProductionRegistryIndexItem[]> {
  const items = JSON.parse(
    await readFile(resolve(appRoot, "static/r/index.json"), "utf8"),
  ) as ProductionRegistryIndexItem[];
  const byName = new Map(items.map((item) => [item.name, item]));

  return names.map((name) => {
    const item = byName.get(name);
    if (!item) throw new Error(`Representative particle ${name} is missing from the registry.`);
    if (item.type !== "registry:block") {
      throw new Error(`Representative particle ${name} has unexpected type ${item.type}.`);
    }
    return item;
  });
}

async function productionRegistryClosure(
  items: readonly ProductionRegistryIndexItem[],
): Promise<ProductionRegistryDocument[]> {
  const pending = items.map(({ relativeUrl }) => relativeUrl);
  const visited = new Set<string>();
  const documents: ProductionRegistryDocument[] = [];

  while (pending.length > 0) {
    const relativeUrl = pending.shift();
    if (!relativeUrl) continue;
    const normalizedUrl = relativeUrl.replace(/^\.\//, "");
    if (visited.has(normalizedUrl)) continue;
    visited.add(normalizedUrl);

    const document = JSON.parse(
      await readFile(resolve(appRoot, "static/r", normalizedUrl), "utf8"),
    ) as ProductionRegistryDocument;
    documents.push(document);
    pending.push(...(document.registryDependencies ?? []));
  }

  return documents;
}

function dependencyName(specifier: string): string {
  if (!specifier.startsWith("@")) return specifier.split("@")[0] ?? specifier;
  const versionSeparator = specifier.indexOf("@", 1);
  return versionSeparator === -1 ? specifier : specifier.slice(0, versionSeparator);
}

function installedFilePath(
  registryItem: ProductionRegistryDocument,
  file: NonNullable<ProductionRegistryDocument["files"]>[number],
): string | undefined {
  if (!file.target) return undefined;
  if (registryItem.type === "registry:lib" || file.type === "registry:lib") {
    return file.target.replace(/^src\/lib\//, "");
  }
  if (registryItem.type === "registry:file" || file.type === "registry:file") {
    return file.target.replace(/^src\/lib\//, "");
  }
  if (registryItem.type === "registry:component" || file.type === "registry:component") {
    return `components/${file.target}`;
  }
  if (registryItem.type === "registry:block" || file.type === "registry:block") {
    return `components/${file.target}`;
  }
  return `components/ui/${file.target}`;
}

async function verifyInstalledProductionRegistry(
  fixtureRoot: string,
  items: ProductionRegistryIndexItem[],
): Promise<void> {
  const installedFiles = await listFiles(resolve(fixtureRoot, "src/lib"));
  const expectedFiles = new Set<string>();
  const registryItems = await productionRegistryClosure(items);
  for (const registryItem of registryItems) {
    for (const file of registryItem.files ?? []) {
      const path = installedFilePath(registryItem, file);
      if (path) expectedFiles.add(path);
    }
  }

  for (const expected of expectedFiles) {
    if (!installedFiles.includes(expected)) {
      throw new Error(
        `Production registry install omitted ${expected}. Installed files: ${installedFiles.join(", ")}`,
      );
    }
  }

  for (const installedFile of installedFiles.filter((file) => /\.(?:svelte|ts)$/.test(file))) {
    const source = await readFile(resolve(fixtureRoot, "src/lib", installedFile), "utf8");
    if (
      /\$(?:COMPONENTS|LIB|UI|UTILS)\$/.test(source) ||
      /(?:^|["'(])(?:reference|shardsui)\//im.test(source)
    ) {
      throw new Error(`Production registry install retained a private path in ${installedFile}.`);
    }
  }

  const packageJsonText = await readFile(resolve(fixtureRoot, "package.json"), "utf8");
  const packageJson = JSON.parse(packageJsonText) as { dependencies?: Record<string, string> };
  for (const dependency of new Set(
    registryItems.flatMap((item) => item.dependencies ?? []).map(dependencyName),
  )) {
    if (!packageJson.dependencies?.[dependency]) {
      throw new Error(`Production registry install did not record ${dependency}.`);
    }
  }
  if (/"react(?:-dom)?"|@base-ui/.test(packageJsonText.toLowerCase())) {
    throw new Error("Production registry install contains a forbidden dependency.");
  }
}

async function runWithConcurrency<T>(
  values: readonly T[],
  concurrency: number,
  task: (value: T) => Promise<void>,
): Promise<void> {
  let nextIndex = 0;
  async function worker(): Promise<void> {
    while (nextIndex < values.length) {
      const value = values[nextIndex];
      nextIndex += 1;
      if (value !== undefined) await task(value);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, values.length) }, () => worker()));
}

async function verifyIndividualProductionItem(options: {
  baseUrl: string;
  environment: NodeJS.ProcessEnv;
  item: ProductionRegistryIndexItem;
  root: string;
  storeRoot: string;
}): Promise<void> {
  const { baseUrl, environment, item, root, storeRoot } = options;
  const fixtureRoot = resolve(root, item.name);
  try {
    await mkdir(fixtureRoot, { recursive: true });
    await writeConsumerFixture(fixtureRoot);
    await run(
      "pnpm",
      ["install", "--ignore-workspace", "--frozen-lockfile=false", "--store-dir", storeRoot],
      { cwd: fixtureRoot, env: environment, quiet: true },
    );
    await runLocalShadcn(
      [
        "add",
        `${baseUrl}/${item.relativeUrl}`,
        "-c",
        fixtureRoot,
        "--yes",
        "--overwrite",
        "--no-deps-install",
      ],
      { env: environment, quiet: true },
    );
    await run(
      "pnpm",
      ["install", "--ignore-workspace", "--frozen-lockfile=false", "--store-dir", storeRoot],
      { cwd: fixtureRoot, env: environment, quiet: true },
    );
    await verifyInstalledProductionRegistry(fixtureRoot, [item]);
    await run("pnpm", ["exec", "svelte-check", "--tsconfig", "./tsconfig.json"], {
      cwd: fixtureRoot,
      env: environment,
      quiet: true,
    });
    await run("pnpm", ["exec", "vite", "build"], {
      cwd: fixtureRoot,
      env: environment,
      quiet: true,
    });
  } catch (error) {
    throw new Error(`Individual registry smoke failed for ${item.name}`, { cause: error });
  }
}

const temporaryRoot = await mkdtemp(join(appRoot, ".registry-smoke-"));
const registryRoot = resolve(temporaryRoot, "registry-author");
const registryOutput = resolve(registryRoot, "static/r");
const fixtureRoot = resolve(temporaryRoot, "consumer");
const productionFixtureRoot = resolve(temporaryRoot, "production-consumer");
const productionBundleFixtureRoot = resolve(temporaryRoot, "production-bundle-consumer");
const productionItemFixturesRoot = resolve(temporaryRoot, "production-item-consumers");
const productionParticleFixtureRoot = resolve(temporaryRoot, "production-particle-consumer");
const storeRoot = resolve(temporaryRoot, "pnpm-store");
const environment = isolatedEnvironment(temporaryRoot);
let server: Server | undefined;

try {
  await mkdir(registryRoot, { recursive: true });
  await mkdir(fixtureRoot, { recursive: true });
  await verifyIsolatedEnvironment(environment, temporaryRoot);
  await writePrivateRegistry(registryRoot);
  await buildValidatedRegistry({
    registryPath: resolve(registryRoot, "registry.json"),
    outputPath: registryOutput,
    projectPath: registryRoot,
    validation: {
      allowedSourceRoots: [resolve(registryRoot, "registry")],
    },
    env: environment,
    quiet: true,
  });

  const bundle = JSON.parse(
    await readFile(resolve(registryOutput, "private-bundle.json"), "utf8"),
  ) as {
    registryDependencies?: string[];
  };
  if (!bundle.registryDependencies?.every((dependency) => dependency.startsWith("./"))) {
    throw new Error("The CLI did not convert local: registry dependencies to relative JSON URLs.");
  }

  await writeConsumerFixture(fixtureRoot);
  await run(
    "pnpm",
    ["install", "--ignore-workspace", "--frozen-lockfile=false", "--store-dir", storeRoot],
    { cwd: fixtureRoot, env: environment, quiet: true },
  );

  const registryServer = await startRegistryServer(registryOutput);
  server = registryServer.server;
  await runLocalShadcn(
    [
      "add",
      `${registryServer.baseUrl}/private-bundle.json`,
      "-c",
      fixtureRoot,
      "--yes",
      "--overwrite",
      "--no-deps-install",
    ],
    { env: environment, quiet: true },
  );

  await run(
    "pnpm",
    ["install", "--ignore-workspace", "--frozen-lockfile=false", "--store-dir", storeRoot],
    { cwd: fixtureRoot, env: environment, quiet: true },
  );
  await verifyInstalledFixture(fixtureRoot);
  await writeFile(
    resolve(fixtureRoot, "tsconfig.json"),
    `${JSON.stringify(
      {
        extends: "./.svelte-kit/tsconfig.json",
        compilerOptions: { skipLibCheck: true },
      },
      null,
      2,
    )}\n`,
    "utf8",
  );
  await run("pnpm", ["exec", "svelte-kit", "sync"], {
    cwd: fixtureRoot,
    env: environment,
    quiet: true,
  });
  await run("pnpm", ["exec", "svelte-check", "--tsconfig", "./tsconfig.json"], {
    cwd: fixtureRoot,
    env: environment,
    quiet: true,
  });
  await run("pnpm", ["exec", "vite", "build"], { cwd: fixtureRoot, env: environment, quiet: true });

  await closeServer(server);
  server = undefined;
  await mkdir(productionFixtureRoot, { recursive: true });
  await writeConsumerFixture(productionFixtureRoot);
  await run(
    "pnpm",
    ["install", "--ignore-workspace", "--frozen-lockfile=false", "--store-dir", storeRoot],
    { cwd: productionFixtureRoot, env: environment, quiet: true },
  );
  const productionItems = await productionRegistryItems();
  const productionRegistryServer = await startRegistryServer(resolve(appRoot, "static/r"));
  server = productionRegistryServer.server;
  await runLocalShadcn(
    [
      "add",
      ...productionItems.map(
        ({ relativeUrl }) => `${productionRegistryServer.baseUrl}/${relativeUrl}`,
      ),
      "-c",
      productionFixtureRoot,
      "--yes",
      "--overwrite",
      "--no-deps-install",
    ],
    { env: environment, quiet: true },
  );
  await run(
    "pnpm",
    ["install", "--ignore-workspace", "--frozen-lockfile=false", "--store-dir", storeRoot],
    { cwd: productionFixtureRoot, env: environment, quiet: true },
  );
  await verifyInstalledProductionRegistry(productionFixtureRoot, productionItems);
  await run("pnpm", ["exec", "svelte-check", "--tsconfig", "./tsconfig.json"], {
    cwd: productionFixtureRoot,
    env: environment,
    quiet: true,
  });
  await run("pnpm", ["exec", "vite", "build"], {
    cwd: productionFixtureRoot,
    env: environment,
    quiet: true,
  });

  await mkdir(productionBundleFixtureRoot, { recursive: true });
  await writeConsumerFixture(productionBundleFixtureRoot);
  await run(
    "pnpm",
    ["install", "--ignore-workspace", "--frozen-lockfile=false", "--store-dir", storeRoot],
    { cwd: productionBundleFixtureRoot, env: environment, quiet: true },
  );
  await runLocalShadcn(
    [
      "add",
      `${productionRegistryServer.baseUrl}/ui.json`,
      "-c",
      productionBundleFixtureRoot,
      "--yes",
      "--overwrite",
      "--no-deps-install",
    ],
    { env: environment, quiet: true },
  );
  await run(
    "pnpm",
    ["install", "--ignore-workspace", "--frozen-lockfile=false", "--store-dir", storeRoot],
    { cwd: productionBundleFixtureRoot, env: environment, quiet: true },
  );
  await verifyInstalledProductionRegistry(productionBundleFixtureRoot, productionItems);
  await run("pnpm", ["exec", "svelte-check", "--tsconfig", "./tsconfig.json"], {
    cwd: productionBundleFixtureRoot,
    env: environment,
    quiet: true,
  });
  await run("pnpm", ["exec", "vite", "build"], {
    cwd: productionBundleFixtureRoot,
    env: environment,
    quiet: true,
  });

  await mkdir(productionItemFixturesRoot, { recursive: true });
  await runWithConcurrency(productionItems, 4, async (item) => {
    await verifyIndividualProductionItem({
      baseUrl: productionRegistryServer.baseUrl,
      environment,
      item,
      root: productionItemFixturesRoot,
      storeRoot,
    });
  });

  const representativeParticles = await productionParticleItems([
    "p-accordion-1",
    "p-button-1",
    "p-date-picker-1",
    "p-dialog-1",
    "p-navigation-1",
    "p-select-1",
    "p-table-3",
  ]);
  await mkdir(productionParticleFixtureRoot, { recursive: true });
  await writeConsumerFixture(productionParticleFixtureRoot);
  await run(
    "pnpm",
    ["install", "--ignore-workspace", "--frozen-lockfile=false", "--store-dir", storeRoot],
    { cwd: productionParticleFixtureRoot, env: environment, quiet: true },
  );
  await runLocalShadcn(
    [
      "add",
      ...representativeParticles.map(
        ({ relativeUrl }) => `${productionRegistryServer.baseUrl}/${relativeUrl}`,
      ),
      "-c",
      productionParticleFixtureRoot,
      "--yes",
      "--overwrite",
      "--no-deps-install",
    ],
    { env: environment, quiet: true },
  );
  await run(
    "pnpm",
    ["install", "--ignore-workspace", "--frozen-lockfile=false", "--store-dir", storeRoot],
    { cwd: productionParticleFixtureRoot, env: environment, quiet: true },
  );
  await verifyInstalledProductionRegistry(productionParticleFixtureRoot, representativeParticles);
  await run("pnpm", ["exec", "svelte-check", "--tsconfig", "./tsconfig.json"], {
    cwd: productionParticleFixtureRoot,
    env: environment,
    quiet: true,
  });
  await run("pnpm", ["exec", "vite", "build"], {
    cwd: productionParticleFixtureRoot,
    env: environment,
    quiet: true,
  });

  const privateSmokeArtifacts = findPrivateSmokeArtifacts(
    await readdir(resolve(appRoot, "static/r")),
  );
  if (privateSmokeArtifacts.length > 0) {
    throw new Error(
      `Private smoke items leaked into production output: ${privateSmokeArtifacts.join(", ")}`,
    );
  }
  console.log(
    `Private bundle, ${productionItems.length} individual UI items, the production batch, the complete UI bundle, and ${representativeParticles.length} representative particles installed, passed svelte-check, and built successfully.`,
  );
} finally {
  await closeServer(server);
  await rm(temporaryRoot, { recursive: true, force: true });
  await assertRemoved(temporaryRoot);
}
