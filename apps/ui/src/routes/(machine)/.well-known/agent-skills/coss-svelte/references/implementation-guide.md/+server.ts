import { agentSkillResponse, getAgentSkillReference } from "@/server/agent-skill.js";
import type { RequestHandler } from "./$types";

export const prerender = true;

export const GET: RequestHandler = () =>
  agentSkillResponse(getAgentSkillReference("implementation-guide.md"));
