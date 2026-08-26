import { existsSync, readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

const requiredScripts = [
  "build",
  "check",
  "ci",
  "dev",
  "format",
  "format:check",
  "lint",
  "registry:build",
  "registry:check",
  "test",
  "test:e2e",
  "verify",
];

const requiredTurboOutputs = [".svelte-kit/**", "build/**", "dist/**"];

export function validateWorkspace(root = process.cwd()) {
  const issues = [];
  const packagePath = `${root}/package.json`;
  const workspacePath = `${root}/pnpm-workspace.yaml`;
  const turboPath = `${root}/turbo.json`;

  if (!existsSync(packagePath)) {
    return ["package.json is missing"];
  }

  const packageJson = JSON.parse(readFileSync(packagePath, "utf8"));

  if (packageJson.packageManager !== "pnpm@10.22.0") {
    issues.push('packageManager must be exactly "pnpm@10.22.0"');
  }

  if (packageJson.engines?.node !== ">=22.18 <25") {
    issues.push('engines.node must be exactly ">=22.18 <25"');
  }

  for (const script of requiredScripts) {
    if (typeof packageJson.scripts?.[script] !== "string") {
      issues.push(`missing root script: ${script}`);
    }
  }

  if (!existsSync(workspacePath)) {
    issues.push("pnpm-workspace.yaml is missing");
  } else {
    const workspace = readFileSync(workspacePath, "utf8");
    const globs = [...workspace.matchAll(/^ {2}- (.+)$/gm)].map((match) => match[1]);
    const packageSection = globs.slice(0, 2);

    if (packageSection.join("\n") !== "apps/*\npackages/*") {
      issues.push("workspace package globs must be exactly apps/* and packages/*");
    }
  }

  if (!existsSync(turboPath)) {
    issues.push("turbo.json is missing");
  } else {
    const turbo = JSON.parse(readFileSync(turboPath, "utf8"));
    const outputs = turbo.tasks?.build?.outputs ?? [];

    for (const output of requiredTurboOutputs) {
      if (!outputs.includes(output)) {
        issues.push(`turbo build output is missing: ${output}`);
      }
    }
  }

  for (const lockfile of ["bun.lock", "bun.lockb", "package-lock.json", "npm-shrinkwrap.json"]) {
    if (existsSync(`${root}/${lockfile}`)) {
      issues.push(`unsupported lockfile present: ${lockfile}`);
    }
  }

  return issues;
}

const isCli = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isCli) {
  const issues = validateWorkspace();

  if (issues.length > 0) {
    console.error(issues.map((issue) => `- ${issue}`).join("\n"));
    process.exitCode = 1;
  } else {
    console.log("Workspace configuration is valid.");
  }
}
