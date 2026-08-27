export type ShardsPreventableEvent<E extends Event> = E & {
  preventShardsUIHandler(): void;
  shardsUIHandlerPrevented?: boolean;
};

export function makeShardsEventPreventable<E extends Event>(event: E): ShardsPreventableEvent<E> {
  const preventable = event as ShardsPreventableEvent<E>;
  preventable.preventShardsUIHandler ??= () => {
    preventable.shardsUIHandlerPrevented = true;
  };
  return preventable;
}
