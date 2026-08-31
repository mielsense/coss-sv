import { readFile } from "node:fs/promises";
import { describe, expect, test } from "vitest";
import {
  agentSkillDescription,
  agentSkillJsonResponse,
  agentSkillName,
  agentSkillResponse,
  createAgentSkillsIndex,
  createLegacySkillsIndex,
  getAgentSkillReference,
  getAgentSkillSource,
} from "../../src/lib/server/agent-skill.js";

describe("agent skill publication", () => {
  test("serves the checked-in skill as the canonical source", async () => {
    const checkedIn = await readFile(
      new URL("../../../../skills/coss-svelte/SKILL.md", import.meta.url),
      "utf8",
    );

    expect(getAgentSkillSource()).toBe(checkedIn);
    expect(getAgentSkillSource()).toContain("name: coss-svelte");
    expect(getAgentSkillReference("component-catalog.md")).toContain("# Component catalog");
    expect(getAgentSkillReference("implementation-guide.md")).toContain("# Implementation guide");
  });

  test("advertises canonical and compatibility discovery indexes", () => {
    expect(createAgentSkillsIndex()).toEqual({
      $schema: "https://schemas.agentskills.io/discovery/0.2.0/schema.json",
      skills: [
        {
          description: agentSkillDescription,
          name: agentSkillName,
          type: "skill-md",
          url: "/.well-known/agent-skills/coss-svelte/SKILL.md",
        },
      ],
    });
    expect(createLegacySkillsIndex()).toEqual({
      skills: [
        {
          description: agentSkillDescription,
          files: ["skill.md"],
          name: agentSkillName,
        },
      ],
    });
  });

  test("uses a Markdown response contract", () => {
    const response = agentSkillResponse(getAgentSkillSource());

    expect(response.headers.get("content-type")).toBe("text/markdown; charset=utf-8");
    expect(response.headers.get("cache-control")).toBe("public, max-age=0, must-revalidate");
  });

  test("uses a stable JSON discovery response contract", async () => {
    const response = agentSkillJsonResponse(createAgentSkillsIndex());

    expect(response.headers.get("content-type")).toBe("application/json; charset=utf-8");
    expect(response.headers.get("cache-control")).toBe("public, max-age=0, must-revalidate");
    expect(await response.json()).toEqual(createAgentSkillsIndex());
  });
});
