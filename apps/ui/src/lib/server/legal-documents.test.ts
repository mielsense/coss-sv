import { readFile } from "node:fs/promises";
import { describe, expect, test } from "vitest";
import { GET as getLicense } from "../../routes/(machine)/LICENSE/+server.js";
import { GET as getNotice } from "../../routes/(machine)/NOTICE.md/+server.js";
import { GET as getThirdPartyNotices } from "../../routes/(machine)/THIRD_PARTY_NOTICES.md/+server.js";

const legalRoutes = [
  {
    canonical: new URL("../../../../../LICENSE", import.meta.url),
    get: getLicense,
    path: "/LICENSE",
  },
  {
    canonical: new URL("../../../../../NOTICE.md", import.meta.url),
    get: getNotice,
    path: "/NOTICE.md",
  },
  {
    canonical: new URL("../../../../../THIRD_PARTY_NOTICES.md", import.meta.url),
    get: getThirdPartyNotices,
    path: "/THIRD_PARTY_NOTICES.md",
  },
] as const;

describe("legal document routes", () => {
  for (const legalRoute of legalRoutes) {
    test(`${legalRoute.path} serves the canonical repository document`, async () => {
      const response = await legalRoute.get({} as never);
      const canonical = await readFile(legalRoute.canonical, "utf8");

      expect(response.status).toBe(200);
      expect(response.headers.get("content-type")).toBe("text/plain; charset=utf-8");
      expect(await response.text()).toBe(canonical);
    });
  }
});
