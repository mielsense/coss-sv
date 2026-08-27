import { readFile } from "node:fs/promises";
import { describe, expect, test } from "vitest";
import { appRoot } from "../../scripts/registry/lib.mjs";

type VercelConfig = {
  headers: Array<{
    headers: Array<{ key: string; value: string }>;
    source: string;
  }>;
  redirects: Array<{
    destination: string;
    permanent: boolean;
    source: string;
  }>;
};

async function readConfig() {
  return JSON.parse(await readFile(`${appRoot}/vercel.json`, "utf8")) as VercelConfig;
}

describe("Vercel registry delivery", () => {
  test("applies CORS, cache, and content-type protection to registry JSON", async () => {
    const config = await readConfig();
    const registryHeaders = config.headers.find(({ source }) => source === "/r/(.*)\\.json");

    expect(registryHeaders?.headers).toEqual(
      expect.arrayContaining([
        { key: "Access-Control-Allow-Origin", value: "*" },
        {
          key: "Cache-Control",
          value: "public, max-age=0, s-maxage=31536000, stale-while-revalidate=86400",
        },
        { key: "X-Content-Type-Options", value: "nosniff" },
      ]),
    );
  });

  test("redirects extensionless registry requests to JSON temporarily", async () => {
    const config = await readConfig();

    expect(config.redirects).toContainEqual({
      source: "/r/:name",
      destination: "/r/:name.json",
      permanent: false,
    });
  });
});
