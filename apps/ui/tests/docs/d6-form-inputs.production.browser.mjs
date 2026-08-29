import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import { createServer } from "node:net";
import { fileURLToPath } from "node:url";

const appDirectory = fileURLToPath(new URL("../..", import.meta.url));
const repositoryRoot = fileURLToPath(new URL("../../../..", import.meta.url));
const viteExecutable = fileURLToPath(
  new URL("../../node_modules/vite/bin/vite.js", import.meta.url),
);
const ownership = JSON.parse(
  await readFile(`${repositoryRoot}/docs/porting/docs-ownership.json`, "utf8"),
).ownership;
const d6Particles = ownership
  .filter(({ implementationLane }) => implementationLane === "D6")
  .map(({ particle }) => particle);
const coldStartParticles = [
  ["p-input-1", "p-group-1", "p-input-group-1", "p-number-field-1", "p-otp-field-1"],
].flat();

assert.equal(d6Particles.length, 124, "the production traversal must cover all 124 D6 particles");
assert.equal(new Set(d6Particles).size, 124, "the D6 production inventory must be unique");

async function availablePort() {
  const probe = createServer();
  const port = await new Promise((resolve, reject) => {
    probe.once("error", reject);
    probe.listen(0, "127.0.0.1", () => {
      const address = probe.address();
      if (!address || typeof address === "string") {
        reject(new Error("could not allocate a D6 production preview port"));
        return;
      }
      resolve(address.port);
    });
  });
  await new Promise((resolve, reject) =>
    probe.close((error) => (error ? reject(error) : resolve())),
  );
  return port;
}

const port = await availablePort();
const baseUrl = `http://127.0.0.1:${port}`;
const preview = spawn(
  process.execPath,
  [viteExecutable, "preview", "--host", "127.0.0.1", "--port", String(port), "--strictPort"],
  { cwd: appDirectory, env: process.env, stdio: "inherit" },
);

async function waitForPreview() {
  for (let attempt = 0; attempt < 120; attempt += 1) {
    try {
      if ((await fetch(`${baseUrl}/preview/_health`)).ok) return;
    } catch {
      // The fresh production server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`D6 production preview did not become ready at ${baseUrl}`);
}

async function openParticle(id) {
  const response = await fetch(`${baseUrl}/preview/${id}?theme=light&width=desktop&timers=real`);
  const html = await response.text();
  assert.equal(response.status, 200, `${id} production preview should return 200`);
  assert.doesNotMatch(
    html,
    /missing_context/i,
    `${id} must not depend on a previously rendered Field`,
  );
  assert.match(html, /data-preview-ready="true"/, `${id} production preview should be ready`);
}

try {
  await Promise.race([
    waitForPreview(),
    new Promise((_, reject) =>
      preview.once("exit", (code, signal) =>
        reject(
          new Error(`D6 production preview exited early (${code ?? "none"}/${signal ?? "none"})`),
        ),
      ),
    ),
  ]);

  for (const id of coldStartParticles) await openParticle(id);
  await openParticle("p-field-1");
  for (const id of d6Particles) {
    if (coldStartParticles.includes(id) || id === "p-field-1") continue;
    await openParticle(id);
  }
} finally {
  preview.kill("SIGTERM");
}

console.log("D6 cold production traversal passed for 124 particles");
