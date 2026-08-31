import {
  access,
  link,
  mkdir,
  mkdtemp,
  readdir,
  readFile,
  rm,
  stat,
  symlink,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, relative, resolve } from "node:path";
import { afterEach, describe, expect, test } from "vitest";
import {
  assertGeneratedFileCurrent,
  type RegistryDefinition,
  type RegistryItem,
  validateRegistry,
} from "../../registry/registry.js";
import { registryUi } from "../../registry/registry-ui.js";
import {
  buildValidatedRegistry,
  prepareSourceForRegistryBuild,
  withStagedRegistry,
} from "../../scripts/registry/build.mjs";
import { appRoot, findPrivateSmokeArtifacts, runLocalShadcn } from "../../scripts/registry/lib.mjs";

const temporaryDirectories: string[] = [];

test("registry smoke permits real production items and still detects private fixtures", () => {
  expect(
    findPrivateSmokeArtifacts([
      "index.json",
      "separator.json",
      "private-bundle.json",
      "private-leaf.json",
    ]),
  ).toEqual(["private-bundle.json", "private-leaf.json"]);
});

test("stages the bare application alias without corrupting scoped packages", () => {
  const prepared = prepareSourceForRegistryBuild(
    [
      'import { Button } from "@/components/ui/button/index.js";',
      'import { cn } from "@/utils.js";',
      'import helper from "@/helper.js";',
      'import { Select } from "@shardsui/svelte/select";',
    ].join("\n"),
    {
      components: "@/components",
      hooks: "@/hooks",
      lib: "@",
      ui: "@/components/ui",
      utils: "@/utils",
    },
  );

  expect(prepared).toContain("__COSS_REGISTRY_UI__/button/index.js");
  expect(prepared).toContain("__COSS_REGISTRY_UTILS__.js");
  expect(prepared).toContain("__COSS_REGISTRY_LIB__/helper.js");
  expect(prepared).toContain('from "@shardsui/svelte/select"');
});

async function makeSource(relativePath = "leaf/leaf.svelte") {
  const root = await mkdtemp(join(appRoot, ".registry-test-"));
  temporaryDirectories.push(root);
  const sourcePath = join(root, relativePath);
  await mkdir(join(sourcePath, ".."), { recursive: true });
  await writeFile(sourcePath, "<p>fixture</p>\n", "utf8");
  return { root, sourcePath };
}

function definition(item: RegistryItem): RegistryDefinition {
  return {
    name: "coss-sv-test",
    homepage: "https://example.test",
    items: [item],
  };
}

function item(sourcePath: string): RegistryItem {
  return {
    name: "leaf",
    type: "registry:ui",
    description: "A private test item.",
    registryDependencies: [],
    files: [{ path: sourcePath, type: "registry:ui" }],
  };
}

async function graphDefinition(
  graph: ReadonlyArray<readonly [name: string, dependencies: readonly string[]]>,
) {
  const root = await mkdtemp(join(appRoot, ".registry-graph-"));
  temporaryDirectories.push(root);
  const items: RegistryItem[] = [];
  for (const [name, registryDependencies] of graph) {
    const sourcePath = join(root, `${name}.svelte`);
    await writeFile(sourcePath, `<p>${name}</p>\n`, "utf8");
    items.push({ ...item(sourcePath), name, registryDependencies: [...registryDependencies] });
  }
  return {
    root,
    registry: { name: "coss-sv-test", homepage: "https://example.test", items },
  } satisfies { root: string; registry: RegistryDefinition };
}

afterEach(async () => {
  await Promise.all(
    temporaryDirectories.splice(0).map((directory) => rm(directory, { recursive: true })),
  );
});

