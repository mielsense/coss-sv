import { spawnSync } from "node:child_process";
import { cp, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { expect, test } from "vitest";

const require = createRequire(import.meta.url);
const fixtureRoot = fileURLToPath(new URL("./fixtures/package-source", import.meta.url));

test("packages Svelte source together with its generated declaration", async () => {
  const temporaryRoot = await mkdtemp(path.join(tmpdir(), "coss-sv-ui-package-output-"));
  const inputDirectory = path.join(temporaryRoot, "src");
  const outputDirectory = path.join(temporaryRoot, "dist");
  const tsconfigPath = path.join(temporaryRoot, "tsconfig.json");

  try {
    await cp(fixtureRoot, inputDirectory, { recursive: true });
    await writeFile(
      path.join(temporaryRoot, "package.json"),
      `${JSON.stringify({ peerDependencies: { svelte: "^5.56.0" }, type: "module" }, null, 2)}\n`,
    );
    await writeFile(
      tsconfigPath,
      `${JSON.stringify(
        {
          compilerOptions: {
            isolatedModules: true,
            module: "ESNext",
            moduleResolution: "Bundler",
            strict: true,
            target: "ESNext",
            verbatimModuleSyntax: true,
          },
          include: ["src/**/*.svelte"],
        },
        null,
        2,
      )}\n`,
    );

    const packageManifestPath = require.resolve("@sveltejs/package/package.json");
    const packageManifest = JSON.parse(await readFile(packageManifestPath, "utf8")) as {
      bin: { "svelte-package": string };
    };
    const executablePath = path.resolve(
      path.dirname(packageManifestPath),
      packageManifest.bin["svelte-package"],
    );
    const packaged = spawnSync(
      process.execPath,
      [
        executablePath,
        "--input",
        inputDirectory,
        "--output",
        outputDirectory,
        "--tsconfig",
        tsconfigPath,
      ],
      {
        cwd: temporaryRoot,
        encoding: "utf8",
      },
    );

    expect(packaged.status, packaged.stderr || packaged.stdout).toBe(0);

    const [componentSource, componentDeclaration] = await Promise.all([
      readFile(path.join(outputDirectory, "packaged-fixture.svelte"), "utf8"),
      readFile(path.join(outputDirectory, "packaged-fixture.svelte.d.ts"), "utf8"),
    ]);

    expect(componentSource).toContain("$props()");
    expect(componentSource).toContain("<button aria-pressed={active}");
    expect(componentDeclaration).toContain("label: string");
    expect(componentDeclaration).toContain("active?: boolean");
  } finally {
    await rm(temporaryRoot, { force: true, recursive: true });
  }
});
