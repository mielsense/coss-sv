import { afterEach, describe, expect, test, vi } from "vitest";
import {
  createTooltipAttachmentProviderContext,
  type TooltipAttachmentProviderMember,
} from "./provider-context.svelte.js";

function member() {
  return {
    close: vi.fn(),
    setInstant: vi.fn(),
  } satisfies TooltipAttachmentProviderMember;
}

describe("attached Tooltip provider groups", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  test("holds the instant-open window until timeout, then restores the full delay", () => {
    vi.useFakeTimers();
    const context = createTooltipAttachmentProviderContext(() => ({
      closeDelay: 30,
      delay: 120,
      timeout: 400,
    }));
    const first = member();

    expect(context.getOpenDelay(undefined)).toBe(120);
    context.claim(first);
    expect(context.getOpenDelay(undefined)).toBe(0);
    context.release(first);
    vi.advanceTimersByTime(399);
    expect(context.getOpenDelay(undefined)).toBe(0);
    vi.advanceTimersByTime(1);
    expect(context.getOpenDelay(undefined)).toBe(120);
    expect(first.setInstant).toHaveBeenLastCalledWith(false);
  });

  test("keeps instant windows isolated between providers", () => {
    const firstContext = createTooltipAttachmentProviderContext(() => ({
      closeDelay: undefined,
      delay: 100,
      timeout: 400,
    }));
    const secondContext = createTooltipAttachmentProviderContext(() => ({
      closeDelay: undefined,
      delay: 240,
      timeout: 400,
    }));

    firstContext.claim(member());
    expect(firstContext.getOpenDelay(undefined)).toBe(0);
    expect(secondContext.getOpenDelay(undefined)).toBe(240);
  });

  test("clears current membership and timers on removal or provider cleanup", () => {
    vi.useFakeTimers();
    const context = createTooltipAttachmentProviderContext(() => ({
      closeDelay: undefined,
      delay: 150,
      timeout: 400,
    }));
    const first = member();

    context.claim(first);
    context.release(first);
    context.remove(first);
    expect(context.getOpenDelay(undefined)).toBe(150);
    expect(vi.getTimerCount()).toBe(0);

    context.claim(first);
    context.release(first);
    context.destroy();
    expect(context.getOpenDelay(undefined)).toBe(150);
    expect(vi.getTimerCount()).toBe(0);
  });
});
