import { spawn } from "node:child_process";
import { readdir, readFile } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const appRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

type RunOptions = {
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  quiet?: boolean;
};

export async function run(
  command: string,
  arguments_: string[],
  options: RunOptions = {},
): Promise<string> {
  return await new Promise((resolvePromise, reject) => {
    const child = spawn(command, arguments_, {
      cwd: options.cwd ?? appRoot,
      env: options.env ?? process.env,
      stdio: options.quiet ? ["ignore", "pipe", "pipe"] : ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";

    child.stdout?.on("data", (chunk: Buffer) => {
      const text = chunk.toString();
      stdout += text;
      if (!options.quiet) process.stdout.write(text);
    });
    child.stderr?.on("data", (chunk: Buffer) => {
      const text = chunk.toString();
      stderr += text;
      if (!options.quiet) process.stderr.write(text);
    });
    child.once("error", reject);
    child.once("exit", (code, signal) => {
      if (code === 0) {
        resolvePromise(stdout.trim());
        return;
      }
      reject(
        new Error(
          `${command} ${arguments_.join(" ")} failed with ${signal ? `signal ${signal}` : `exit code ${code}`}\n${stdout}\n${stderr}`,
        ),
      );
    });
  });
}

export async function runLocalShadcn(
  arguments_: string[],
  options: RunOptions = {},
): Promise<string> {
  return await run("pnpm", ["--dir", appRoot, "exec", "shadcn-svelte", ...arguments_], options);
}

export async function listFiles(root: string): Promise<string[]> {
  const files: string[] = [];

  async function visit(directory: string): Promise<void> {
    const entries = await readdir(directory, { withFileTypes: true });
    for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
      const path = resolve(directory, entry.name);
      if (entry.isDirectory()) await visit(path);
      else if (entry.isFile()) files.push(relative(root, path).replaceAll("\\", "/"));
    }
  }

  await visit(root);
  return files;
}

export function findPrivateSmokeArtifacts(names: readonly string[]): string[] {
  return names.filter((name) => name.startsWith("private-") && name.endsWith(".json"));
}

function sortJson(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortJson);
  if (!value || typeof value !== "object") return value;

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, child]) => [key, sortJson(child)]),
  );
}

export async function normalizedJson(path: string): Promise<string> {
  const value = JSON.parse(await readFile(path, "utf8")) as unknown;
  return `${JSON.stringify(sortJson(value), null, 2)}\n`;
}
