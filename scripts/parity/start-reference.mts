import { type ChildProcess, spawn } from "node:child_process";
import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(scriptDirectory, "../..");
// biome-ignore lint/suspicious/noUndeclaredEnvVars: the read-only pinned reference can be supplied by CI.
const sourceRoot = resolve(process.env.COSS_REFERENCE_ROOT ?? join(repositoryRoot, "reference"));
const sourcePackagePath = join(sourceRoot, "package.json");
const sourceLockPath = join(sourceRoot, "bun.lock");

if (!existsSync(sourcePackagePath) || !existsSync(sourceLockPath)) {
  throw new Error(
    "Pinned reference package.json and bun.lock are required. Set COSS_REFERENCE_ROOT if needed.",
  );
}

const sourcePackageBefore = readFileSync(sourcePackagePath);
const sourceLockBefore = readFileSync(sourceLockPath);
const temporaryParent = mkdtempSync(join(tmpdir(), "coss-sv-reference-"));
const temporaryReference = join(temporaryParent, "reference");
let activeChild: ChildProcess | undefined;

function assertSourceUnchanged() {
  if (!sourcePackageBefore.equals(readFileSync(sourcePackagePath))) {
    throw new Error("Reference package.json changed while the temporary server ran.");
  }
  if (!sourceLockBefore.equals(readFileSync(sourceLockPath))) {
    throw new Error("Reference bun.lock changed while the temporary server ran.");
  }
}

function runPnpm(arguments_: string[]) {
  return new Promise<void>((resolvePromise, reject) => {
    const child = spawn("pnpm", arguments_, {
      cwd: temporaryReference,
      env: { ...process.env, HUSKY: "0" },
      stdio: "inherit",
    });
    activeChild = child;
    child.once("error", (error) => {
      activeChild = undefined;
      reject(error);
    });
    child.once("exit", (code, signal) => {
      activeChild = undefined;
      if (code === 0) resolvePromise();
      else reject(new Error(`pnpm ${arguments_.join(" ")} exited with ${code ?? signal}.`));
    });
  });
}

function runReferenceServer() {
  return new Promise<void>((resolvePromise, reject) => {
    activeChild = spawn("pnpm", ["--filter", "ui", "dev"], {
      cwd: temporaryReference,
      env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
      stdio: "inherit",
    });
    activeChild.once("error", (error) => {
      activeChild = undefined;
      reject(error);
    });
    activeChild.once("exit", (code, signal) => {
      activeChild = undefined;
      if (
        code === 0 ||
        code === 130 ||
        code === 143 ||
        signal === "SIGTERM" ||
        signal === "SIGINT"
      ) {
        resolvePromise();
      } else reject(new Error(`Reference server exited with ${code ?? signal}.`));
    });
  });
}

function stopReference(signal: NodeJS.Signals) {
  activeChild?.kill(signal);
}

process.once("SIGINT", () => stopReference("SIGINT"));
process.once("SIGTERM", () => stopReference("SIGTERM"));

let failure: unknown;

try {
  cpSync(sourceRoot, temporaryReference, {
    recursive: true,
    filter(source) {
      const name = source.slice(sourceRoot.length + 1).split("/")[0];
      return name !== ".git" && name !== "node_modules" && name !== ".next" && name !== ".turbo";
    },
  });

  const temporaryPackagePath = join(temporaryReference, "package.json");
  const temporaryPackage = JSON.parse(readFileSync(temporaryPackagePath, "utf8")) as Record<
    string,
    unknown
  >;
  temporaryPackage.packageManager = "pnpm@10.22.0";
  temporaryPackage.engines = { node: ">=22.18 <25" };
  writeFileSync(temporaryPackagePath, `${JSON.stringify(temporaryPackage, null, 2)}\n`);
  writeFileSync(
    join(temporaryReference, "pnpm-workspace.yaml"),
    "packages:\n  - apps/*\n  - apps/examples/*\n  - packages/*\n",
  );

  await runPnpm(["--filter", "ui...", "install", "--lockfile=false"]);
  assertSourceUnchanged();
  await runReferenceServer();
} catch (error) {
  failure = error;
}

if (!temporaryParent.startsWith(`${tmpdir()}/coss-sv-reference-`)) {
  throw new Error(`Refusing to clean unexpected temporary path ${temporaryParent}.`);
}
rmSync(temporaryParent, { recursive: true, force: true });
assertSourceUnchanged();

if (failure) {
  throw failure;
}
