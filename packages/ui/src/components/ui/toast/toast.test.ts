import { render } from "svelte/server";
import { describe, expect, test } from "vitest";
import * as Toast from "./index.js";
import ToastSsrFixture from "./toast.ssr-fixture.svelte";
import { getToastSwipeDirection } from "./toast.types.js";

describe("Toast SSR contract", () => {
  test("renders the provider child, standard viewport, position, and COSS styling hooks", () => {
    const { body } = render(ToastSsrFixture);

    expect(body).toContain("Server child");
    expect(body).toContain('data-slot="toast-portal"');
    expect(body).toContain('data-slot="toast-viewport"');
    expect(body).toContain('data-position="top-center"');
    expect(body).toContain('role="region"');
    expect(body).toContain('aria-live="polite"');
    expect(body).toContain("max-w-90");
  });

  test("exports providers, aliases, managers, and the Shards primitive", () => {
    expect(Toast.Provider).toBeTypeOf("function");
    expect(Toast.AnchoredProvider).toBeTypeOf("function");
    expect(Toast.ToastProvider).toBe(Toast.Provider);
    expect(Toast.AnchoredToastProvider).toBe(Toast.AnchoredProvider);
    expect(Toast.Manager).toBeTypeOf("function");
    expect(Toast.toastManager).toBeInstanceOf(Toast.Manager);
    expect(Toast.anchoredToastManager).toBeInstanceOf(Toast.Manager);
    expect(Toast.ToastPrimitive).toBeTypeOf("object");
  });

  test("maps each viewport edge to the exact permitted swipe directions", () => {
    expect(getToastSwipeDirection("top-left")).toEqual(["left", "up"]);
    expect(getToastSwipeDirection("top-center")).toEqual(["up"]);
    expect(getToastSwipeDirection("top-right")).toEqual(["right", "up"]);
    expect(getToastSwipeDirection("bottom-left")).toEqual(["left", "down"]);
    expect(getToastSwipeDirection("bottom-center")).toEqual(["down"]);
    expect(getToastSwipeDirection("bottom-right")).toEqual(["right", "down"]);
  });
});