describe("registry validation", () => {
  test("publishes one complete UI bundle over the 54 component items", () => {
    const bundle = registryUi.find(({ name }) => name === "ui");
    const componentNames = registryUi.filter(({ name }) => name !== "ui").map(({ name }) => name);

    expect(componentNames).toHaveLength(54);
    expect(bundle).toEqual(
      expect.objectContaining({
        files: [],
        registryDependencies: componentNames.map((name) => `local:${name}`),
        type: "registry:ui",
      }),
    );
  });

  test("declares every cross-component import in each UI item's local dependency closure", async () => {
    const items = new Map<string, (typeof registryUi)[number]>(
      registryUi.map((item) => [item.name, item]),
    );
    const missing: string[] = [];
    const importPattern = /(?:from\s*|import\s*)["']([^"']+)["']/g;

    for (const item of registryUi.filter(({ name }) => name !== "ui")) {
      const closure = new Set<string>([item.name]);
      const pending: string[] = [item.name];
      while (pending.length > 0) {
        const current = items.get(pending.shift() ?? "");
        for (const dependency of current?.registryDependencies ?? []) {
          const name = dependency.replace(/^local:/, "");
          if (closure.has(name)) continue;
          closure.add(name);
          if (items.has(name)) pending.push(name);
        }
      }

      for (const file of item.files) {
        const sourcePath = resolve(appRoot, file.path);
        const source = await readFile(sourcePath, "utf8");
        for (const match of source.matchAll(importPattern)) {
          const specifier = match[1] ?? "";
          if (specifier === "@/hugeicons-icon.svelte" && !closure.has("hugeicons-icon")) {
            missing.push(`${item.name} -> hugeicons-icon (${file.path})`);
          }
          if (!specifier.startsWith("../")) continue;
          const target = resolve(dirname(sourcePath), specifier);
          const component = target.match(/packages\/ui\/src\/components\/ui\/([^/]+)/)?.[1];
          if (component && component !== item.name && !closure.has(component)) {
            missing.push(`${item.name} -> ${component} (${file.path})`);
          }
        }
      }
    }

    expect(missing).toEqual([]);
  });

  test("ships every same-directory module imported by a UI item", async () => {
    const missing: string[] = [];
    const importPattern = /(?:from\s*|import\s*)["']([^"']+)["']/g;

    for (const item of registryUi.filter(({ name }) => name !== "ui")) {
      const shippedFiles = new Set(item.files.map((file) => resolve(appRoot, file.path)));
      for (const file of item.files) {
        const sourcePath = resolve(appRoot, file.path);
        const source = await readFile(sourcePath, "utf8");
        for (const match of source.matchAll(importPattern)) {
          const specifier = match[1] ?? "";
          if (!specifier.startsWith("./")) continue;
          const importedPath = resolve(dirname(sourcePath), specifier);
          const sourceModule = importedPath.endsWith(".js")
            ? `${importedPath.slice(0, -".js".length)}.ts`
            : importedPath;
          if (!shippedFiles.has(sourceModule)) {
            missing.push(`${item.name}: ${relative(appRoot, sourceModule)}`);
          }
        }
      }
    }

    expect(missing).toEqual([]);
  });

  test.each([
    "../escape",
    "..\\escape",
    "/absolute",
    "C:\\absolute",
    ".",
    "..",
    "dot.name",
    "name/child",
    "name\\child",
    "Uppercase",
  ])("rejects unsafe registry item name %s", async (name) => {
    const { root, sourcePath } = await makeSource();
    const invalid = { ...item(sourcePath), name };

    await expect(
      validateRegistry(definition(invalid), { allowedSourceRoots: [root] }),
    ).rejects.toThrow("safe lowercase slug");
  });

  test("rejects unknown registry types", async () => {
    const { root, sourcePath } = await makeSource();
    const invalid = { ...item(sourcePath), type: "registry:react" } as unknown as RegistryItem;

    await expect(
      validateRegistry(definition(invalid as RegistryItem), { allowedSourceRoots: [root] }),
    ).rejects.toThrow("unsupported registry type");
  });

  test("rejects source paths outside the allowed roots", async () => {
    const allowed = await makeSource("allowed/leaf.svelte");
    const outside = await makeSource("outside/leaf.svelte");

    await expect(
      validateRegistry(definition(item(outside.sourcePath)), {
        allowedSourceRoots: [allowed.root],
      }),
    ).rejects.toThrow("outside the allowed source roots");
  });

  test.each([
    "react",
    "react-dom@19.0.0",
    "@base-ui-components/react@1.0.0",
    "compat@npm:react@19.0.0",
  ])("rejects forbidden dependency %s", async (dependency) => {
    const { root, sourcePath } = await makeSource();
    const invalid = { ...item(sourcePath), dependencies: [dependency] };

    await expect(
      validateRegistry(definition(invalid), { allowedSourceRoots: [root] }),
    ).rejects.toThrow("forbidden dependency");
  });

  test.each([
    ["dependencies", "compat@npm:react@19.0.0"],
    ["dependencies", "compat@npm:@base-ui-components/react@1.0.0"],
    ["devDependencies", "@scope/compat@npm:@base-ui/react@1.0.0"],
    ["overrideDependencies", "compat@npm:@base-ui-components/react@1.0.0"],
    ["overrideDependencies", "npm:react@19.0.0"],
  ] as const)("rejects %s entry %s", async (field, dependency) => {
    const { root, sourcePath } = await makeSource();
    const registry = definition(item(sourcePath));
    if (field === "overrideDependencies") registry.overrideDependencies = [dependency];
    else registry.items[0] = { ...registry.items[0], [field]: [dependency] } as RegistryItem;

    await expect(validateRegistry(registry, { allowedSourceRoots: [root] })).rejects.toThrow(
      "forbidden dependency",
    );
  });

  test.each([
    "react",
    "npm:react@19.0.0",
    "compat@npm:react@19.0.0",
    "compat@npm:@base-ui-components/react@1.0.0",
    "@scope/compat@npm:@base-ui/react@1.0.0",
  ])("rejects forbidden non-local registry dependency %s", async (dependency) => {
    const { root, sourcePath } = await makeSource();
    const invalid = { ...item(sourcePath), registryDependencies: [dependency] };

    await expect(
      validateRegistry(definition(invalid), { allowedSourceRoots: [root] }),
    ).rejects.toThrow("forbidden dependency");
  });

  test("rejects destinations outside configured aliases", async () => {
    const { root, sourcePath } = await makeSource();
    const invalid = item(sourcePath);
    invalid.files = [
      { path: sourcePath, type: "registry:file", target: "../../.github/workflows/pwn.yml" },
    ];

    await expect(
      validateRegistry(definition(invalid), { allowedSourceRoots: [root] }),
    ).rejects.toThrow("outside the configured install roots");
  });

  test("rejects missing local registry dependencies", async () => {
    const { root, sourcePath } = await makeSource();
    const invalid = { ...item(sourcePath), registryDependencies: ["local:missing"] };

    await expect(
      validateRegistry(definition(invalid), { allowedSourceRoots: [root] }),
    ).rejects.toThrow("missing local registry dependency");
  });

  test.each(["../../reference/apps/ui/private.svelte", "../../shardsui/private.svelte"])(
    "rejects local reference source %s",
    async (sourcePath) => {
      const { root } = await makeSource();

      await expect(
        validateRegistry(definition(item(sourcePath)), { allowedSourceRoots: [root] }),
      ).rejects.toThrow("forbidden local reference path");
    },
  );

  test.each([
    'import React from "react";\n',
    'import "react";\n',
    'const React = await import("react");\n',
  ])("rejects forbidden imports found in source content", async (source) => {
    const { root, sourcePath } = await makeSource();
    await writeFile(sourcePath, source, "utf8");

    await expect(
      validateRegistry(definition(item(sourcePath)), { allowedSourceRoots: [root] }),
    ).rejects.toThrow("forbidden source import");
  });

  test("accepts a local dependency that names another item", async () => {
    const first = await makeSource("leaf/leaf.svelte");
    const secondPath = join(first.root, "bundle", "bundle.svelte");
    await mkdir(join(secondPath, ".."), { recursive: true });
    await writeFile(secondPath, "<p>bundle</p>\n", "utf8");

    const registry: RegistryDefinition = {
      name: "coss-sv-test",
      homepage: "https://example.test",
      items: [
        item(first.sourcePath),
        {
          ...item(secondPath),
          name: "bundle",
          registryDependencies: ["local:leaf"],
        },
      ],
    };

    await expect(
      validateRegistry(registry, { allowedSourceRoots: [first.root] }),
    ).resolves.toMatchObject({ manifest: registry });
  });

  test.each([
    [[["alpha", ["local:alpha"]]], "alpha -> alpha"],
    [
      [
        ["alpha", ["local:beta"]],
        ["beta", ["local:alpha"]],
      ],
      "alpha -> beta -> alpha",
    ],
    [
      [
        ["alpha", ["local:beta"]],
        ["beta", ["local:gamma"]],
        ["gamma", ["local:delta"]],
        ["delta", ["local:beta"]],
      ],
      "beta -> gamma -> delta -> beta",
    ],
  ] as const)("rejects local registry dependency cycle %s", async (graph, chain) => {
    const { root, registry } = await graphDefinition(graph);

    await expect(validateRegistry(registry, { allowedSourceRoots: [root] })).rejects.toThrow(
      `Local registry dependency cycle: ${chain}`,
    );
  });

  test("accepts an acyclic local registry dependency graph with shared nodes", async () => {
    const { root, registry } = await graphDefinition([
      ["alpha", []],
      ["beta", ["local:alpha"]],
      ["gamma", ["local:alpha"]],
      ["delta", ["local:beta", "local:gamma"]],
    ]);

    await expect(validateRegistry(registry, { allowedSourceRoots: [root] })).resolves.toMatchObject(
      { manifest: registry },
    );
  });

  test("rejects a source file that is a symbolic link", async () => {
    const { root, sourcePath } = await makeSource();
    const linkedPath = join(root, "linked.svelte");
    await writeFile(linkedPath, "<p>linked</p>\n", "utf8");
    await rm(sourcePath);
    await symlink(linkedPath, sourcePath);

    await expect(
      validateRegistry(definition(item(sourcePath)), { allowedSourceRoots: [root] }),
    ).rejects.toThrow("must not be a symbolic link");
  });

  test("rejects an ordinary source file with multiple hard links", async () => {
    const { root, sourcePath } = await makeSource();
    await link(sourcePath, join(root, "second-link.svelte"));

    await expect(
      validateRegistry(definition(item(sourcePath)), { allowedSourceRoots: [root] }),
    ).rejects.toThrow("must have exactly one hard link");
  });

  test("rejects caller-provided allowed-root symlinks to forbidden or external trees", async () => {
    const fixtureRoot = await mkdtemp(join(appRoot, ".registry-root-link-"));
    const outsideRoot = await mkdtemp(join(tmpdir(), "coss-sv-outside-root-"));
    temporaryDirectories.push(fixtureRoot, outsideRoot);
    const targets = [
      ["reference", resolve(appRoot, "../../../..", "reference")],
      ["shardsui", resolve(appRoot, "../../../..", "shardsui")],
      ["other-worktree", resolve(appRoot, "../../..", "f5-harness")],
      ["outside", outsideRoot],
    ] as const;
    const registry: RegistryDefinition = {
      name: "coss-sv-test",
      homepage: "https://example.test",
      items: [],
    };

    for (const [name, target] of targets) {
      const allowedRoot = join(fixtureRoot, name);
      await symlink(target, allowedRoot);
      await expect(
        validateRegistry(registry, { allowedSourceRoots: [allowedRoot] }),
      ).rejects.toThrow("real non-symlink directory");
    }
  });

  test("rejects a real allowed root outside the current project trust root", async () => {
    const outsideRoot = await mkdtemp(join(tmpdir(), "coss-sv-outside-root-"));
    temporaryDirectories.push(outsideRoot);
    const registry: RegistryDefinition = {
      name: "coss-sv-test",
      homepage: "https://example.test",
      items: [],
    };

    await expect(validateRegistry(registry, { allowedSourceRoots: [outsideRoot] })).rejects.toThrow(
      "outside the current project trust root",
    );
  });

  test.each(["reference", "shardsui", ".worktrees"])(
    "rejects a canonical allowed root entering %s",
    async (forbiddenSegment) => {
      const fixtureRoot = await mkdtemp(join(appRoot, ".registry-forbidden-root-"));
      temporaryDirectories.push(fixtureRoot);
      const allowedRoot = join(fixtureRoot, forbiddenSegment, "source");
      await mkdir(allowedRoot, { recursive: true });
      const registry: RegistryDefinition = {
        name: "coss-sv-test",
        homepage: "https://example.test",
        items: [],
      };

      await expect(
        validateRegistry(registry, { allowedSourceRoots: [allowedRoot] }),
      ).rejects.toThrow("outside the current project trust boundary");
    },
  );

  test("accepts the production source roots derived from the current worktree", async () => {
    const registry: RegistryDefinition = {
      name: "coss-sv-test",
      homepage: "https://example.test",
      items: [],
    };

    await expect(validateRegistry(registry)).resolves.toMatchObject({ manifest: registry });
  });
});

