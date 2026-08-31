import { spawnSync } from "node:child_process";
import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const packageRoot = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const packDirectory = await mkdtemp(path.join(tmpdir(), "coss-sv-ui-pack-"));
const packed = spawnSync("pnpm", ["pack", "--json", "--pack-destination", packDirectory], {
  cwd: packageRoot,
  encoding: "utf8",
  env: {
    ...process.env,
    npm_config_ignore_scripts: "true",
  },
});

if (packed.status !== 0) {
  process.stderr.write(packed.stderr);
  await rm(packDirectory, { force: true, recursive: true });
  process.exit(packed.status ?? 1);
}

const report = JSON.parse(packed.stdout);
await rm(packDirectory, { force: true, recursive: true });
const details = Array.isArray(report) ? report[0] : report;
const files = details.files.map((file) => file.path ?? file.name).sort();
const forbiddenPatterns = [
  /(?:^|\/)tests?(?:\/|$)/,
  /(?:^|\/)fixtures?(?:\/|$)/,
  /(?:^|\/)reference(?:\/|$)/,
  /(?:^|\/)shardsui(?:\/|$)/,
  /(?:^|\/)\.worktrees(?:\/|$)/,
  /(?:^|\/)src(?:\/|$)/,
  /(?:^|\/)[^/]*\.(?:test|spec)\.[^/]+$/,
  /(?:^|\/)[^/]*fixture[^/]*(?:\/|$)/i,
  /(?:^|\/)__snapshots__(?:\/|$)/,
  /\.snap$/,
  /\.gitkeep$/,
];
const forbidden = files.filter((file) => forbiddenPatterns.some((pattern) => pattern.test(file)));
const declaredRootFiles = new Set([
  "LICENSE",
  "NOTICE.md",
  "THIRD_PARTY_NOTICES.md",
  "package.json",
]);
const undeclared = files.filter(
  (file) => !declaredRootFiles.has(file) && !file.startsWith("dist/"),
);
const componentNames = (
  await readdir(path.join(packageRoot, "src/components/ui"), { withFileTypes: true })
)
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();
const required = [
  "dist/index.d.ts",
  "dist/index.js",
  "dist/lib/utils.d.ts",
  "dist/lib/utils.js",
  "dist/styles/globals.css",
  "package.json",
  "LICENSE",
  "NOTICE.md",
  "THIRD_PARTY_NOTICES.md",
  ...componentNames.flatMap((name) => [
    `dist/components/ui/${name}/index.d.ts`,
    `dist/components/ui/${name}/index.js`,
  ]),
];
const missing = required.filter((file) => !files.includes(file));
const publishedSourceFiles = files.filter((file) => /^dist\/.*\.(?:d\.ts|js|svelte)$/.test(file));
const leakedAliases = [];
for (const file of publishedSourceFiles) {
  const source = await readFile(path.join(packageRoot, file), "utf8");
  if (/from\s*["'](?:@\/|\$lib\/)|import\s*\(\s*["'](?:@\/|\$lib\/)/.test(source)) {
    leakedAliases.push(file);
  }
}

if (
  forbidden.length > 0 ||
  undeclared.length > 0 ||
  missing.length > 0 ||
  leakedAliases.length > 0
) {
  if (forbidden.length > 0) {
    console.error(`Forbidden package files:\n${forbidden.join("\n")}`);
  }
  if (undeclared.length > 0) {
    console.error(`Undeclared package files:\n${undeclared.join("\n")}`);
  }
  if (missing.length > 0) {
    console.error(`Missing package files:\n${missing.join("\n")}`);
  }
  if (leakedAliases.length > 0) {
    console.error(`Published files retain private aliases:\n${leakedAliases.join("\n")}`);
  }
  process.exit(1);
}

console.log(`Package contents validated (${files.length} files).`);
