// deno-lint-ignore no-explicit-any
export type Newable<T> = new (...args: any[]) => T;

export interface Abstract<T> {
  prototype: T;
}

export type ServiceIdentifierType<T = unknown> =
  | string
  | symbol
  | Newable<T>
  | Abstract<T>;
