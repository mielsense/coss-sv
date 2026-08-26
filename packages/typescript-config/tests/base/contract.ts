const values: Record<string, number> = { stable: 1 };

// This error disappears if noUncheckedIndexedAccess is removed.
// @ts-expect-error Indexed values can be undefined.
const indexedValue: number = values.missing;

interface Options {
  label?: string;
}

const options: Options = {};

// This error disappears if exactOptionalPropertyTypes is removed.
// @ts-expect-error An optional property cannot be explicitly set to undefined.
options.label = undefined;

export { indexedValue, options };
