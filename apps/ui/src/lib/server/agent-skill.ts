import skillSource from "../../../../../skills/coss-svelte/SKILL.md?raw";
import componentCatalogSource from "../../../../../skills/coss-svelte/references/component-catalog.md?raw";
import implementationGuideSource from "../../../../../skills/coss-svelte/references/implementation-guide.md?raw";

export const agentSkillName = "coss-svelte";
export const agentSkillDescription =
  "Install and compose COSS for Svelte components with the registry, Svelte 5, and Shards UI.";

const references = {
  "component-catalog.md": componentCatalogSource,
  "implementation-guide.md": implementationGuideSource,
} as const;

export type AgentSkillReference = keyof typeof references;

export function getAgentSkillSource(): string {
  return skillSource;
}

export function getAgentSkillReference(name: AgentSkillReference): string {
  return references[name];
}

export function createAgentSkillsIndex() {
  return {
    $schema: "https://schemas.agentskills.io/discovery/0.2.0/schema.json",
    skills: [
      {
        description: agentSkillDescription,
        name: agentSkillName,
        type: "skill-md",
        url: `/.well-known/agent-skills/${agentSkillName}/SKILL.md`,
      },
    ],
  };
}

export function createLegacySkillsIndex() {
  return {
    skills: [
      {
        description: agentSkillDescription,
        files: ["skill.md"],
        name: agentSkillName,
      },
    ],
  };
}

export function agentSkillResponse(body: string): Response {
  return new Response(body, {
    headers: {
      "cache-control": "public, max-age=0, must-revalidate",
      "content-type": "text/markdown; charset=utf-8",
    },
  });
}

export function agentSkillJsonResponse(body: unknown): Response {
  return new Response(`${JSON.stringify(body, null, 2)}\n`, {
    headers: {
      "cache-control": "public, max-age=0, must-revalidate",
      "content-type": "application/json; charset=utf-8",
    },
  });
}
