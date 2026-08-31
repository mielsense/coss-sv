import { flushSync, mount, unmount } from "svelte";
import { afterEach, describe, expect, test, vi } from "vitest";
import { page } from "vitest/browser";
import Fixture from "./use-copy-to-clipboard.browser-fixture.svelte";

afterEach(() => {
  document.body.innerHTML = "";
  vi.useRealTimers();
  vi.restoreAllMocks();
});

function installClipboard(writeText: (value: string) => Promise<void>): void {
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText },
  });
}

describe("useCopyToClipboard", () => {
  test("copies non-empty text, resets after two seconds, and replaces the prior timer", async () => {
    vi.useFakeTimers();
    const writeText = vi.fn(async () => undefined);
    const onCopy = vi.fn();
    installClipboard(writeText);
    const view = mount(Fixture, { props: { onCopy }, target: document.body });
    const copy = page
      .getByRole("button", { exact: true, name: "Copy" })
      .element() as HTMLButtonElement;

    copy.click();
    await Promise.resolve();
    flushSync();
    expect(copy.textContent).toBe("Copied!");
    expect(writeText).toHaveBeenCalledWith("https://coss.com");
    expect(onCopy).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(1_999);
    copy.click();
    await Promise.resolve();
    await vi.advanceTimersByTimeAsync(1);
    flushSync();
    expect(copy.textContent).toBe("Copied!");
    expect(onCopy).toHaveBeenCalledTimes(2);

    await vi.advanceTimersByTimeAsync(1_999);
    flushSync();
    expect(copy.textContent).toBe("Copy");
    await unmount(view);
  });

  test("ignores empty values and reports clipboard rejection without copied feedback", async () => {
    const failure = new Error("clipboard denied");
    const writeText = vi.fn(() => Promise.reject(failure));
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);
    installClipboard(writeText);
    const view = mount(Fixture, { target: document.body });

    (page.getByRole("button", { name: "Copy empty" }).element() as HTMLButtonElement).click();
    expect(writeText).not.toHaveBeenCalled();

    const copy = page
      .getByRole("button", { exact: true, name: "Copy" })
      .element() as HTMLButtonElement;
    copy.click();
    await vi.waitFor(() => expect(consoleError).toHaveBeenCalledWith(failure));
    flushSync();
    expect(copy.textContent).toBe("Copy");
    await unmount(view);
  });
});
