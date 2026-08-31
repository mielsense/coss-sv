import { afterEach, describe, expect, test, vi } from "vitest";
import { nearViewport } from "./near-viewport";

type IntersectionCallback = ConstructorParameters<typeof IntersectionObserver>[0];

class IntersectionObserverStub {
  static instances: IntersectionObserverStub[] = [];
  readonly callback: IntersectionCallback;
  readonly observed = new Set<Element>();

  constructor(callback: IntersectionCallback) {
    this.callback = callback;
    IntersectionObserverStub.instances.push(this);
  }

  disconnect(): void {
    this.observed.clear();
  }

  observe(node: Element): void {
    this.observed.add(node);
  }

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  trigger(node: Element): void {
    this.callback(
      [{ isIntersecting: true, target: node } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver,
    );
  }

  unobserve(node: Element): void {
    this.observed.delete(node);
  }
}

afterEach(() => {
  IntersectionObserverStub.instances = [];
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("nearViewport", () => {
  test("preserves the latest registration when an older attachment cleans up", () => {
    vi.stubGlobal("IntersectionObserver", IntersectionObserverStub);
    const node = document.createElement("section");
    const staleCallback = vi.fn();
    const currentCallback = vi.fn();

    const releaseStale = nearViewport(staleCallback)(node);
    const releaseCurrent = nearViewport(currentCallback)(node);
    releaseStale?.();

    IntersectionObserverStub.instances[0]?.trigger(node);

    expect(staleCallback).not.toHaveBeenCalled();
    expect(currentCallback).toHaveBeenCalledOnce();
    releaseCurrent?.();
  });

  test("loads an initially near target when the browser suppresses observer callbacks", async () => {
    vi.useFakeTimers();
    vi.stubGlobal("IntersectionObserver", IntersectionObserverStub);
    const node = document.createElement("section");
    vi.spyOn(node, "getBoundingClientRect").mockReturnValue(
      DOMRect.fromRect({ height: 200, width: 300, x: 0, y: 200 }),
    );
    const onVisible = vi.fn();

    nearViewport(onVisible)(node);
    await vi.advanceTimersByTimeAsync(0);

    expect(onVisible).toHaveBeenCalledOnce();
  });

  test("checks offscreen targets after scrolling when the observer stays silent", async () => {
    vi.useFakeTimers();
    vi.stubGlobal("IntersectionObserver", IntersectionObserverStub);
    const node = document.createElement("section");
    let top = window.innerHeight + 1_000;
    vi.spyOn(node, "getBoundingClientRect").mockImplementation(() =>
      DOMRect.fromRect({ height: 200, width: 300, x: 0, y: top }),
    );
    const onVisible = vi.fn();

    const release = nearViewport(onVisible)(node);
    await vi.advanceTimersByTimeAsync(0);
    expect(onVisible).not.toHaveBeenCalled();

    top = window.innerHeight;
    window.dispatchEvent(new Event("scroll"));
    await vi.advanceTimersByTimeAsync(0);

    expect(onVisible).toHaveBeenCalledOnce();
    release?.();
  });
});
