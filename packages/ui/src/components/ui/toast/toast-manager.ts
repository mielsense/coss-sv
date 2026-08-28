import type {
  ToastManagerUpdateOptions as PrimitiveToastManagerUpdateOptions,
  ToastManagerAddOptions,
  ToastObject,
} from "@shardsui/svelte";
import { Toast as ToastPrimitive } from "@shardsui/svelte";

export type ToastManagerUpdateOptions<Data extends object = object> = {
  [Key in keyof PrimitiveToastManagerUpdateOptions<Data>]?:
    | PrimitiveToastManagerUpdateOptions<Data>[Key]
    | undefined;
};

export type ToastManagerPromiseOptions<Value, Data extends object = object> = {
  loading: string | ToastManagerUpdateOptions<Data>;
  success:
    | string
    | ToastManagerUpdateOptions<Data>
    | ((result: Value) => string | ToastManagerUpdateOptions<Data>);
  error:
    | string
    | ToastManagerUpdateOptions<Data>
    | ((error: unknown) => string | ToastManagerUpdateOptions<Data>);
};

type ToastMutationTarget<Data extends object> = {
  add(options: ToastManagerAddOptions<Data>): string;
  update(id: string, updates: ToastManagerUpdateOptions<Data>): void;
};

export type ToastManagerContext<Data extends object = object> = ToastMutationTarget<Data> & {
  readonly toasts: ToastObject<Data>[];
  close(id?: string): void;
  promise<Value, T extends Data = Data>(
    promiseValue: Promise<Value>,
    options: ToastManagerPromiseOptions<Value, T>,
  ): Promise<Value>;
};

function toUpdateOptions<Data extends object>(
  options: string | ToastManagerUpdateOptions<Data>,
): ToastManagerUpdateOptions<Data> {
  return typeof options === "string" ? { description: options } : options;
}

function resolvePromiseOptions<Value, Data extends object>(
  options:
    | string
    | ToastManagerUpdateOptions<Data>
    | ((result: Value) => string | ToastManagerUpdateOptions<Data>),
  result: Value,
): ToastManagerUpdateOptions<Data> {
  return toUpdateOptions(options instanceof Function ? options(result) : options);
}

function asPrimitiveUpdate<Data extends object>(
  updates: ToastManagerUpdateOptions<Data>,
): PrimitiveToastManagerUpdateOptions<Data> {
  return updates as PrimitiveToastManagerUpdateOptions<Data>;
}

function handlePromise<Value, Data extends object>(
  target: ToastMutationTarget<Data>,
  promiseValue: Promise<Value>,
  options: ToastManagerPromiseOptions<Value, Data>,
): Promise<Value> {
  const loadingOptions = toUpdateOptions(options.loading);
  const id = target.add({ ...loadingOptions, type: "loading" } as ToastManagerAddOptions<Data>);

  return promiseValue
    .then((result) => {
      const successOptions = resolvePromiseOptions(options.success, result);
      target.update(id, {
        ...successOptions,
        timeout: successOptions.timeout,
        type: successOptions.type ?? "success",
      });
      return result;
    })
    .catch((error: unknown) => {
      const errorOptions = resolvePromiseOptions(options.error, error);
      target.update(id, {
        ...errorOptions,
        timeout: errorOptions.timeout,
        type: errorOptions.type ?? "error",
      });
      return Promise.reject(error);
    });
}

export class ToastManager<Data extends object = object> extends ToastPrimitive.Manager<Data> {
  override promise<Value, T extends Data = Data>(
    promiseValue: Promise<Value>,
    options: ToastManagerPromiseOptions<Value, T>,
  ): Promise<Value> {
    return handlePromise(
      {
        add: (addOptions) => this.add(addOptions),
        update: (id, updates) => this.update(id, asPrimitiveUpdate(updates)),
      },
      promiseValue,
      options,
    );
  }
}

export function getToastManager<Data extends object = object>(): ToastManagerContext<Data> {
  const primitive = ToastPrimitive.getToastManager<Data>();
  const target: ToastMutationTarget<Data> = {
    add: primitive.add,
    update(id, updates) {
      primitive.update(id, asPrimitiveUpdate(updates));
    },
  };

  return {
    get toasts() {
      return primitive.toasts;
    },
    add: target.add,
    close: primitive.close,
    promise: (promiseValue, options) => handlePromise(target, promiseValue, options),
    update: target.update,
  };
}