test("captured source mutation cannot alter staged CLI output", async () => {
  const { root, sourcePath } = await makeSource("registry/captured-item.svelte");
  const outputPath = join(root, "output");
  const registry = definition({ ...item(sourcePath), name: "captured-item" });
  const validated = await validateRegistry(registry, {
    allowedSourceRoots: [root],
  });
  await writeFile(sourcePath, "<p>mutated after validation</p>\n", "utf8");

  await withStagedRegistry(validated, root, async (staged) => {
    await runLocalShadcn(["registry", "build", staged.registryPath, "-o", outputPath], {
      quiet: true,
    });
  });

  const output = await readFile(join(outputPath, "captured-item.json"), "utf8");
  expect(output).toContain("<p>fixture</p>");
  expect(output).not.toContain("mutated after validation");
});

test("source symlink swap after validation cannot alter staged CLI output", async () => {
  const { root, sourcePath } = await makeSource("registry/captured-link.svelte");
  const outputPath = join(root, "output");
  const replacementPath = join(root, "replacement.svelte");
  const registry = definition({ ...item(sourcePath), name: "captured-link" });
  const validated = await validateRegistry(registry, {
    allowedSourceRoots: [root],
  });
  await writeFile(replacementPath, "<p>symlink replacement</p>\n", "utf8");
  await rm(sourcePath);
  await symlink(replacementPath, sourcePath);

  await withStagedRegistry(validated, root, async (staged) => {
    await runLocalShadcn(["registry", "build", staged.registryPath, "-o", outputPath], {
      quiet: true,
    });
  });

  const output = await readFile(join(outputPath, "captured-link.json"), "utf8");
  expect(output).toContain("<p>fixture</p>");
  expect(output).not.toContain("symlink replacement");
});

