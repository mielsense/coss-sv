import { mount, unmount } from "svelte";
import { afterEach, describe, expect, test, vi } from "vitest";
import { page } from "vitest/browser";
import DocsTocFixture from "./docs-toc.browser-fixture.svelte";

type IntersectionCallback = ConstructorParameters<typeof IntersectionObserver>[0];
type MutationCallback = ConstructorParameters<typeof MutationObserver>[0];

class IntersectionObserverStub {
  static instances: IntersectionObserverStub[] = [];
  readonly callback: IntersectionCallback;
  disconnected = false;
  observed: Element[] = [];

  constructor(callback: IntersectionCallback) {
    this.callback = callback;
    IntersectionObserverStub.instances.push(this);
  }

  disconnect(): void {
    this.disconnected = true;
  }

  observe(element: Element): void {
    this.observed.push(element);
  }

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  unobserve(): void {}
}

class MutationObserverStub {
  static instances: MutationObserverStub[] = [];
  readonly callback: MutationCallback;
  disconnected = false;

  constructor(callback: MutationCallback) {
    this.callback = callback;
    MutationObserverStub.instances.push(this);
  }

  disconnect(): void {
    this.disconnected = true;
  }

  observe(): void {}

  takeRecords(): MutationRecord[] {
    return [];
  }

  notify(): void {
    this.callback([], this as unknown as MutationObserver);
  }
}

afterEach(() => {
  document.body.innerHTML = "";
  IntersectionObserverStub.instances = [];
  MutationObserverStub.instances = [];
  vi.restoreAllMocks();
});

describe("documentation table of contents", () => {
  test("rebuilds relationships when the documentation content is replaced", async () => {
    vi.stubGlobal("IntersectionObserver", IntersectionObserverStub);
    vi.stubGlobal("MutationObserver", MutationObserverStub);
    const view = mount(DocsTocFixture, { target: document.body });

    await expect
      .element(page.getByRole("link", { name: "Initial heading" }))
      .toHaveAttribute("href", "#initial-heading");
    const firstIntersection = IntersectionObserverStub.instances[0];
    expect(firstIntersection?.observed.map((element) => element.id)).toEqual(["initial-heading"]);

    await page.getByRole("button", { name: "Replace content" }).click();
    MutationObserverStub.instances[0]?.notify();

    await expect
      .element(page.getByRole("link", { name: "Replacement heading" }))
      .toHaveAttribute("href", "#replacement-heading");
    await expect
      .element(page.getByRole("link", { name: "Replacement detail" }))
      .toHaveAttribute("data-depth", "3");
    expect(firstIntersection?.disconnected).toBe(true);
    expect(IntersectionObserverStub.instances[1]?.observed.map((element) => element.id)).toEqual([
      "replacement-heading",
      "replacement-detail",
    ]);

    await unmount(view);
    expect(IntersectionObserverStub.instances[1]?.disconnected).toBe(true);
    expect(MutationObserverStub.instances[0]?.disconnected).toBe(true);
  });
});
