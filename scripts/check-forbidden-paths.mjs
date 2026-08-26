import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";

export const forbiddenRoots = [
  "reference",
  "shardsui",
  ".worktrees",
  "artifacts",
  "playwright-report",
  "test-results",
];

export function findForbiddenPaths(paths) {
  return paths.filter((path) => {
    const normalized = path.replaceAll("\\", "/").replace(/^\.\//, "");
    return forbiddenRoots.some((root) => normalized === root || normalized.startsWith(`${root}/`));
  });
}

export function listTrackedPaths() {
  const output = execFileSync("git", ["ls-files", "-z"], { encoding: "utf8" });
  return output.split("\0").filter(Boolean);
}

export function checkForbiddenPaths(paths = listTrackedPaths()) {
  const forbidden = findForbiddenPaths(paths);

  if (forbidden.length > 0) {
    throw new Error(`Forbidden tracked paths:\n${forbidden.map((path) => `- ${path}`).join("\n")}`);
  }
}

const isCli = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isCli) {
  try {
    checkForbiddenPaths();
    console.log("No forbidden paths are tracked.");
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}
