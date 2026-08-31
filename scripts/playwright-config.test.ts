import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import config from "../playwright.config.ts";

test("the parity harness bounds browser workers and the target server heap", () => {
  assert.equal(config.fullyParallel, false);
  assert.equal(config.workers, 2);

  const servers = Array.isArray(config.webServer) ? config.webServer : [config.webServer];
  assert.equal(servers.length, 1);
  assert.match(servers[0]?.env?.NODE_OPTIONS ?? "", /(?:^|\s)--max-old-space-size=768(?:\s|$)/);
});

test("the package test projects run one file in one worker at a time", () => {
  const source = readFileSync(new URL("../packages/ui/vite.config.ts", import.meta.url), "utf8");

  assert.equal(source.match(/fileParallelism:\s*false/g)?.length, 2);
  assert.equal(source.match(/maxWorkers:\s*1/g)?.length, 2);
});
