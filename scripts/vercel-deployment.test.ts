import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";

type TurboConfig = {
  tasks: {
    build: {
      outputs: string[];
    };
  };
};

test("restores the SvelteKit build output from the Turbo cache", async () => {
  const repositoryRoot = resolve(import.meta.dirname, "..");
  const config = JSON.parse(
    await readFile(resolve(repositoryRoot, "turbo.json"), "utf8"),
  ) as TurboConfig;

  assert.ok(config.tasks.build.outputs.includes(".vercel/**"));
});
