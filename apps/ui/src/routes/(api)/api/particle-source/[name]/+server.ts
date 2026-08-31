import { json } from "@sveltejs/kit";
import { highlightRegistryParticleSource } from "@/content/particle-source.js";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ fetch, params, setHeaders }) => {
  try {
    const response = await fetch(`/r/${encodeURIComponent(params.name)}.json`);
    if (!response.ok) throw new Error("Particle source is unavailable");
    const source = await highlightRegistryParticleSource(params.name, await response.json());
    setHeaders({ "cache-control": "public, max-age=0, must-revalidate, s-maxage=3600" });
    return json(source);
  } catch {
    return json({ message: "Particle source is unavailable." }, { status: 404 });
  }
};
