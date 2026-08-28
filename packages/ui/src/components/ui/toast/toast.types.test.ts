import { type ComponentProps, createRawSnippet } from "svelte";
import { expect, expectTypeOf, test } from "vitest";
import {
  type AnchoredProvider,
  type AnchoredToastProviderProps,
  Manager,
  type Provider,
  type ToastData,
  type ToastManagerAddOptions,
  type ToastPortalProps,
  type ToastPortalRef,
  type ToastPortalRefCallback,
  type ToastPosition,
  type ToastProviderProps,
} from "./index.js";

type Equal<Left, Right> =
  (<Value>() => Value extends Left ? 1 : 2) extends <Value>() => Value extends Right ? 1 : 2
    ? true
    : false;

test("types managers, custom data, native actions, promises, positions, and providers", () => {
  type Data = { source: "save" | "copy" };
  const manager = new Manager<Data>();
  const add = {
    actionProps: { "aria-label": "Undo change", children: "Undo", disabled: false, onclick() {} },
    data: { source: "save" },
    description: "Saved description",
    id: "save",
    priority: "high",
    timeout: 0,
    title: "Saved",
    type: "success",
  } satisfies ToastManagerAddOptions<Data>;
  const id = manager.add(add);
  const promise = manager.promise(Promise.resolve("done"), {
    error: (error) => ({ actionProps: undefined, description: String(error), type: "info" }),
    loading: { title: "Loading", type: "loading" },
    success: (value) => ({ actionProps: undefined, description: value, type: "success" }),
  });
  const children = createRawSnippet(() => ({ render: () => "child" }));
  const portalProps = {
    "aria-label": "Toast portal",
    class: "custom-portal",
    container: { current: null as HTMLElement | ShadowRoot | null },
    "data-portal": "custom",
    id: "custom-toast-portal",
    onclick(event) {
      expectTypeOf(event.currentTarget).toEqualTypeOf<EventTarget & HTMLDivElement>();
    },
    ref: ((node) => {
      expectTypeOf(node).toEqualTypeOf<HTMLDivElement | null>();
    }) satisfies ToastPortalRef,
    style: "isolation: isolate",
  } satisfies ToastPortalProps;
  const namedPortalRef: ToastPortalRefCallback = (node) => {
    if (node) return () => undefined;
  };
  const portalRefReturnIsExact: Equal<
    ReturnType<ToastPortalRefCallback>,
    // biome-ignore lint/suspicious/noConfusingVoidType: Assert the exact upstream callback cleanup union.
    void | (() => void)
  > = true;
  const provider = {
    children,
    limit: 4,
    portalProps,
    position: "top-left",
    timeout: 3000,
    toastManager: manager,
  } satisfies ToastProviderProps<Data>;
  const anchored = { children, toastManager: manager } satisfies AnchoredToastProviderProps<Data>;
  const data = {
    rootProps: { "aria-label": "Custom toast", id: "custom-toast" },
    tooltipStyle: true,
  } satisfies ToastData;
  const position: ToastPosition = "bottom-center";

  expect(id).toBeTypeOf("string");
  expect(provider.position).toBe("top-left");
  expect(provider.portalProps.container.current).toBeNull();
  expect(anchored.toastManager).toBe(manager);
  expect(data.tooltipStyle).toBe(true);
  expect(position).toBe("bottom-center");
  expect(portalRefReturnIsExact).toBe(true);
  expectTypeOf(promise).toEqualTypeOf<Promise<string>>();
  expectTypeOf(namedPortalRef).toEqualTypeOf<ToastPortalRefCallback>();
  expectTypeOf<ComponentProps<typeof Provider<Data>>>().toEqualTypeOf<ToastProviderProps<Data>>();
  expectTypeOf<ComponentProps<typeof AnchoredProvider<Data>>>().toEqualTypeOf<
    AnchoredToastProviderProps<Data>
  >();
});
