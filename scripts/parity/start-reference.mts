import { type ChildProcess, spawn } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  assertEffectivePackageManagerPath,
  assertIsolatedChildEnvironment,
  createIsolatedChildEnvironment,
  createReferenceWorkspaceCompatibilityLinks,
  parentProcessExists,
  referenceServerArguments,
} from "./reference-environment.mts";
import {
  convertReferencePackageToPinnedPnpmWorkspace,
  parsePinnedBunLock,
} from "./reference-lock.mts";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(scriptDirectory, "../..");

function findReferenceRoot() {
  // biome-ignore lint/suspicious/noUndeclaredEnvVars: CI may keep the immutable reference elsewhere.
  const configured = process.env.COSS_REFERENCE_ROOT?.trim();
  const candidates = [configured, join(repositoryRoot, "reference")].filter(
    (candidate): candidate is string => Boolean(candidate),
  );
  const dotGit = join(repositoryRoot, ".git");
  if (existsSync(dotGit) && statSync(dotGit).isFile()) {
    const match = /^gitdir:\s*(.+)$/m.exec(readFileSync(dotGit, "utf8"));
    if (match?.[1]) {
      const gitDirectory = resolve(repositoryRoot, match[1].trim());
      const commonDirectoryPath = join(gitDirectory, "commondir");
      if (existsSync(commonDirectoryPath)) {
        const commonGitDirectory = resolve(
          gitDirectory,
          readFileSync(commonDirectoryPath, "utf8").trim(),
        );
        candidates.push(join(dirname(commonGitDirectory), "reference"));
      }
    }
  }

  const found = candidates.find(
    (candidate) =>
      existsSync(join(candidate, "package.json")) && existsSync(join(candidate, "bun.lock")),
  );
  if (!found) {
    throw new Error(
      "Pinned reference package.json and bun.lock are required. Set COSS_REFERENCE_ROOT if needed.",
    );
  }
  return resolve(found);
}

const sourceRoot = findReferenceRoot();
const sourcePackagePath = join(sourceRoot, "package.json");
const sourceLockPath = join(sourceRoot, "bun.lock");

const sourcePackageBefore = readFileSync(sourcePackagePath);
const sourceLockBefore = readFileSync(sourceLockPath);
const pinnedBunLock = parsePinnedBunLock(sourceLockBefore.toString("utf8"));
const temporaryParent = mkdtempSync(join(tmpdir(), "coss-sv-reference-"));
const temporaryReference = join(temporaryParent, "reference");
const childEnvironment = createIsolatedChildEnvironment(temporaryParent);
let activeChild: ChildProcess | undefined;
let interruptedSignal: NodeJS.Signals | undefined;
let temporaryParentRemoved = false;
const launcherParentPid = process.ppid;

function assertSourceUnchanged() {
  if (!sourcePackageBefore.equals(readFileSync(sourcePackagePath))) {
    throw new Error("Reference package.json changed while the temporary server ran.");
  }
  if (!sourceLockBefore.equals(readFileSync(sourceLockPath))) {
    throw new Error("Reference bun.lock changed while the temporary server ran.");
  }
}

