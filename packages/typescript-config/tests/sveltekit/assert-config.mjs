import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const fixtureDirectory = new URL("./", import.meta.url);
const generatedConfigUrl = new URL(".svelte-kit/tsconfig.json", fixtureDirectory);
const fixtureConfigUrl = new URL("tsconfig.json", fixtureDirectory);

const generatedConfig = JSON.parse(readFileSync(generatedConfigUrl, "utf8"));
const effectiveConfig = JSON.parse(
  execFileSync("tsc", ["--showConfig", "--project", fixtureConfigUrl.pathname], {
    encoding: "utf8",
  }),
);

const normalize = (value) => {
  if (Array.isArray(value)) {
    return value.map(normalize);
  }

  return typeof value === "string" ? value.toLowerCase() : value;
};

for (const option of ["target", "lib", "module", "moduleResolution"]) {
  const generatedValue = normalize(generatedConfig.compilerOptions[option]);
  const effectiveValue = normalize(effectiveConfig.compilerOptions[option]);

  if (JSON.stringify(effectiveValue) !== JSON.stringify(generatedValue)) {
    throw new Error(
      `Effective ${option} must preserve the generated SvelteKit setting. Expected ${JSON.stringify(generatedValue)}, received ${JSON.stringify(effectiveValue)}.`,
    );
  }
}

for (const option of ["strict", "exactOptionalPropertyTypes", "noUncheckedIndexedAccess"]) {
  if (effectiveConfig.compilerOptions[option] !== true) {
    throw new Error(`Effective ${option} must remain enabled by the shared strict config.`);
  }
}
