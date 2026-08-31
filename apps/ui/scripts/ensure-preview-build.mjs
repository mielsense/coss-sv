import { existsSync, readdirSync, rmSync, statSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = resolve(appRoot, ".svelte-kit/output/server/manifest.js");
const buildInputs = [
  "content",
  "registry",
  "scripts",
  "src",
  "static",
  "mdsvex.config.js",
  "package.json",
  "svelte.config.js",
  "vite.config.ts",
  "../../package.json",
  "../../packages/ui/src",
  "../../pnpm-lock.yaml",
].map((path) => resolve(appRoot, path));

function newestModification(path) {
  if (!existsSync(path)) return 0;
  const entry = statSync(path);
  if (!entry.isDirectory()) return entry.mtimeMs;
  return readdirSync(path).reduce(
    (newest, child) => Math.max(newest, newestModification(resolve(path, child))),
    entry.mtimeMs,
  );
}

const buildIsMissing = !existsSync(manifest);
const buildIsStale =
  !buildIsMissing &&
  buildInputs.some((path) => newestModification(path) > statSync(manifest).mtimeMs);

if (buildIsMissing || buildIsStale) {
  rmSync(resolve(appRoot, ".vercel/output"), { force: true, recursive: true });
  const build = spawnSync("pnpm", ["build"], {
    cwd: appRoot,
    encoding: "utf8",
    stdio: "inherit",
  });
  if (build.status !== 0) process.exit(build.status ?? 1);
}