function runPnpm(arguments_: string[], captureOutput = false) {
  return new Promise<string>((resolvePromise, reject) => {
    const child = spawn("pnpm", arguments_, {
      cwd: temporaryReference,
      detached: process.platform !== "win32",
      env: childEnvironment,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let output = "";
    let diagnosticOutput = "";
    child.stdout?.on("data", (chunk) => {
      const text = String(chunk);
      output += text;
      diagnosticOutput += text;
      if (!captureOutput) process.stdout.write(text);
    });
    child.stderr?.on("data", (chunk) => {
      const text = String(chunk);
      diagnosticOutput += text;
      process.stderr.write(text);
    });
    activeChild = child;
    child.once("error", (error) => {
      activeChild = undefined;
      reject(error);
    });
    child.once("exit", (code, signal) => {
      activeChild = undefined;
      if (code === 0) resolvePromise(output.trim());
      else {
        const tail = diagnosticOutput.trim().slice(-4_000);
        reject(
          new Error(
            `pnpm ${arguments_.join(" ")} exited with ${code ?? signal}.${tail ? `\n${tail}` : ""}`,
          ),
        );
      }
    });
  });
}

function runReferenceServer() {
  return new Promise<void>((resolvePromise, reject) => {
    activeChild = spawn("pnpm", referenceServerArguments(), {
      cwd: temporaryReference,
      detached: process.platform !== "win32",
      env: childEnvironment,
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
        interruptedSignal !== undefined ||
        signal === "SIGTERM" ||
        signal === "SIGINT"
      ) {
        resolvePromise();
      } else reject(new Error(`Reference server exited with ${code ?? signal}.`));
    });
  });
}

function stopReference(signal: NodeJS.Signals) {
  interruptedSignal = signal;
  if (activeChild?.pid && process.platform !== "win32") {
    try {
      process.kill(-activeChild.pid, signal);
    } catch {
      activeChild.kill(signal);
    }
  } else {
    activeChild?.kill(signal);
  }
}

process.once("SIGINT", () => stopReference("SIGINT"));
process.once("SIGTERM", () => stopReference("SIGTERM"));
const parentWatch = setInterval(() => {
  if (parentProcessExists(launcherParentPid)) return;
  const hadActiveChild = activeChild !== undefined;
  stopReference("SIGTERM");
  if (!hadActiveChild) process.exit(143);
}, 1_000);
parentWatch.unref();

function cleanupTemporaryParent() {
  if (temporaryParentRemoved) return;
  if (!temporaryParent.startsWith(`${tmpdir()}/coss-sv-reference-`)) {
    throw new Error(`Refusing to clean unexpected temporary path ${temporaryParent}.`);
  }
  rmSync(temporaryParent, { recursive: true, force: true, maxRetries: 10, retryDelay: 100 });
  if (existsSync(temporaryParent)) {
    throw new Error(`Temporary reference directory was not removed: ${temporaryParent}`);
  }
  temporaryParentRemoved = true;
}

process.once("exit", cleanupTemporaryParent);

let failure: unknown;

try {
  assertIsolatedChildEnvironment(temporaryParent, childEnvironment);
  cpSync(sourceRoot, temporaryReference, {
    recursive: true,
    filter(source) {
      const name = source.slice(sourceRoot.length + 1).split("/")[0];
      return name !== ".git" && name !== "node_modules" && name !== ".next" && name !== ".turbo";
    },
  });

  const temporaryPackagePath = join(temporaryReference, "package.json");
  const convertedReference = convertReferencePackageToPinnedPnpmWorkspace(
    JSON.parse(readFileSync(temporaryPackagePath, "utf8")) as Record<string, unknown>,
    pinnedBunLock,
  );
  const temporaryPackage = convertedReference.packageJson;
  temporaryPackage.packageManager = "pnpm@10.22.0";
  temporaryPackage.engines = { node: ">=22.18 <25" };
  writeFileSync(temporaryPackagePath, `${JSON.stringify(temporaryPackage, null, 2)}\n`);
  writeFileSync(
    join(temporaryReference, "pnpm-workspace.yaml"),
    `${JSON.stringify(convertedReference.workspace, null, 2)}\n`,
  );

  const effectiveStorePath = await runPnpm(["store", "path"], true);
  assertEffectivePackageManagerPath(temporaryParent, effectiveStorePath, "pnpm store path");
  console.log(`Temporary pnpm store: ${effectiveStorePath}`);
  console.log(
    `Converted ${Object.keys(convertedReference.workspace.overrides).length} pinned Bun resolutions to exact pnpm overrides.`,
  );
  await runPnpm(["install", "--lockfile-only"]);
  const generatedPnpmLockPath = join(temporaryReference, "pnpm-lock.yaml");
  if (!existsSync(generatedPnpmLockPath)) {
    throw new Error("pnpm did not write the converted temporary lockfile.");
  }
  const generatedPnpmLock = readFileSync(generatedPnpmLockPath);
  await runPnpm(["--filter", "ui...", "install", "--frozen-lockfile"]);
  if (!generatedPnpmLock.equals(readFileSync(generatedPnpmLockPath))) {
    throw new Error("Frozen reference install changed the converted pnpm lockfile.");
  }
  createReferenceWorkspaceCompatibilityLinks(temporaryReference);
  assertSourceUnchanged();
  await runReferenceServer();
} catch (error) {
  failure = error;
}

cleanupTemporaryParent();
assertSourceUnchanged();

if (failure) {
  throw failure;
}
