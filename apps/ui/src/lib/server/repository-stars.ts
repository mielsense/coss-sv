const repositoryApiUrl = "https://api.github.com/repos/mielsense/coss-sv";
const successTtl = 5 * 60 * 1000;
const failureTtl = 60 * 1000;
const requestTimeout = 1500;

export function createRepositoryStarsReader(
  fetcher: typeof fetch = fetch,
  now: () => number = Date.now,
): () => Promise<number | null> {
  let cached: { count: number | null; expiresAt: number } | undefined;
  let pending: Promise<number | null> | undefined;

  async function request(): Promise<number | null> {
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout> | undefined;
    const timeout = new Promise<null>((resolve) => {
      timer = setTimeout(() => {
        controller.abort();
        resolve(null);
      }, requestTimeout);
    });
    const count = (async () => {
      try {
        const response = await fetcher(repositoryApiUrl, {
          credentials: "omit",
          headers: {
            Accept: "application/vnd.github+json",
            "User-Agent": "coss-svelte-docs",
            "X-GitHub-Api-Version": "2022-11-28",
          },
          signal: controller.signal,
        });
        if (!response.ok) return null;
        const data: unknown = await response.json();
        if (!data || typeof data !== "object" || !("stargazers_count" in data)) return null;
        const stars = data.stargazers_count;
        return typeof stars === "number" && Number.isSafeInteger(stars) && stars >= 0
          ? stars
          : null;
      } catch {
        return null;
      }
    })();
    try {
      return await Promise.race([count, timeout]);
    } finally {
      clearTimeout(timer);
    }
  }

  return () => {
    if (cached && now() < cached.expiresAt) return Promise.resolve(cached.count);
    if (pending) return pending;
    pending = request().then((count) => {
      cached = { count, expiresAt: now() + (count === null ? failureTtl : successTtl) };
      pending = undefined;
      return count;
    });
    return pending;
  };
}

// Only public repository metadata is shared between requests; no user data or credentials.
export const getRepositoryStars = createRepositoryStarsReader();
