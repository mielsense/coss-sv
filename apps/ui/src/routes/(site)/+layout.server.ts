import { getRepositoryStars } from "$lib/server/repository-stars.js";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async () => ({
  repositoryStars: await getRepositoryStars(),
});
