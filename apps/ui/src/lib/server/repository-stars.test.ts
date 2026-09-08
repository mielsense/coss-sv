import { afterEach, describe, expect, test, vi } from "vitest";
import { createRepositoryStarsReader } from "./repository-stars.js";

afterEach(() => vi.useRealTimers());

const response = (count: unknown) =>
  new Response(JSON.stringify({ stargazers_count: count }), { status: 200 });

describe("public repository star count", () => {
  test.each([2, 0])("returns a real count of %s and caches it", async (count) => {
    let now = 0;
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(response(count));
    const read = createRepositoryStarsReader(fetcher, () => now);
    expect(await read()).toBe(count);
    expect(await read()).toBe(count);
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(fetcher).toHaveBeenCalledWith(
      "https://api.github.com/repos/mielsense/coss-sv",
      expect.objectContaining({
        headers: expect.objectContaining({ Accept: "application/vnd.github+json" }),
        signal: expect.any(AbortSignal),
      }),
    );
    now = 300_001;
    fetcher.mockResolvedValue(response(count + 1));
    expect(await read()).toBe(count + 1);
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  test.each([null, "2", -1, 1.5, Number.MAX_SAFE_INTEGER + 1, {}])(
    "hides malformed count %j",
    async (value) => {
      const read = createRepositoryStarsReader(
        vi.fn<typeof fetch>().mockResolvedValue(response(value)),
      );
      expect(await read()).toBeNull();
    },
  );

  test("hides unavailable counts and briefly caches failures", async () => {
    let now = 0;
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status: 403 }));
    const read = createRepositoryStarsReader(fetcher, () => now);
    expect(await read()).toBeNull();
    expect(await read()).toBeNull();
    expect(fetcher).toHaveBeenCalledTimes(1);
    now = 60_001;
    fetcher.mockResolvedValue(response(2));
    expect(await read()).toBe(2);
  });

  test("handles network and JSON failures", async () => {
    const network = createRepositoryStarsReader(
      vi.fn<typeof fetch>().mockRejectedValue(new Error("offline")),
    );
    const malformed = createRepositoryStarsReader(
      vi.fn<typeof fetch>().mockResolvedValue(new Response("not json")),
    );
    expect(await network()).toBeNull();
    expect(await malformed()).toBeNull();
  });

  test("deduplicates concurrent readers", async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(response(2));
    const read = createRepositoryStarsReader(fetcher);
    expect(await Promise.all([read(), read(), read()])).toEqual([2, 2, 2]);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  test("returns within 1.5 seconds even if the request ignores abort", async () => {
    vi.useFakeTimers();
    const fetcher = vi.fn<typeof fetch>().mockImplementation(() => new Promise(() => {}));
    const read = createRepositoryStarsReader(fetcher);
    const result = read();
    await vi.advanceTimersByTimeAsync(1500);
    expect(await result).toBeNull();
    expect(fetcher.mock.calls[0]?.[1]?.signal?.aborted).toBe(true);
  });
});
