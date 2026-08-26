import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, test } from "vitest";
import {
  assertGeneratedFileCurrent,
  type RegistryDefinition,
  type RegistryItem,
  validateRegistry,
} from "../../registry/registry.js";

const temporaryDirectories: string[] = [];

async function makeSource(relativePath = "leaf/leaf.svelte") {
  const root = await mkdtemp(join(tmpdir(), "coss-sv-registry-test-"));
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

afterEach(async () => {
  await Promise.all(
    temporaryDirectories.splice(0).map((directory) => rm(directory, { recursive: true })),
  );
});

describe("registry validation", () => {
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
    ).resolves.toBeUndefined();
  });
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
