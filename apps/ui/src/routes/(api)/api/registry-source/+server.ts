import { json } from "@sveltejs/kit";
import { loadRegistryComponentSource } from "@/server/registry-component-source.js";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ fetch, setHeaders, url }) => {
  const components = [...new Set(url.searchParams.getAll("name"))];
  if (components.length === 0 || components.length > 16) {
    return json(
      { message: "Provide between one and sixteen registry item names." },
      { status: 400 },
    );
  }

  try {
    const source = await loadRegistryComponentSource(components, async (name) => {
      const response = await fetch(`/r/${encodeURIComponent(name)}.json`);
      if (!response.ok) throw new Error("Registry item is unavailable");
      return response.json();
    });
    setHeaders({ "cache-control": "public, max-age=0, must-revalidate, s-maxage=3600" });
    return json(source);
  } catch {
    return json({ message: "Registry source is unavailable." }, { status: 404 });
  }
};