test("staged registry uses private read-only files and cleans up on success and failure", async () => {
  const { root, sourcePath } = await makeSource("registry/private-item.svelte");
  const validated = await validateRegistry(definition(item(sourcePath)), {
    allowedSourceRoots: [root],
  });
  let successfulRoot = "";
  await withStagedRegistry(validated, root, async (staged) => {
    successfulRoot = staged.root;
    expect((await stat(staged.root)).mode & 0o777).toBe(0o700);
    expect((await stat(staged.registryPath)).mode & 0o777).toBe(0o400);
    expect(staged.sourcePaths).toHaveLength(1);
    const stagedSource = staged.sourcePaths[0] ?? "";
    const stagedSourceStat = await stat(stagedSource);
    expect(stagedSourceStat.isFile()).toBe(true);
    expect(stagedSourceStat.mode & 0o777).toBe(0o400);
    const stagedManifest = JSON.parse(
      await readFile(staged.registryPath, "utf8"),
    ) as RegistryDefinition;
    expect(stagedManifest.items[0]?.files[0]?.path).toBe(stagedSource);
  });
  await expect(access(successfulRoot)).rejects.toMatchObject({ code: "ENOENT" });

  let failedRoot = "";
  await expect(
    withStagedRegistry(validated, root, async (staged) => {
      failedRoot = staged.root;
      throw new Error("intentional staging callback failure");
    }),
  ).rejects.toThrow("intentional staging callback failure");
  await expect(access(failedRoot)).rejects.toMatchObject({ code: "ENOENT" });
});

test("validated CLI build reads its registry file and blocks escaping names", async () => {
  const { root, sourcePath } = await makeSource("registry/safe-item.svelte");
  const registryPath = join(root, "registry.json");
  const outputPath = join(root, "output");
  const safeRegistry = definition({ ...item(sourcePath), name: "safe-item" });
  await writeFile(
    join(root, "package.json"),
    `${JSON.stringify({ name: "registry-containment-test", private: true, dependencies: { svelte: "5.56.10" } })}\n`,
    "utf8",
  );
  await writeFile(registryPath, `${JSON.stringify(safeRegistry, null, 2)}\n`, "utf8");

  await buildValidatedRegistry({
    registryPath,
    outputPath,
    validation: { allowedSourceRoots: [root] },
    quiet: true,
  });
  await expect(access(join(outputPath, "safe-item.json"))).resolves.toBeUndefined();
  await expect(access(join(outputPath, "index.json"))).resolves.toBeUndefined();
  await expect(readdir(root)).resolves.not.toContainEqual(
    expect.stringMatching(/^\.registry-build-/),
  );

  const escapingRegistry = definition({ ...item(sourcePath), name: "../escaped" });
  await writeFile(registryPath, `${JSON.stringify(escapingRegistry, null, 2)}\n`, "utf8");
  await expect(
    buildValidatedRegistry({
      registryPath,
      outputPath,
      validation: { allowedSourceRoots: [root] },
      quiet: true,
    }),
  ).rejects.toThrow("safe lowercase slug");
  await expect(access(join(root, "escaped.json"))).rejects.toMatchObject({ code: "ENOENT" });
});

test("freshness check reports stale generated JSON", async () => {
  const directory = await mkdtemp(join(tmpdir(), "coss-sv-registry-freshness-"));
  temporaryDirectories.push(directory);
  const output = join(directory, "registry.json");
  await writeFile(output, '{"items":[{"name":"stale"}]}\n', "utf8");

  await expect(assertGeneratedFileCurrent(output, '{"items":[]}\n')).rejects.toThrow(
    "stale generated registry file",
  );
});
